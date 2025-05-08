import time
import sys
import requests
import socket
import logging
import json
import threading
from concurrent.futures import ThreadPoolExecutor
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import argparse
from selenium.common.exceptions import TimeoutException, WebDriverException

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler(sys.stdout),
        logging.FileHandler('x_test.log')
    ]
)
logger = logging.getLogger(__name__)

# Constants
ID = "hbihhgigapnomnacpkdmmhmgiecojifh"
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
MAX_RETRIES = 5

def check_service_availability(host="127.0.0.1", port=PORT, timeout=5):
    """Check if Hubstudio service is available."""
    try:
        sock = socket.create_connection((host, port), timeout)
        sock.close()
        logger.info(f"Hubstudio service reachable at {host}:{port}")
        return True
    except Exception as e:
        logger.error(f"Failed to connect to Hubstudio service at {host}:{port}: {e}")
        return False

def list_available_containers(start_page=1, containers_per_batch=10, processed_pages=None, max_retries=MAX_RETRIES, processed_container_ids=None):
    """List available containers from Hubstudio API."""
    if processed_pages is None:
        processed_pages = set()
    if processed_container_ids is None:
        processed_container_ids = set()
    
    all_containers = []
    current_page = start_page
    container_ids = set()
    max_pages_to_check = 50
    actual_pages = []
    
    logger.info(f"Starting container collection from page {start_page}, max {containers_per_batch} containers")
    
    pages_checked = 0
    while len(all_containers) < containers_per_batch and pages_checked < max_pages_to_check:
        logger.info(f"Checking page: {current_page}")
        for attempt in range(max_retries):
            try:
                payload = {"current": current_page, "size": 1}
                headers = {"Content-Type": "application/json"}
                response = requests.post(CONTAINER_LIST_URL, json=payload, headers=headers, timeout=30)
                response.raise_for_status()
                data = response.json()
                logger.debug(f"API response: {data}")
                if data['code'] != 0:
                    raise ValueError(f"Failed to fetch container list: {data['msg']}")
                
                containers = data['data']['list']
                if not containers:
                    logger.info(f"No containers available on page {current_page}")
                    break
                
                container_code = containers[0]['containerCode']
                container_name = containers[0]['containerName']
                logger.info(f"Page {current_page}: Found container ID {container_code}, name {container_name}")
                
                if current_page in processed_pages:
                    logger.info(f"Page {current_page} already processed, skipping")
                    current_page += 1
                    pages_checked += 1
                    continue
                
                if container_code in container_ids or container_code in processed_container_ids:
                    logger.info(f"Container {container_code} already processed, skipping")
                    current_page += 1
                    pages_checked += 1
                    continue
                
                container_ids.add(container_code)
                containers[0]['page_number'] = current_page
                containers[0]['container_name'] = container_name
                all_containers.append((containers[0], current_page))
                actual_pages.append(current_page)
                logger.info(f"Added container: {container_code} (page {current_page}, name {container_name})")
                current_page += 1
                pages_checked += 1
                break
            except (requests.exceptions.RequestException, ValueError) as e:
                logger.error(f"Error listing containers on page {current_page} (attempt {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    current_page += 1
                    pages_checked += 1
                time.sleep(5)
    
    logger.info(f"Collected {len(all_containers)} containers, sorting by ID")
    all_containers.sort(key=lambda x: int(x[0]['containerCode']))
    
    logger.info("Sorted container list:")
    for i, (container, page) in enumerate(all_containers):
        logger.info(f"Index {i}: Container ID {container['containerCode']} (page {container['page_number']}, name {container['container_name']})")
    
    logger.info(f"Actual pages fetched: {actual_pages}")
    return all_containers, current_page - 1

def start_browser(container_code, window_position, page_number, max_retries=MAX_RETRIES, processed_pages=None):
    """Start a browser instance for a given container."""
    if processed_pages is None:
        processed_pages = set()
    
    if page_number in processed_pages:
        logger.info(f"Page {page_number} already processed, skipping")
        return None
    
    if not check_service_availability():
        logger.error(f"Hubstudio service unavailable for container {container_code}")
        return None
    
    # Check if container is already running
    try:
        response = requests.get(f"{BASE_API_URL}/browser/status?containerCode={container_code}", timeout=10)
        data = response.json()
        if data['code'] == 0 and data['data']['status'] == 'running':
            logger.info(f"Container {container_code} is already running, skipping")
            return None
    except requests.exceptions.RequestException as e:
        logger.error(f"Error checking container {container_code} status: {e}")
    
    for attempt in range(max_retries):
        try:
            logger.info(f"Attempting to start container {container_code} (attempt {attempt + 1}/{max_retries})")
            open_data = {"containerCode": str(container_code)}
            logger.debug(f"Sending request to {BROWSER_START_URL} with data: {open_data}")
            response = requests.post(BROWSER_START_URL, json=open_data, timeout=20)
            response.raise_for_status()
            data = response.json()
            if data['code'] != 0:
                raise ValueError(f"Failed to start container: {data['msg']}")
            
            webdriver_path = data['data']['webdriver']
            debugging_port = data['data']['debuggingPort']
            options = Options()
            options.add_experimental_option("debuggerAddress", f"127.0.0.1:{debugging_port}")
            options.add_argument("--no-sandbox")
            options.add_argument("--disable-dev-shm-usage")
            driver = webdriver.Chrome(service=Service(webdriver_path), options=options)
            
            x, y = window_position
            driver.set_window_rect(x, y, 650, 740)
            logger.info(f"Container {container_code} set to position: ({x}, {y})")
            return driver
        except (requests.exceptions.RequestException, ValueError, WebDriverException) as e:
            logger.error(f"Error starting container {container_code} (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                logger.error(f"Max retries reached for container {container_code}")
                return None
            time.sleep(2 ** attempt)
        time.sleep(1)
    return None

def calculate_window_position(index, total, columns, containers_per_batch):
    """Calculate window position for a container."""
    col = index % columns
    row = index // columns
    x = col * 640
    y = row * (710 + 2)
    logger.info(f"Calculated position for index {index}: col={col}, row={row}, x={x}, y={y}")
    return x, y

def stop_browser(container_code, max_retries=3):
    """Stop a browser instance for a container."""
    payload = {"containerCode": str(container_code)}
    headers = {"Content-Type": "application/json"}
    for attempt in range(max_retries):
        try:
            response = requests.post(BROWSER_STOP_URL, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            data = response.json()
            if data['code'] == 0 and data['data'].get('statusCode') == "0":
                logger.info(f"Container {container_code} browser stopped successfully")
                return True
            else:
                logger.error(f"Failed to stop container {container_code}: {data.get('msg', 'Unknown error')}")
                return False
        except requests.exceptions.RequestException as e:
            logger.error(f"Error stopping container {container_code} (attempt {attempt + 1}/{max_retries}): {e}")
            if attempt == max_retries - 1:
                return False
            time.sleep(5)
    return False

def is_driver_valid(driver, container_code):
    """Check if a Selenium driver is valid."""
    if driver is None or not hasattr(driver, 'service') or not driver.service.is_connectable():
        logger.error(f"Container {container_code} driver is no longer valid")
        return False
    return True

def process_all_containers(drivers, target_url, containers_info, start_page_ref, processed_pages, pr, processed_container_ids):
    """Process all containers concurrently."""
    logger.info("Starting all containers...")
    time.sleep(BATCH_DELAY)
    
    thread_pool = {}
    active_drivers = {container_code: driver for driver, container_code, _ in drivers}
    
    logger.info(f"Initial active containers: {len(active_drivers)}")
    
    with ThreadPoolExecutor(max_workers=MAX_WORKERS) as executor:
        for driver, container_code, page_number in drivers:
            container_info = next((c for c in containers_info if c['container_code'] == container_code), None)
            if container_info:
                container_name = container_info.get('container_name')
                thread_pool[container_code] = executor.submit(
                    handle_backpack, driver, container_code, target_url, page_number, pr, container_name
                )
                logger.info(f"Thread started: Container {container_code}, page {page_number}, name {container_name}, using secret line {container_name}")
            else:
                logger.warning(f"No info found for container {container_code}")
                continue
        
        while active_drivers:
            completed = []
            for container_code, future in list(thread_pool.items()):
                if future.done():
                    completed.append(container_code)
                    logger.info(f"Thread completed: Container {container_code}")
                    
                    driver = active_drivers.get(container_code)
                    if driver:
                        try:
                            driver.quit()
                            logger.info(f"Container {container_code} Selenium session closed")
                        except Exception as e:
                            logger.error(f"Error closing Selenium session for container {container_code}: {e}")
                    
                    if stop_browser(container_code):
                        logger.info(f"Container {container_code} Hubstudio API stopped successfully")
                    else:
                        logger.error(f"Container {container_code} Hubstudio API stop failed")
                    
                    time.sleep(2)
                    
                    try:
                        container_info = next(c for c in containers_info if c['container_code'] == container_code)
                        position = container_info['position']
                    except StopIteration:
                        logger.warning(f"No position info for container {container_code}, using default (0, 0)")
                        position = (0, 0)
                    
                    logger.info(f"Container {container_code} original position: {position}")
                    
                    while True:
                        start_page_ref[0] += 1
                        if start_page_ref[0] in processed_pages:
                            logger.info(f"Page {start_page_ref[0]} already processed, skipping")
                            continue
                        
                        logger.info(f"Attempting to fetch new container, current page: {start_page_ref[0]}")
                        new_containers, last_page = list_available_containers(start_page_ref[0], 1, processed_pages, processed_container_ids=processed_container_ids)
                        if not new_containers:
                            logger.info("No more containers available")
                            break
                        
                        new_container, page_number = new_containers[0]
                        new_container_code = new_container['containerCode']
                        new_page = new_container['page_number']
                        new_container_name = new_container['container_name']
                        
                        logger.info(f"Attempting to start new container: {new_container_code}, page {new_page}, name {new_container_name}")
                        
                        new_driver = start_browser(new_container_code, position, page_number, MAX_RETRIES, processed_pages)
                        if new_driver:
                            logger.info(f"Container {new_container_code} started successfully")
                            active_drivers[new_container_code] = new_driver
                            containers_info.append({
                                'container_code': new_container_code, 
                                'position': position,
                                'page_number': new_page,
                                'container_name': new_container_name
                            })
                            processed_pages.add(page_number)
                            processed_container_ids.add(new_container_code)
                            thread_pool[new_container_code] = executor.submit(
                                handle_backpack, new_driver, new_container_code,
                                target_url, new_page, pr, new_container_name
                            )
                            logger.info(f"New thread created for {new_container_code} at position {position}, using secret line {new_container_name}")
                            break
                        else:
                            logger.error(f"Failed to start new container {new_container_code}")
                            continue
                    
                    if container_code in active_drivers:
                        del active_drivers[container_code]
            
            for container_code in completed:
                if container_code in thread_pool:
                    del thread_pool[container_code]
                    logger.info(f"Thread cleaned up: Container {container_code}, remaining active: {len(active_drivers)}")
            
            if not active_drivers and not thread_pool:
                logger.info("All containers processed, exiting loop")
                break
                
            time.sleep(1)
    
    logger.info("All containers processing completed")

def handle_backpack(driver, container_code, target_url, current_page, pr, container_name):
    """Handle login and 2FA process for a container."""
    main_handle = driver.current_window_handle
    local_success_flag = threading.local()
    local_success_flag.value = False
    
    try:
        with open(pr, 'r') as f:
            secret_phrases = f.readlines()
    except Exception as e:
        logger.error(f"Container {container_code} failed: Unable to read secret file: {e}")
        return False
    
    try:
        if not container_name or int(container_name) <= 0:
            logger.error(f"Container {container_code} failed: Invalid container name {container_name}")
            return False
        
        line_number = int(container_name)
        phrase_index = line_number - 1
        if phrase_index < 0 or phrase_index >= len(secret_phrases):
            logger.error(f"Container {container_code} failed: Line {line_number} (index {phrase_index}) out of secret file range")
            return False
        
        secret_phrase = secret_phrases[phrase_index].strip()
        line_parts = secret_phrase.split(':')
        if len(line_parts) < 3:
            logger.error(f"Container {container_code} failed: Invalid secret line format: {secret_phrase}")
            return False
        username = line_parts[0]
        password = line_parts[1]
        twofa_url = line_parts[-1]
        logger.info(f"Using container name {container_name}, corresponding to secret file line {line_number}, username: {username}")
        
        with open('codeid_secret.txt', 'a') as f:
            f.write(f"{container_code}:{secret_phrase}\n")
    except ValueError as e:
        logger.error(f"Container {container_code} failed: Invalid container name '{container_name}': {e}")
        return False
    except Exception as e:
        logger.error(f"Container {container_code} failed to fetch credentials: {e}")
        return False
    
    for handle in driver.window_handles:
        if handle != main_handle:
            driver.switch_to.window(handle)
            driver.close()
    driver.switch_to.window(main_handle)
    
    retry_count = 0
    while retry_count < MAX_RETRIES:
        try:
            logger.info(f"Container {container_code}: Navigating to {target_url}")
            driver.get(target_url)
            time.sleep(5)
        
            if 'home' in driver.current_url:
                logger.info(f"Container {container_code}: Already logged in")
                local_success_flag.value = True
                return True
            
            logger.info(f"Container {container_code}: Clicking login button")
            login_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//*[@id="react-root"]/div/div/div[2]/main/div/div/div[1]/div[1]/div/div[3]/div[4]/a/div'))
            )
            login_button.click()
            time.sleep(2)
            
            logger.info(f"Container {container_code}: Entering username")
            username_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//input[@autocomplete="username"]'))
            )
            username_input.send_keys(username)
            time.sleep(1)
            
            logger.info(f"Container {container_code}: Clicking next button")
            next_button = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//button[@role="button"]//span[contains(text(), "次へ") or contains(text(), "Next") or contains(text(), "下一步")]'))
            )
            next_button.click()
            time.sleep(2)
            
            logger.info(f"Container {container_code}: Entering password")
            password_input = WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.XPATH, '//input[@type="password" and @autocomplete="current-password"]'))
            )
            password_input.send_keys(password)
            time.sleep(1)
            
            logger.info(f"Container {container_code}: Clicking login button")
            login_submit = WebDriverWait(driver, 10).until(
                EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="LoginForm_Login_Button"]'))
            )
            login_submit.click()
            time.sleep(3)
            
            logger.info(f"Container {container_code}: Starting 2FA process")
            try:
                main_window = driver.current_window_handle
                clean_url = twofa_url.strip().strip("'").strip('"')
                if not clean_url.startswith('http'):
                    clean_url = f'https://{clean_url.lstrip("/")}'
                
                logger.info(f"Container {container_code}: Opening 2FA page: {clean_url}")
                driver.execute_script(f"window.open('{clean_url}', '_blank');")
                time.sleep(3)
                
                for handle in driver.window_handles:
                    if handle != main_window:
                        driver.switch_to.window(handle)
                        break
                
                time.sleep(5)
                try:
                    twofa_code = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.ID, "verifyCode"))
                    ).text.strip()
                    logger.info(f"Container {container_code}: Successfully retrieved 2FA code: {twofa_code}")
                except Exception as e:
                    logger.error(f"Container {container_code}: Failed to retrieve 2FA code: {e}")
                    return False
                
                driver.close()
                driver.switch_to.window(main_window)
                
                if twofa_code:
                    logger.info(f"Container {container_code}: Entering 2FA code")
                    twofa_input = WebDriverWait(driver, 10).until(
                        EC.presence_of_element_located((By.XPATH, '//input[@data-testid="ocfEnterTextTextInput"]'))
                    )
                    twofa_input.send_keys(twofa_code)
                    time.sleep(1)
                    
                    logger.info(f"Container {container_code}: Clicking verify button")
                    verify_button = WebDriverWait(driver, 10).until(
                        EC.element_to_be_clickable((By.XPATH, '//button[@data-testid="ocfEnterTextNextButton"]'))
                    )
                    verify_button.click()
                    time.sleep(10)
                else:
                    logger.error(f"Container {container_code}: No 2FA code retrieved")
                    return False
            except Exception as e:
                logger.error(f"Container {container_code}: 2FA process failed: {e}")
                try:
                    driver.switch_to.window(main_window)
                except:
                    pass
                return False
            
            logger.info(f"Container {container_code}: Login successful for username {username}")
            local_success_flag.value = True
            return True
        
        except (TimeoutException, WebDriverException) as e:
            logger.error(f"Container {container_code} error during processing: {e}")
            retry_count += 1
            if retry_count < MAX_RETRIES:
                logger.info(f"Container {container_code}: Retrying {retry_count}/{MAX_RETRIES}")
                time.sleep(5)
            else:
                logger.error(f"Container {container_code}: Max retries reached")
                return False
        
        if not is_driver_valid(driver, container_code):
            logger.error(f"Container {container_code}: Driver invalid")
            return False
    
    logger.info(f"Container {container_code}: Processing completed")
    return local_success_flag.value

