import time
import sys
import requests
import socket
from concurrent.futures import ThreadPoolExecutor
from selenium import webdriver
import threading
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
import argparse
from selenium.common.exceptions import WebDriverException
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By

id = "pgeeccodgkdifnmlianfniimpdcihdcp"
PORT = 6873
BASE_API_URL = f"http://127.0.0.1:{PORT}/api/v1"
CONTAINER_LIST_URL = f"{BASE_API_URL}/env/list"
BROWSER_START_URL = f"{BASE_API_URL}/browser/start"
BROWSER_STOP_URL = f"{BASE_API_URL}/browser/stop"
DISPLAY_ALL_URL = f"{BASE_API_URL}/display/all"
BROWSER_ARRANGE_URL = f"{BASE_API_URL}/browser/arrange"
BATCH_DELAY = 5
BATCH_SIZE = 20
MAX_WORKERS = 20
WINDOWS_PER_ROW = 4

def check_service_availability(host="127.0.0.1", port=PORT, timeout=5):
    """检查 Hubstudio 服务是否可用"""
    try:
        sock = socket.create_connection((host, port), timeout)
        sock.close()
        print(f"Hubstudio 服务在 {host}:{port} 上可达")
        return True
    except Exception as e:
        print(f"无法连接到 Hubstudio 服务 {host}:{port}: {e}")
        return False

