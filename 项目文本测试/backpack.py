import time
import sys
import requests
import socket
import signal
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

id = "ciknjihhgianjpmobkbileeclidooofo"
PORT = 6873
BASE_API_URL = f"http://127.0.0.1:{PORT}/api/v1"
CONTAINER_LIST_URL = f"{BASE_API_URL}/env/list"
BROWSER_START_URL = f"{BASE_API_URL}/browser/start"
BROWSER_STOP_URL = f"{BASE_API_URL}/browser/stop"
DISPLAY_ALL_URL = f"{BASE_API_URL}/display/all"
BROWSER_ARRANGE_URL = f"{BASE_API_URL}/browser/arrange"
BATCH_DELAY = 5
BATCH_SIZE = 20
MAX_WORKERS = 10
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
    seen_containers = set()
    
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
                    break
                    #return all_containers, current_page - 1
                    
                
                container_code = containers[0]['containerCode']
                container_name = containers[0].get('containerName', str(current_page))
                if container_code in seen_containers:
                    print(f"容器 {container_code} 已存在，跳过")
                    current_page += 1
                    continue
                
                if current_page in processed_pages:
                    print(f"页面 {current_page} 已处理，跳过")
                    current_page += 1
                    continue
                
                seen_containers.add(container_code)
                containers[0]['page_number'] = current_page
                containers[0]['container_name'] = container_name
                all_containers.append((containers[0], current_page))
                print(f"从页面 {current_page} 添加容器: {container_code}, 名称: {container_name}")
                current_page += 1
                break
            except Exception as e:
                print(f"列出第 {current_page} 页容器时出错 (尝试 {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    return all_containers, current_page - 1
                time.sleep(10)
    
    all_containers.sort(key=lambda x: int(x[0]['containerCode']))
    print(f"收集了 {len(all_containers)} 个容器，按ID排序")
    print("排序后的容器列表:")
    for i, (container, page) in enumerate(all_containers):
        print(f"索引 {i}: 容器ID {container['containerCode']} (页码 {container['page_number']}, 名称 {container['container_name']})")
    
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
                print(f"API 返回错误: {data}")
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
    x = col * (610 + 1)
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
    used_containers = set(container_code for _, container_code, _ in drivers)
    
    for driver, container_code, container_name in drivers:
        active_drivers[container_code] = driver
    
    print(f"初始活动容器数量: {len(active_drivers)}")
    
    def handle_shutdown(signum, frame):
        print("收到终止信号，清理所有容器...")
        for container_code, driver in active_drivers.items():
            try:
                driver.quit()
            except:
                pass
            stop_browser(container_code)
        sys.exit(1)
    
    signal.signal(signal.SIGINT, handle_shutdown)
    signal.signal(signal.SIGTERM, handle_shutdown)
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        for driver, container_code, container_name in drivers:
            container_info = next((c for c in containers_info if c['container_code'] == container_code), None)
            if container_info:
                thread_pool[container_code] = executor.submit(
                    handle_backpack, driver, container_code, target_url, container_name, pr
                )
                print(f"线程启动: 容器 {container_code}, 容器名称 {container_name}, 使用密钥第 {container_name} 行")
            else:
                print(f"警告: 未找到容器 {container_code} 的信息")
                continue
        
        while active_drivers:
            completed = []
            for container_code, future in list(thread_pool.items()):
                if future.done():
                    completed.append(container_code)
                    print(f"线程完成: 容器 {container_code}")
                    
                    try:
                        success = future.result()
                    except Exception as e:
                        print(f"容器 {container_code} 线程执行异常: {e}")
                        success = False
                    
                    driver = active_drivers.get(container_code)
                    if not success:
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
                    
                    if not success:
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
                            new_container_name = new_container['container_name']
                            
                            if new_container_code in used_containers:
                                print(f"容器 {new_container_code} 已经使用过，跳过")
                                continue
                            
                            print(f"尝试启动新容器: {new_container_code}, 名称: {new_container_name}")
                            
                            new_driver = start_browser(new_container_code, position, page_number, 5, processed_pages)
                            if new_driver:
                                print(f"容器 {new_container_code} 启动成功")
                                active_drivers[new_container_code] = new_driver
                                used_containers.add(new_container_code)
                                containers_info.append({
                                    'container_code': new_container_code, 
                                    'position': position,
                                    'page_number': page_number,
                                    'container_name': new_container_name
                                })
                                processed_pages.add(page_number)
                                thread_pool[new_container_code] = executor.submit(
                                    handle_backpack, new_driver, new_container_code,
                                    target_url, new_container_name, pr
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

from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def wait_for_span_loading_text_to_disappear(driver, timeout=60, poll_frequency=0.5, debug=True):
    """
    检查页面所有<span>元素是否包含特定加载文本，若任一<span>的文本或属性完全等于任一文本则等待消失，
    直到所有<span>都不包含这些文本才继续。
    
    Args:
        driver: Selenium WebDriver 实例
        timeout: 最大等待时间（秒），默认 60
        poll_frequency: 检查间隔（秒），默认 0.5
        debug: 是否打印调试日志，默认 True
    """
    loading_texts = ["正在加载地址...", "正在查找已有资产的账户..."]
    
    # 构造合并的 XPath，使用 = 精确匹配
    xpath_conditions = " or ".join(
        f"normalize-space(.) = '{text}' or normalize-space(@*) = '{text}'"
        for text in loading_texts
    )
    xpath = f"//span[{xpath_conditions}]"
    
    start_time = time.time()
    while True:
        try:
            elements = driver.find_elements(By.XPATH, "//*[@id='onboarding']/div/div/span[1]/div[1]/div[2]/div/div/div[2]/div[1]/div/div[2]/div[2]/div/div/div/div[2]/div/div[1]/div/div/div/div[1]/div[6]/div[2]/div[2]/div/div/div/div[2]/div/div[1]/div/div/div[1]/div/div[3]/div/div[1]/div/div/div")
            if elements:
                print("找到元素")
                break
            else:
                print("未找到元素")
            # 验证驱动状态
            driver.execute_script("return document.readyState;")  # 检查页面加载状态
            # 检查是否存在完全等于任一加载文本的<span>元素
            elements = driver.find_elements(By.XPATH, xpath)
            if debug and elements:
                print(f"检测到 {len(elements)} 个完全匹配加载文本的 <span>: {[e.text for e in elements]}")
            if not elements:
                # 多次验证，防止短暂消失后重新出现
                for _ in range(3):  # 检查 3 次，每次间隔 1 秒
                    time.sleep(1)
                    elements = driver.find_elements(By.XPATH, xpath)
                    if elements:
                        if debug:
                            print(f"第 {_ + 1} 次检查发现新加载文本: {[e.text for e in elements]}")
                        break
                else:  # 连续 3 次未发现文本
                    if debug:
                        print("所有 <span> 中无完全匹配的加载文本，确认退出等待")
                    break
            # 存在加载文本，等待其消失
            WebDriverWait(driver, timeout, poll_frequency).until_not(
                EC.presence_of_element_located((By.XPATH, xpath)),
                message=f"仍在等待以下文本完全消失: {', '.join(loading_texts)}"
            )
        except Exception as e:
            pass


def handle_backpack(driver, container_code, target_url, container_name, pr):
    """处理单个容器的 Backpack 钱包导入操作，失败时直接跳到下一步"""
    main_handle = driver.current_window_handle
    local_success_flag = threading.local()
    local_success_flag.value = False
    
    try:
        with open(pr, 'r') as f:
            secret_phrases = f.readlines()
    except Exception as e:
        print(f"❌ 容器 {container_code} 处理失败：无法读取密钥文件: {e}")
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

    # 确保窗口正确
    if len(driver.window_handles) > 1:
        for handle in driver.window_handles:
            if handle != main_handle:
                driver.switch_to.window(handle)
                driver.close()
        driver.switch_to.window(main_handle)

    max_retries = 5
    retry_count = 0
    page_loaded = False

    while True:
        try:
            if not page_loaded:
                driver.get(target_url)
                WebDriverWait(driver, 10).until(
                    EC.presence_of_element_located((By.TAG_NAME, "body"))
                )
                page_loaded = True

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 点击同意条款
            terms_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//button[contains(., 'I agree to the Terms of Service') or contains(., '我同意')]"))
            )
            if terms_button:
                driver.execute_script("arguments[0].click();", terms_button)
                print("点击同意条款成功")
            else:
                print("未找到同意条款按钮")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 点击已有钱包
            existing_wallet = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'I already have a wallet') or contains(text(), '我已经有钱包')]"))
            )
            if existing_wallet:
                driver.execute_script("arguments[0].click();", existing_wallet)
                print("点击已有钱包成功")
            else:
                print("未找到已有钱包按钮")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 点击 Set up wallet
            setup_wallet_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//div[contains(@class, 'css-175oi2r') and contains(@class, 'r-1loqt21') and contains(@class, 'r-1otgn73')]//span[contains(@class, 'font_body') and contains(text(), 'Solana')]"))
            )
            if setup_wallet_btn:
                driver.execute_script("arguments[0].click();", setup_wallet_btn)
                print("点击 Set up wallet 按钮成功")
            else:
                print("未找到 Set up wallet 按钮")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 选择恢复短语
            recovery_phrase = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Recovery phrase') or contains(text(), '助记词')]"))
            )
            if recovery_phrase:
                driver.execute_script("arguments[0].click();", recovery_phrase)
                print("选择恢复短语成功")
            else:
                print("未找到恢复短语")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 输入助记词
            words = secret_phrase.split()
            input_fields = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "input[class*='css-11aywtz'][class*='r-6taxm2']"))
            )
            if len(input_fields) == 12:
                for word, input_field in zip(words, input_fields):
                    input_field.clear()
                    input_field.send_keys(word)
                    time.sleep(0.2)
            print("输入助记词成功")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 点击导入
            import_selectors = [
                "//div[contains(@class, 'css-175oi2r') and contains(@class, 'r-1loqt21')]//span[contains(text(), 'Import') or contains(text(), '导入')]",
            ]
            for selector in import_selectors:
                import_btn = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                if import_btn:
                    driver.execute_script("arguments[0].click();", import_btn)
                    print("点击导入成功")
                    break
                else:
                    print("未找到导入按钮")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            advanced_selectors = [
                "//div[contains(@class, 'css-175oi2r') and contains(@class, 'r-1loqt21')]//span[contains(@class, 'font_body') and (contains(text(), 'Advanced') or contains(text(), '高级'))]",
            ]
            for selector in advanced_selectors:
                advanced_btn = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                if advanced_btn:
                    time.sleep(10)
                    driver.execute_script("arguments[0].click();", advanced_btn)
                    print(f"点击高级选项成功 (使用选择器: {selector})")
                    break
                else:
                    print("未找到高级选项按钮")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 选择账户
            account_selectors = [
                "//div[contains(@class, '_dsp-flex')]//span[contains(text(), '○')]",
                "//div[contains(@class, '_dsp-flex')]//input[@type='radio']",
            ]
            for selector in account_selectors:
                first_account = WebDriverWait(driver, 30).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                if first_account:
                    time.sleep(10)
                    driver.execute_script("arguments[0].click();", first_account)
                    print("选择账户成功")
                    break
                else:
                    print("未找到账户")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 再次点击导入
            import_selectors_2 = [
                "//div[contains(@class, 'css-175oi2r') and contains(@class, 'r-1loqt21')]//span[contains(text(), 'Import') or contains(text(), '导入')]",
            ]
            for selector in import_selectors_2:
                import_btn = WebDriverWait(driver, 10).until(
                    EC.element_to_be_clickable((By.XPATH, selector))
                )
                if import_btn:
                    driver.execute_script("arguments[0].click();", import_btn)
                    print("再次点击导入成功")
                    break
                else:
                    print("未找到再次点击导入按钮")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 输入密码
            password_inputs = WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CSS_SELECTOR, "input[type='password']"))
            )
            for input_field in password_inputs:
                input_field.clear()
                input_field.send_keys("Web361535566!")
            print("输入密码成功")

            wait_for_span_loading_text_to_disappear(driver, timeout=20, debug=True)

            # 点击下一步
            next_btn = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, "//*[contains(text(), 'Next') or contains(text(), '下一步')]"))
            )
            if next_btn:
                driver.execute_script("arguments[0].click();", next_btn)
                print("点击下一步成功")
            else:
                print("未找到下一步按钮")

            local_success_flag.value = True
            break

        except Exception as e:
            print(f"容器 {container_code} 处理过程中出错: {str(e)}")
            retry_count += 1
            time.sleep(2)

    if local_success_flag.value:
        print(f"✅ 容器 {container_code} 钱包导入成功")
        return True
    else:
        print(f"❌ 容器 {container_code} 处理失败：达到最大重试次数")
        return False
    
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
            container_name = container['container_name']
            
            if container_code in processed_container_ids:
                print(f"容器 {container_code} 已处理过，跳过")
                continue
                
            window_position = calculate_window_position(index, len(containers), columns, containers_per_batch)
            driver = start_browser(container_code, window_position, page_number, 5, processed_pages)
            if driver:
                drivers.append((driver, container_code, container_name))
                containers_info.append({
                    'container_code': container_code, 
                    'position': window_position,
                    'page_number': page_number,
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
    parser.add_argument("--target-url", type=str, default=f"chrome-extension://{id}/onboarding.html")
    parser.add_argument("--list-containers", action="store_true", help="列出所有容器ID")
    parser.add_argument("--pr", type=str, default=input("请输入密钥路径："), help="密钥文件路径")
    args = parser.parse_args()

    page_number = 0
    main(args.containers_per_batch, args.start_page, args.target_url, page_number, args.pr)