def get_all_container_codes(max_pages=50):
    """Fetch and sort all container codes."""
    all_container_codes = []
    current_page = 1
    processed_codes = set()
    
    logger.info("Fetching all container codes...")
    
    while current_page <= max_pages:
        try:
            payload = {"current": current_page, "size": 1}
            headers = {"Content-Type": "application/json"}
            response = requests.post(CONTAINER_LIST_URL, json=payload, headers=headers, timeout=30)
            response.raise_for_status()
            data = response.json()
            
            if data['code'] != 0:
                logger.error(f"Failed to fetch page {current_page}: {data['msg']}")
                break
                
            containers = data['data']['list']
            if not containers:
                logger.info(f"No containers on page {current_page}, stopping")
                break
                
            container_code = containers[0]['containerCode']
            if container_code in processed_codes:
                logger.info(f"Container {container_code} already exists, skipping")
                current_page += 1
                continue
                
            processed_codes.add(container_code)
            all_container_codes.append({
                'containerCode': container_code,
                'page': current_page
            })
            logger.info(f"Fetched container: {container_code} (page: {current_page})")
            current_page += 1
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Error fetching page {current_page}: {e}")
            break
    
    all_container_codes.sort(key=lambda x: int(x['containerCode']))
    
    logger.info("\nSorted container list:")
    for i, container in enumerate(all_container_codes):
        logger.info(f"Index {i}: Container ID {container['containerCode']} (page {container['page']})")
    
    return all_container_codes

