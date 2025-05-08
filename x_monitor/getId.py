import os
import requests
import json
import time
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# 获取当前脚本所在目录
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))

def create_session():
    """
    创建一个带有重试机制的session
    """
    session = requests.Session()
    retry_strategy = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504],
    )
    adapter = HTTPAdapter(max_retries=retry_strategy)
    session.mount("https://", adapter)
    session.mount("http://", adapter)
    return session

def get_all_tokens():
    """
    从文件中读取所有bearer token
    
    Returns:
        token列表
    """
    token_file = os.path.join(SCRIPT_DIR, 'BEARER_TOKEN.txt')
    try:
        with open(token_file, 'r', encoding='utf-8') as f:
            tokens = [line.strip() for line in f.readlines() if line.strip()]
            if not tokens:
                print("警告：BEARER_TOKEN.txt 文件为空")
            return tokens
    except Exception as e:
        print(f"读取token文件失败: {e}")
        print(f"请确保 {token_file} 文件存在并包含有效的token")
        return []

def load_user_info():
    """
    从文件加载用户信息
    """
    user_info_file = os.path.join(SCRIPT_DIR, 'user_info.txt')
    try:
        with open(user_info_file, 'r', encoding='utf-8') as f:
            user_info = {}
            for line in f.readlines():
                if ':' in line:
                    username, user_id = line.strip().split(':', 1)
                    user_info[username] = user_id
            return user_info
    except:
        return {}

def save_user_info(user_info):
    """
    保存用户信息到文件
    """
    user_info_file = os.path.join(SCRIPT_DIR, 'user_info.txt')
    with open(user_info_file, 'w', encoding='utf-8') as f:
        for username, user_id in user_info.items():
            f.write(f"{username}:{user_id}\n")

def get_user_id(screen_name):
    """
    获取用户ID
    
    Args:
        screen_name: Twitter用户名
    
    Returns:
        用户ID
    """
    # 先从本地文件获取
    user_info = load_user_info()
    if screen_name in user_info:
        print(f"从本地获取到用户 {screen_name} 的ID: {user_info[screen_name]}")
        return user_info[screen_name]
    
    # 获取所有token
    tokens = get_all_tokens()
    if not tokens:
        print("错误：没有可用的token")
        return None
    
    # 创建session
    session = create_session()
    used_tokens = set()
    
    while len(used_tokens) < len(tokens):
        # 从未使用的token中随机选择一个
        available_tokens = [t for t in tokens if t not in used_tokens]
        token = random.choice(available_tokens)
        used_tokens.add(token)
        
        # API请求头
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }
        
        try:
            # 获取用户ID
            user_url = f"https://api.twitter.com/2/users/by/username/{screen_name}"
            print(f"使用token {token[:10]}... 尝试获取用户信息")
            
            user_response = session.get(user_url, headers=headers, timeout=10)
            
            if user_response.status_code == 400:
                print(f"Token {token[:10]}... 请求格式错误 (400)")
                print("可能的原因：")
                print("1. 用户名包含特殊字符")
                print("2. 用户名格式不正确")
                print(f"响应内容: {user_response.text}")
                continue
            elif user_response.status_code == 403:
                print(f"Token {token[:10]}... 认证失败 (403)")
                print("可能的原因：")
                print("1. Token已过期")
                print("2. Token权限不足")
                print(f"响应内容: {user_response.text}")
                continue
            elif user_response.status_code == 429:
                print(f"Token {token[:10]}... 请求次数超限 (429)")
                print("请稍后再试")
                continue
            elif user_response.status_code != 200:
                print(f"Token {token[:10]}... 获取用户ID失败: {user_response.status_code}")
                print(f"响应内容: {user_response.text}")
                continue
                
            user_data = user_response.json()
            if "data" not in user_data:
                print(f"Token {token[:10]}... 未找到用户数据")
                print(f"响应内容: {user_data}")
                continue
                
            user_id = user_data["data"]["id"]
            print(f"成功获取用户ID: {user_id}")
            
            # 保存用户信息到本地
            user_info[screen_name] = user_id
            save_user_info(user_info)
            
            return user_id
            
        except Exception as e:
            print(f"使用token {token[:10]}... 发生错误: {str(e)}")
            continue
        
        time.sleep(1)
    
    print("所有token都尝试失败")
    return None

def main():
    print("Twitter用户ID获取工具")
    print("输入'q'或'quit'退出程序")
    print("输入'l'或'list'查看已保存的用户")
    
    # 检查token文件
    tokens = get_all_tokens()
    if not tokens:
        print("错误：没有找到有效的token")
        print("请确保 BEARER_TOKEN.txt 文件存在并包含有效的token")
        return
    
    while True:
        username = input("\n请输入Twitter用户名: ").strip()
        
        if username.lower() in ['q', 'quit']:
            print("程序退出")
            break
            
        if username.lower() in ['l', 'list']:
            user_info = load_user_info()
            if user_info:
                print("\n已保存的用户:")
                for uname, uid in user_info.items():
                    print(f"{uname}: {uid}")
            else:
                print("暂无保存的用户信息")
            continue
            
        if not username:
            print("用户名不能为空")
            continue
            
        user_id = get_user_id(username)
        if user_id:
            print(f"用户 {username} 的ID: {user_id} 已保存")
        else:
            print(f"无法获取用户 {username} 的ID")

if __name__ == '__main__':
    main()