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
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.keys import Keys

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
    
    all_containers = []
    current_page = start_page
    
    while len(all_containers) < containers_per_batch:
        print(f"当前页数: {current_page}")
        for attempt in range(max_retries):
            try:
                payload = {"current": current_page, "size": 1}
                headers = {"Content-Type": "application/json"}
                response = requests.post(CONTAINER_LIST_URL, json=payload, headers=headers, timeout=30)
                data = response.json()
                if data['code'] != 0:
                    raise ValueError(f"获取容器列表失败: {data['msg']}")
                
                containers = data['data']['list']
                if not containers:
                    print(f"页面 {current_page} 没有可用容器")
                    return all_containers, current_page - 1
                
                if current_page in processed_pages:
                    print(f"页面 {current_page} 已处理，跳过")
                    current_page += 1
                    continue
                
                all_containers.append((containers[0], current_page))
                print(f"从页面 {current_page} 添加容器: {containers[0]['containerCode']}")
                current_page += 1
                break
            except Exception as e:
                print(f"列出第 {current_page} 页容器时出错 (尝试 {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    return all_containers, current_page - 1
                time.sleep(10)
    
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
            driver.set_window_rect(x, y, 650, 710)
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
    x = col * (640 + 1)
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

def open_target_url(driver, container_code, target_url):
    """打开目标 URL"""
    try:
        driver.get(target_url)
        time.sleep(5)
        print(f"容器 {container_code} 成功导航到 {target_url}")
    except Exception as e:
        print(f"容器 {container_code} 导航到 {target_url} 失败: {e}")

def is_driver_valid(driver, container_code):
    """检查驱动是否有效"""
    if driver is None or not hasattr(driver, 'service') or not driver.service.is_connectable():
        print(f"容器 {container_code} 的驱动程序不再有效")
        return False
    return True

def process_all_containers(drivers, target_url, containers_info, start_page_ref, processed_pages,pr):
    print("启动所有容器...")
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        futures = [executor.submit(open_target_url, driver, container_code, target_url) 
                   for driver, container_code in drivers]
        print(f"已提交 {len(futures)} 个容器加载任务")
    
    time.sleep(5)
    
    thread_pool = {}
    active_drivers = dict(drivers)
    print(f"初始活动容器数量: {len(active_drivers)}")
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        # 为每个容器分配正确的页数
        for i, (driver, container_code) in enumerate(drivers):
            current_page = start_page_ref[0] + i
            thread_pool[container_code] = executor.submit(handle_backpack, driver, container_code, 
                                                     target_url, current_page,pr)
            print(f"线程启动: 容器 {container_code}，使用页数 {current_page}")
        
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
                    
                    # 启动新容器
                    while True:
                        start_page_ref[0] += 1
                        if start_page_ref[0] in processed_pages:
                            print(f"页面 {start_page_ref[0]} 已处理，跳过")
                            continue
                        
                        new_containers, last_page = list_available_containers(start_page_ref[0], 1, processed_pages)
                        if not new_containers:
                            print("没有更多可用容器")
                            break
                        
                        new_container, page_number = new_containers[0]
                        new_container_code = new_container['containerCode']
                        new_driver = start_browser(new_container_code, position, page_number, 5, processed_pages)
                        if new_driver:
                            executor.submit(open_target_url, new_driver, new_container_code, target_url)
                            active_drivers[new_container_code] = new_driver
                            containers_info.append({'container_code': new_container_code, 'position': position})
                            processed_pages.add(page_number)
                            thread_pool[new_container_code] = executor.submit(
                                handle_backpack, new_driver, new_container_code,
                                 target_url, start_page_ref[0], pr)
                            print(f"已为 {new_container_code} 创建新线程在位置 {position}，使用页数 {start_page_ref[0]}")
                            break
                        else:
                            print(f"无法启动新容器 {new_container_code}")
                    
                    if container_code in active_drivers:
                        del active_drivers[container_code]
            
            for container_code in completed:
                if container_code in thread_pool:
                    del thread_pool[container_code]
                    print(f"线程清理: 容器 {container_code}, 剩余活动容器: {len(active_drivers)}")
            
            time.sleep(1)
    
    print("所有容器处理完成")

def handle_backpack(driver, container_code, target_url, current_page,pr):
    """处理Twitter登录流程"""
    main_handle = driver.current_window_handle
    local_success_flag = threading.local()
    local_success_flag.value = False
    
    try:
        with open(pr, 'r') as f:
            lines = f.readlines()
    except Exception as e:
        print(f"读取文件失败: {str(e)}")
        return False

    try:
        container_index = current_page - 1
        if container_index < 0 or container_index >= len(lines):
            return False
        # 分割行数据，保留最后的2FA URL
        line_parts = lines[container_index].strip().split(':')
        username = line_parts[0]  # 用户名
        password = line_parts[1]  # 密码
        twofa_url = line_parts[-1]  # 2FA URL
        print(f"使用当前页数 {current_page}，账号: {username}")
    except Exception as e:
        print(f"获取账号信息失败: {str(e)}")
        return False

    try:
        # 点击登录按钮
        login_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//*[@id="react-root"]/div/div/div[2]/main/div/div/div[1]/div[1]/div/div[3]/div[4]/a/div'))
        )
        login_button.click()
        time.sleep(2)

        # 输入用户名
        username_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//input[@autocomplete="username"]'))
        )
        username_input.send_keys(username)
        time.sleep(1)

        # 点击下一步
        next_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//button[@role="button"]//span[contains(text(), "次へ") or contains(text(), "Next")]'))
        )
        next_button.click()
        time.sleep(2)

        # 输入密码
        password_input = WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.XPATH, '//input[@type="password" and @autocomplete="current-password"]'))
        )
        password_input.send_keys(password)
        time.sleep(1)

        # 点击登录
        login_submit = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="LoginForm_Login_Button"]'))
        )
        login_submit.click()
        time.sleep(3)

        # 获取2FA验证码
        try:
            # 保存当前窗口句柄
            main_window = driver.current_window_handle
            
            # 清理URL
            clean_url = twofa_url.strip().strip("'").strip('"')
            if not clean_url.startswith('http'):
                clean_url = f'https://{clean_url.lstrip("/")}'
            
            print(f"正在打开2FA页面，URL: {clean_url}")
            # 新开一个标签页打开2FA链接
            driver.execute_script(f"window.open('{clean_url}', '_blank');")
            time.sleep(3)
            
            # 切换到新标签页
            for handle in driver.window_handles:
                if handle != main_window:
                    driver.switch_to.window(handle)
                    break
            
            # 等待验证码显示出来
            time.sleep(5)
            # 获取验证码元素
            try:
                twofa_code = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.ID, "verifyCode"))
                ).text.strip()
                print(f"成功获取2FA验证码: {twofa_code}")
            except Exception as e:
                print(f"获取验证码元素失败: {str(e)}")
                return False
            
            # 关闭2FA标签页并切回主窗口
            driver.close()
            driver.switch_to.window(main_window)
            
            if twofa_code:
                # 输入2FA验证码
                twofa_input = WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.XPATH, '//input[@data-testid="ocfEnterTextTextInput"]'))
                )
                twofa_input.send_keys(twofa_code)
                time.sleep(1)
                
                # 点击验证按钮
                verify_button = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="ocfEnterTextNextButton"]'))
                )
                verify_button.click()
                time.sleep(10)
            else:
                print("无法获取2FA验证码")
                return False
                
        except Exception as e:
            print(f"2FA验证失败: {str(e)}")
            try:
                # 确保返回主窗口
                driver.switch_to.window(main_window)
            except:
                pass
            return False

        print(f"账号 {username} 登录成功")
        return True

    except Exception as e:
        print(f"登录过程出错: {str(e)}")
        return False