def main(containers_per_batch, start_page, target_url, page_number, pr):
    """Main function to orchestrate container processing."""
    try:
        with open(pr, 'r') as f:
            secret_phrases = f.readlines()
        if not secret_phrases:
            logger.error("Secret file is empty")
            sys.exit(1)
        logger.info(f"Secret file contains {len(secret_phrases)} lines")
    except Exception as e:
        logger.error(f"Unable to read secret file: {e}")
        sys.exit(1)
    
    if not check_service_availability():
        logger.error("Hubstudio service unavailable, ensure hubstudio_connector.exe is running")
        sys.exit(1)
    
    columns = 4
    start_page_ref = [start_page]
    processed_pages = set()
    processed_container_ids = set()
    
    try:
        while True:
            containers, last_page = list_available_containers(start_page_ref[0], containers_per_batch, processed_pages, processed_container_ids=processed_container_ids)
            
            if not containers:
                logger.info("No more containers found")
                logger.info("Current cycle completed, restarting")
                start_page_ref[0] = 1
                processed_pages.clear()
                processed_container_ids.clear()
                logger.info("Starting new cycle...")
                time.sleep(5)
                continue
            
            logger.info(f"\nProcessing batch of {len(containers)} containers, sorted by ID")
            
            drivers = []
            containers_info = []
            
            for index, (container, page_number) in enumerate(containers):
                container_code = container['containerCode']
                actual_page = container['page_number']
                container_name = container['container_name']
                
                if container_code in processed_container_ids:
                    logger.info(f"Container {container_code} already processed, skipping")
                    continue
                    
                window_position = calculate_window_position(index, len(containers), columns, containers_per_batch)
                driver = start_browser(container_code, window_position, page_number, MAX_RETRIES, processed_pages)
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
                    logger.warning(f"Skipping failed container {container_code}")
                time.sleep(5)
            
            if drivers:
                process_all_containers(drivers, target_url, containers_info, start_page_ref, processed_pages, pr, processed_container_ids)
            
            start_page_ref[0] = last_page + 1
            time.sleep(5)
    
    except KeyboardInterrupt:
        logger.info("Script interrupted by user, cleaning up...")
        for driver, container_code, _ in drivers:
            try:
                driver.quit()
                stop_browser(container_code)
            except Exception as e:
                logger.error(f"Error cleaning up container {container_code}: {e}")
        sys.exit(1)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Run Hubstudio browser automation")
    parser.add_argument("--start-page", type=int, default=int(input("请输入起始页数：")), help="Starting page number")
    parser.add_argument("--containers-per-batch", type=int, default=int(input("请输入浏览器数量：")), help="Number of browsers per batch")
    parser.add_argument("--target-url", type=str, default="https://x.com/", help="Target URL for automation")
    parser.add_argument("--list-containers", action="store_true", help="List all container IDs")
    parser.add_argument("--pr", type=str, default=input("请输入推特文件路径："), help="Path to secret file")
    args = parser.parse_args()

    if args.list_containers:
        get_all_container_codes()
        sys.exit(0)

    page_number = 0
    main(args.containers_per_batch, args.start_page, args.target_url, page_number, args.pr)