def list_available_containers(start_page=1, containers_per_batch=10, processed_pages=None, max_retries=5):
    if processed_pages is None:
        processed_pages = set()
    
    # 收集所有可用容器
    all_containers = []
    current_page = start_page
    container_ids = set()  # 跟踪已处理的容器ID
    max_pages_to_check = 50  # 限制最大查询页数，避免无限循环
    actual_pages = []
    
    print(f"开始收集容器，从页码 {start_page} 开始，最多收集 {containers_per_batch} 个容器")
    
    pages_checked = 0
    while len(all_containers) < containers_per_batch and pages_checked < max_pages_to_check:
        print(f"检查页码: {current_page}")
        for attempt in range(max_retries):
            try:
                payload = {"current": current_page, "size": 1}
                headers = {"Content-Type": "application/json"}
                response = requests.post(CONTAINER_LIST_URL, json=payload, headers=headers, timeout=30)
                data = response.json()
                print(data)
                if data['code'] != 0:
                    raise ValueError(f"获取容器列表失败: {data['msg']}")
                
                containers = data['data']['list']
                if not containers:
                    print(f"页面 {current_page} 没有可用容器")
                    break
                
                container_code = containers[0]['containerCode']
                container_name = containers[0]['containerName']
                print(f"页面 {current_page}: 找到容器ID {container_code}, 容器名称 {container_name}")
                
                if current_page in processed_pages:
                    print(f"页面 {current_page} 已处理，跳过")
                    current_page += 1
                    pages_checked += 1
                    continue
                
                if container_code in container_ids:
                    print(f"容器 {container_code} 已存在，跳过")
                    current_page += 1
                    pages_checked += 1
                    continue
                
                container_ids.add(container_code)
                containers[0]['page_number'] = current_page
                containers[0]['container_name'] = container_name
                all_containers.append((containers[0], current_page))
                actual_pages.append(current_page)
                print(f"添加容器: {container_code} (页码 {current_page}, 名称 {container_name})")
                current_page += 1
                pages_checked += 1
                break
            except Exception as e:
                print(f"列出第 {current_page} 页容器时出错 (尝试 {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    current_page += 1
                    pages_checked += 1
                time.sleep(5)
    
    print(f"收集了 {len(all_containers)} 个容器，按ID排序")
    all_containers.sort(key=lambda x: int(x[0]['containerCode']))
    
    print("排序后的容器列表:")
    for i, (container, page) in enumerate(all_containers):
        print(f"索引 {i}: 容器ID {container['containerCode']} (页码 {container['page_number']}, 名称 {container['container_name']})")
    
    print(f"实际获取的页码: {actual_pages}")
    return all_containers, current_page - 1

def start_browser(container_code, window_position, page_number, max_retries, processed_pages=None):
    if processed_pages is None:
        processed_pages = set()
    
    if page_number in processed_pages:
        return None
    
    for attempt in range(max_retries):
        try:
            print(f"尝试启动容器 {container_code} (尝试 {attempt + 1}/{max_retries})")
            open_data = {"containerCode": str(container_code)}
            response = requests.post(BROWSER_START_URL, json=open_data, timeout=60)
            data = response.json()
            if data['code'] != 0:
                raise ValueError(f"启动容器失败: {data['msg']}")
            
            webdriver_path = data['data']['webdriver']
            debugging_port = data['data']['debuggingPort']
            options = Options()
            options.add_experimental_option("debuggerAddress", f"127.0.0.1:{debugging_port}")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            driver = webdriver.Chrome(service=Service(webdriver_path), options=options)
            
            x, y = window_position
            driver.set_window_rect(x, y, 650, 740)
            print(f"容器 {container_code} 设置位置: ({x}, {y})")
            return driver
        except Exception as e:
            print(f"启动容器 {container_code} 时出错 (尝试 {attempt + 1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                return None
            time.sleep(5)
    return None

def calculate_window_position(index, total, columns, containers_per_batch):
    col = index % columns
    row = index // columns
    x = col * (640)
    y = row * (710 + 2)
    print(f"计算位置 for index {index}: col={col}, row={row}, x={x}, y={y}")
    return x, y

def stop_browser(container_code, max_retries=3):
    payload = {"containerCode": str(container_code)}
    headers = {"Content-Type": "application/json"}
    for attempt in range(max_retries):
        try:
            response = requests.post(BROWSER_STOP_URL, json=payload, headers=headers, timeout=30)
            data = response.json()
            if data['code'] == 0 and data['data'].get('statusCode') == "0":
                print(f"容器 {container_code} 浏览器环境关闭成功")
                return True
            else:
                print(f"关闭容器 {container_code} 失败: {data.get('msg', '未知错误')}")
                return False
        except Exception as e:
            print(f"关闭容器 {container_code} 时出错 (尝试 {attempt + 1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                return False
            time.sleep(5)
    return False

def is_driver_valid(driver, container_code):
    """检查驱动是否有效"""
    if driver is None or not hasattr(driver, 'service') or not driver.service.is_connectable():
        print(f"容器 {container_code} 的驱动程序不再有效")
        return False
    return True

def process_all_containers(drivers, target_url, containers_info, start_page_ref, processed_pages, pr):
    print("启动所有容器...")
    time.sleep(5)
    
    thread_pool = {}
    active_drivers = {}
    for driver, container_code, page_number in drivers:
        active_drivers[container_code] = driver
        
    print(f"初始活动容器数量: {len(active_drivers)}")
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        for driver, container_code, page_number in drivers:
            container_info = next((c for c in containers_info if c['container_code'] == container_code), None)
            if container_info:
                container_name = container_info.get('container_name')
                thread_pool[container_code] = executor.submit(
                    handle_backpack, driver, container_code, target_url, page_number, pr, container_name
                )
                print(f"线程启动: 容器 {container_code}, 页码 {page_number}, 容器名称 {container_name}, 使用密钥第 {container_name} 行")
            else:
                print(f"警告: 未找到容器 {container_code} 的信息")
                continue
        
        while active_drivers:
            completed = []
            for container_code, future in list(thread_pool.items()):
                if future.done():
                    completed.append(container_code)
                    print(f"线程完成: 容器 {container_code}")
                    
                    driver = active_drivers.get(container_code)
                    if driver:
                        try:
                            driver.quit()
                            print(f"容器 {container_code} Selenium 会话已关闭")
                        except Exception as e:
                            print(f"关闭容器 {container_code} Selenium 会话时出错: {e}")
                    
                    if stop_browser(container_code):
                        print(f"容器 {container_code} Hubstudio API 关闭成功")
                    else:
                        print(f"容器 {container_code} Hubstudio API 关闭失败")
                    
                    try:
                        container_info = next(c for c in containers_info if c['container_code'] == container_code)
                        position = container_info['position']
                    except StopIteration:
                        print(f"未找到容器 {container_code} 的位置信息，使用默认位置 (0, 0)")
                        position = (0, 0)
                    
                    print(f"容器 {container_code} 原位置: {position}")
                    
                    while True:
                        start_page_ref[0] += 1
                        if start_page_ref[0] in processed_pages:
                            print(f"页面 {start_page_ref[0]} 已处理，跳过")
                            continue
                        
                        print(f"尝试获取新容器，当前页码: {start_page_ref[0]}")
                        new_containers, last_page = list_available_containers(start_page_ref[0], 1, processed_pages)
                        if not new_containers:
                            print("没有更多可用容器")
                            break
                        
                        new_container, page_number = new_containers[0]
                        new_container_code = new_container['containerCode']
                        new_page = new_container['page_number']
                        new_container_name = new_container['container_name']
                        
                        print(f"尝试启动新容器: {new_container_code}, 页码 {new_page}, 名称 {new_container_name}")
                        
                        new_driver = start_browser(new_container_code, position, page_number, 5, processed_pages)
                        if new_driver:
                            print(f"容器 {new_container_code} 启动成功")
                            active_drivers[new_container_code] = new_driver
                            containers_info.append({
                                'container_code': new_container_code, 
                                'position': position,
                                'page_number': new_page,
                                'container_name': new_container_name
                            })
                            processed_pages.add(page_number)
                            thread_pool[new_container_code] = executor.submit(
                                handle_backpack, new_driver, new_container_code,
                                target_url, new_page, pr, new_container_name
                            )
                            print(f"已为 {new_container_code} 创建新线程在位置 {position}, 使用密钥第 {new_container_name} 行")
                            break
                        else:
                            print(f"无法启动新容器 {new_container_code}")
                            continue
                    
                    if container_code in active_drivers:
                        del active_drivers[container_code]
            
            for container_code in completed:
                if container_code in thread_pool:
                    del thread_pool[container_code]
                    print(f"线程清理: 容器 {container_code}, 剩余活动容器: {len(active_drivers)}")
            
            if not active_drivers and not thread_pool:
                print("所有容器处理完成，退出循环")
                break
                
            time.sleep(1)
    
    print("所有容器处理完成")

def handle_backpack(driver, container_code, target_url, current_page, pr, container_name):
    main_handle = driver.current_window_handle
    local_success_flag = threading.local()
    local_success_flag.value = False
    a = 1
    b = 1
    
    try:
        with open(pr, 'r') as f:
            secret_phrases = f.readlines()
    except Exception as e:
        print(f"❌ 容器 {container_code} 处理失败：无法读取密钥文件")
        return False

    try:
        if not container_name or int(container_name) <= 0:
            print(f"❌ 容器 {container_code} 处理失败：无效的容器名称 {container_name}")
            return False

        line_number = int(container_name)
        phrase_index = line_number - 1
        if phrase_index < 0 or phrase_index >= len(secret_phrases):
            print(f"❌ 容器 {container_code} 处理失败：容器名称 {container_name} 对应的第 {line_number} 行超出密钥文件范围")
            return False
        secret_phrase = secret_phrases[phrase_index].strip()
        print(f"使用容器名称 {container_name}, 对应密钥文件第 {line_number} 行")

        with open('codeid_secret.txt', 'a') as f:
            f.write(f"{container_code}:{secret_phrase}\n")

    except Exception as e:
        print(f"获取密钥失败: {str(e)}")
        print(f"❌ 容器 {container_code} 处理失败：获取密钥失败")
        return False
    time.sleep(10)

    for handle in driver.window_handles:
        if handle != main_handle:
            driver.switch_to.window(handle)
            driver.close()
    time.sleep(5)
    driver.switch_to.window(main_handle)
    
    max_retries = 5
    retry_count = 0

    while retry_count < max_retries:
        try:
            if a == 1:
                if b == 1:
                    driver.get(target_url)
                    b = 0
                    time.sleep(5)

                if driver.current_url == f"chrome-extension://{id}/home.html#unlock" or driver.current_url == f"chrome-extension://{id}/home.html#" or driver.current_url == f"chrome-extension://{id}/home.html#onboarding/secure-your-wallet" or driver.current_url == f"chrome-extension://{id}/home.html#onboarding/confirm-recovery-phrase":
                    break

                try:
                    terms_checkbox = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "#onboarding__terms-checkbox"))
                    )
                    terms_checkbox.click()
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到条款复选框，继续处理")
                    pass

                try:
                    import_wallet_btn = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='onboarding-import-wallet']"))
                    )
                    import_wallet_btn.click()
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到导入钱包按钮，继续处理")
                    pass

                try:
                    agree_btn = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='metametrics-i-agree']"))
                    )
                    agree_btn.click()
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到同意按钮，继续处理")
                    pass

                try:
                    words = secret_phrase.split()
                    for i, word in enumerate(words):
                        word_input = WebDriverWait(driver, 10).until(
                            EC.presence_of_element_located((By.CSS_SELECTOR, f"[data-testid='import-srp__srp-word-{i}']"))
                        )
                        word_input.send_keys(word)
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 输入助记词失败，继续处理")
                    pass

                try:
                    confirm_btn = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='import-srp-confirm']"))
                    )
                    driver.execute_script("arguments[0].scrollIntoView(true);", confirm_btn)
                    time.sleep(1)
                    confirm_btn.click()
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到确认按钮，继续处理")
                    pass

                try:
                    password_input = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='create-password-new']"))
                    )
                    password_input.send_keys("Web361535566!")
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到密码输入框，继续处理")
                    pass

                try:
                    confirm_password_input = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='create-password-confirm']"))
                    )
                    confirm_password_input.send_keys("Web361535566!")
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到确认密码输入框，继续处理")
                    pass

                try:
                    terms_checkbox = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='create-password-terms']"))
                    )
                    terms_checkbox.click()
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到条款复选框，继续处理")
                    pass

                try:
                    import_btn = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='create-password-import']"))
                    )
                    import_btn.click()
                    time.sleep(5)
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到导入按钮，继续处理")
                    pass

                try:
                    got_it_btn = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='onboarding-complete-done']"))
                    )
                    got_it_btn.click()
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到完成按钮，继续处理")
                    pass

                try:
                    next_btn = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='pin-extension-next']"))
                    )
                    next_btn.click()
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到下一步按钮，继续处理")
                    pass

                try:
                    done_btn = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.CSS_SELECTOR, "[data-testid='pin-extension-done']"))
                    )
                    if done_btn:
                        done_btn.click()
                        time.sleep(5)
                        print(f"✅ 容器 {container_code} 处理成功：钱包导入完成")
                        local_success_flag.value = True
                        return True
                except Exception as e:
                    print(f"⚠️ 容器 {container_code} 未找到完成按钮，继续处理")
                    pass

                retry_count += 1

                if driver.current_url == f"chrome-extension://{id}/home.html#unlock" or driver.current_url == f"chrome-extension://{id}/home.html#":
                    break

            if not is_driver_valid(driver, container_code):
                print(f"❌ 容器 {container_code} 处理失败：驱动程序无效")
                return False

        except Exception as e:
            print(f"容器 {container_code} 处理过程中出错: {str(e)}")
            retry_count += 1
            if retry_count < max_retries:
                print(f"重试 {retry_count}/{max_retries}")
                time.sleep(5)
            else:
                print(f"❌ 容器 {container_code} 处理失败：达到最大重试次数")
                return False
    
    return True

