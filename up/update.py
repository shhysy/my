from Utils.SeleniumUtils import SeleniumUtils
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

selenium_utils = SeleniumUtils()

def update_script(driver):
    try:
        selenium_utils.WebDriverWait(driver, 5).until(
            selenium_utils.EC.presence_of_element_located((selenium_utils.By.CLASS_NAME, "script_update"))
        )
        
        script_update_elements = driver.find_elements(selenium_utils.By.CLASS_NAME, "script_update")
        
        for element in script_update_elements:
            time_spans = element.find_elements(selenium_utils.By.XPATH, ".//span[contains(@class, 'clickable') and (contains(text(), 'min') or contains(text(), 'h') or contains(text(), 'd'))]")
            #加个判断检测是否是0min
            if time_spans:
                for span in time_spans:
                    span.click()
        return True
    
    except Exception as e:
        print(f"更新脚本时发生错误: {str(e)}")
        return False




def update_up(driver):
    original_window = driver.current_window_handle  # 记录原始窗口
    try:
        handles = driver.window_handles
        if not handles:
            print("没有可用窗口，无法更新")
            return False

        print(f"当前窗口: {original_window}，标题: {driver.title}")

        target_window = None

        # 遍历所有窗口，找到 "UserScript の更新"
        for handle in handles:
            try:
                driver.switch_to.window(handle)
                window_title = driver.title
                print(f"检测窗口: {window_title}")

                if "UserScript の更新" in window_title or "유저 스크립트 업데이트" in window_title or "更新用户脚本" in window_title:
                    target_window = handle
                    break
            except Exception as e:
                print(f"检查窗口 {handle} 时出错: {str(e)}")

        if not target_window:
            print("未找到 'UserScript の更新' 窗口")
            return False

        # 确保窗口仍然存在
        if target_window not in driver.window_handles:
            print(f"窗口 {target_window} 已关闭")
            return False

        driver.switch_to.window(target_window)
        print(f"成功切换到 'UserScript の更新' 窗口: {driver.title}")

        # 查找更新按钮
        update_buttons = driver.execute_script("""
            return Array.from(document.querySelectorAll('input.button.install')).filter(button => {
                const value = button.value ? button.value.toLowerCase() : button.textContent.toLowerCase();
                return value === '更新' || value === 'update' || value === 'overwrite' ||
                       value === '업데이트' || value === '上書き' || value === '업그레이드' ||
                       button.name === '업그레이드';
            });
        """)

        if update_buttons:
            for button in update_buttons:
                try:
                    if button.is_enabled():
                        driver.execute_script("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", button)
                        time.sleep(0.5)  # 稍作等待
                        driver.execute_script("arguments[0].click();", button)
                        print("成功点击更新按钮")

                        # 等待窗口关闭（最长 3 秒）
                        WebDriverWait(driver, 3).until(lambda d: target_window not in d.window_handles)
                        print("更新窗口已关闭，任务完成")
                        return True
                except Exception as e:
                    print(f"点击按钮时出错: {str(e)}")

        print("未找到可点击的更新按钮")
        return False

    except Exception as e:
        print(f"更新脚本时发生错误: {str(e)}")
        return False

    finally:
        time.sleep(0.5)  # 给窗口切换一点缓冲时间

        # 确保原窗口仍然存在后再切换回去
        if original_window in driver.window_handles:
            driver.switch_to.window(original_window)
            print("切换回原窗口")
        else:
            print("原始窗口已关闭，不能切换回去")