def main(containers_per_batch, start_page, target_url, page_number,pr):
    """主函数"""
    if not check_service_availability():
        print("Hubstudio 服务不可用，请确保 hubstudio_connector.exe 正在运行")
        sys.exit(1)
    
    columns = 4
    start_page_ref = [start_page]
    processed_pages = set()
    
    while True:
        containers, last_page = list_available_containers(start_page_ref[0], containers_per_batch, processed_pages)
        
        if not containers:
            print("未找到更多容器")
            print("✅ 程序运行完成：所有容器处理完毕")
            break
        
        print(f"\n处理 {len(containers)} 个容器的批次")
        
        drivers = []
        containers_info = []
        for index, (container, page_number) in enumerate(containers):
            window_position = calculate_window_position(index, len(containers), columns, containers_per_batch)
            driver = start_browser(container['containerCode'], window_position, page_number, 5, processed_pages)
            if driver:
                drivers.append((driver, container['containerCode']))
                containers_info.append({'container_code': container['containerCode'], 'position': window_position})
                processed_pages.add(page_number)
            else:
                print(f"跳过启动失败的容器 {container['containerCode']}")
            time.sleep(5)
        
        if drivers:
            process_all_containers(drivers, target_url, containers_info, start_page_ref, processed_pages,pr)
        
        start_page_ref[0] = last_page + 1
    
    print("✅ 程序运行完成：所有容器处理完毕")

if __name__ == "__main__":
    input_page = input("请输入起始页数：")
    input_munber = input("请输入浏览器数量：")
    pr = input("密钥路径：")
    parser = argparse.ArgumentParser(description="运行 Hubstudio 浏览器自动化")
    parser.add_argument("--start-page", type=int, default=input_page)
    parser.add_argument("--containers-per-batch", type=int, default=input_munber)
    parser.add_argument("--target-url", type=str, default="https://x.com/")
    args = parser.parse_args()

    page_number = 0
    main(args.containers_per_batch, args.start_page, args.target_url, page_number,pr)