def get_all_container_codes(max_pages=50):
    """获取所有容器的containerCode并排序"""
    all_container_codes = []
    current_page = 1
    processed_codes = set()
    
    print("开始获取所有容器的containerCode...")
    
    while current_page <= max_pages:
        try:
            payload = {"current": current_page, "size": 1}
            headers = {"Content-Type": "application/json"}
            response = requests.post(CONTAINER_LIST_URL, json=payload, headers=headers, timeout=30)
            data = response.json()
            
            if data['code'] != 0:
                print(f"获取第 {current_page} 页失败: {data['msg']}")
                break
                
            containers = data['data']['list']
            if not containers:
                print(f"第 {current_page} 页没有容器，停止获取")
                break
                
            container_code = containers[0]['containerCode']
            if container_code in processed_codes:
                print(f"容器 {container_code} 已存在，跳过")
                current_page += 1
                continue
                
            processed_codes.add(container_code)
            all_container_codes.append({
                'containerCode': container_code,
                'page': current_page
            })
            print(f"获取到容器: {container_code} (页码: {current_page})")
            current_page += 1
            
        except Exception as e:
            print(f"获取第 {current_page} 页时出错: {str(e)}")
            break
    
    all_container_codes.sort(key=lambda x: int(x['containerCode']))
    
    print("\n排序后的容器列表:")
    for i, container in enumerate(all_container_codes):
        print(f"索引 {i}: 容器ID {container['containerCode']} (页码 {container['page']})")
    
    return all_container_codes

def main(containers_per_batch, start_page, target_url, page_number, pr):
    """主函数"""
    try:
        with open(pr, 'r') as f:
            secret_phrases = f.readlines()
        if not secret_phrases:
            print("❌ 密钥文件为空")
            sys.exit(1)
        print(f"密钥文件包含 {len(secret_phrases)} 行")
    except Exception as e:
        print(f"❌ 无法读取密钥文件: {e}")
        sys.exit(1)
    
    if not check_service_availability():
        print("Hubstudio 服务不可用，请确保 hubstudio_connector.exe 正在运行")
        sys.exit(1)
    
    columns = 4
    start_page_ref = [start_page]
    processed_pages = set()
    processed_container_ids = set()
    
    while True:
        containers, last_page = list_available_containers(start_page_ref[0], containers_per_batch, processed_pages)
        
        if not containers:
            print("未找到更多容器")
            print("✅ 当前循环处理完成，准备重新开始")
            start_page_ref[0] = 1
            processed_pages.clear()
            processed_container_ids.clear()
            print("开始新一轮处理...")
            continue
        
        print(f"\n处理 {len(containers)} 个容器的批次，按ID排序处理")
        
        drivers = []
        containers_info = []
        
        for index, (container, page_number) in enumerate(containers):
            container_code = container['containerCode']
            actual_page = container['page_number']
            container_name = container['container_name']
            
            if container_code in processed_container_ids:
                print(f"容器 {container_code} 已处理过，跳过")
                continue
                
            window_position = calculate_window_position(index, len(containers), columns, containers_per_batch)
            driver = start_browser(container_code, window_position, page_number, 5, processed_pages)
            if driver:
                drivers.append((driver, container_code, actual_page))
                containers_info.append({
                    'container_code': container_code, 
                    'position': window_position,
                    'page_number': actual_page,
                    'container_name': container_name
                })
                processed_pages.add(page_number)
                processed_container_ids.add(container_code)
            else:
                print(f"跳过启动失败的容器 {container_code}")
            time.sleep(5)
        
        if drivers:
            process_all_containers(drivers, target_url, containers_info, start_page_ref, processed_pages, pr)
        
        start_page_ref[0] = last_page + 1

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="运行 Hubstudio 浏览器自动化")
    parser.add_argument("--start-page", type=int, default=input("请输入起始页数："))
    parser.add_argument("--containers-per-batch", type=int, default=input("请输入浏览器数量："))
    parser.add_argument("--target-url", type=str, default=f"chrome-extension://{id}/home.html#onboarding/welcome")
    parser.add_argument("--list-containers", action="store_true", help="列出所有容器ID")
    parser.add_argument("--pr", type=str, default=input("请输入密钥路径："), help="密钥文件路径")
    args = parser.parse_args()

    if args.list_containers:
        get_all_container_codes()
        sys.exit(0)

    page_number = 0
    main(args.containers_per_batch, args.start_page, args.target_url, page_number, args.pr)