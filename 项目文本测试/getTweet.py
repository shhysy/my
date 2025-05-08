import os
import requests
import json
from datetime import datetime
import time
import random
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from getId import get_user_id, load_user_info
import re

def get_all_tokens():
    """
    从文件中读取所有bearer token
    
    Returns:
        token列表
    """
    try:
        with open('x_monitor/BEARER_TOKEN.txt', 'r', encoding='utf-8') as f:
            tokens = f.read().splitlines()
            # 过滤掉空行
            tokens = [token.strip() for token in tokens if token.strip()]
            if not tokens:
                print("BEARER_TOKEN.txt文件中没有有效的token")
                return []
            return tokens
    except Exception as e:
        print(f"读取token文件失败: {e}")
        return []

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

def save_tweet_data(screen_name='', tweet_id='', tweet_type='普通推文'):
    """
    获取推文数据并保存为JSON
    
    Args:
        screen_name: Twitter用户名
        tweet_id: 推文ID
        tweet_type: 推文类型
    
    Returns:
        保存的JSON文件路径
    """
    # 保存JSON文件
    file_path = r"C:\x\x.json"
    
    # 检查文件是否已存在
    if os.path.exists(file_path):
        # 读取现有数据
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                existing_data = json.load(f)
        except:
            existing_data = {}
    else:
        existing_data = {}
    
    # 检查该推文是否已存在
    if tweet_id in existing_data:
        print(f"推文 {tweet_id} 的数据已存在")
        return file_path
    
    # 读取所有Bearer Token
    tokens = get_all_tokens()
    if not tokens:
        print("没有可用的Bearer Token")
        return None
    
    # 创建session
    session = create_session()
    
    # 逐个尝试所有token
    for token in tokens:
        try:
            # 添加延迟，减少请求频率
            time.sleep(random.uniform(1, 3))
            
            # API请求头
            headers = {
                "Authorization": f"Bearer {token}"
            }
            
            # 使用Twitter API 获取单条推文
            tweet_url = f"https://api.twitter.com/2/tweets/{tweet_id}"
            
            # API参数
            params = {
                "expansions": "author_id",
                "user.fields": "name,username,profile_image_url",
                "tweet.fields": "created_at,text"
            }
            
            print(f"正在获取推文 {tweet_id} 的数据...")
            response = session.get(tweet_url, headers=headers, params=params, timeout=20)
            
            if response.status_code != 200:
                print(f"获取推文数据失败: {response.status_code}")
                if response.status_code == 429:
                    print("请求过多，API限制，尝试下一个token")
                elif response.status_code in [401, 403]:
                    print("Token无效或权限不足，尝试下一个token")
                else:
                    print(f"错误详情: {response.text}")
                continue
            
            # 获取API返回的JSON数据
            tweet_data = response.json()
            
            # 格式化数据以保持与现有结构一致
            formatted_data = {
                "data": {
                    "edit_history_tweet_ids": [tweet_id],
                    "author_id": tweet_data.get("data", {}).get("author_id", ""),
                    "id": tweet_id,
                    "text": "",
                    "created_at": tweet_data.get("data", {}).get("created_at", datetime.now().strftime("%Y-%m-%dT%H:%M:%S.000Z"))
                },
                "includes": {
                    "users": []
                }
            }
            
            # 获取用户信息
            if "includes" in tweet_data and "users" in tweet_data["includes"] and len(tweet_data["includes"]["users"]) > 0:
                user = tweet_data["includes"]["users"][0]
                formatted_data["includes"]["users"].append({
                    "name": user.get("name", ""),
                    "id": user.get("id", ""),
                    "username": user.get("username", ""),
                    "profile_image_url": user.get("profile_image_url", "")
                })
                
                # 设置文本格式为 "用户名: 推文内容"
                formatted_data["data"]["text"] = f"{user.get('name', '')}: {tweet_data.get('data', {}).get('text', '')}"
            else:
                # 如果没有用户信息，直接使用推文内容
                formatted_data["data"]["text"] = tweet_data.get("data", {}).get("text", "")
            
            # 将新数据添加到现有数据中
            existing_data[tweet_id] = formatted_data
            
            # 确保目录存在
            os.makedirs(os.path.dirname(file_path), exist_ok=True)
            
            # 保存JSON文件
            with open(file_path, 'w', encoding='utf-8') as f:
                json.dump(existing_data, f, ensure_ascii=False, indent=4)
            
            print(f"已保存推文 {tweet_id} 的数据到 {file_path}")
            return file_path
            
        except Exception as e:
            print(f"获取推文数据时出错: {e}")
            continue
    
    print("所有token都尝试失败")
    return None

def get_user_tweets(username):
    """
    获取用户最新的推文
    
    Args:
        username: 用户名
    
    Returns:
        最新的推文ID
    """
    # 读取所有Bearer Token
    tokens = get_all_tokens()
    if not tokens:
        print("没有可用的Bearer Token")
        return None
    
    # 从user_info.txt获取用户ID
    user_info = load_user_info()
    if username not in user_info:
        print(f"未在user_info.txt中找到用户 {username} 的ID")
        # 尝试重新获取用户ID
        try:
            user_id = get_user_id(username)
            if user_id:
                print(f"成功获取用户 {username} 的ID: {user_id}")
                user_info[username] = user_id
            else:
                print(f"无法获取用户 {username} 的ID")
                return None
        except:
            print(f"获取用户 {username} 的ID时出错")
            return None
    
    user_id = user_info[username]
    print(f"用户 {username} 的ID: {user_id}")
    
    # 创建session
    session = create_session()
    
    # 逐个尝试所有token
    for token in tokens:
        try:
            # 添加延迟，减少请求频率
            time.sleep(random.uniform(1, 3))
            
            # API请求头
            headers = {
                "Authorization": f"Bearer {token}"
            }
            
            # 使用用户ID获取推文
            tweets_url = f"https://api.twitter.com/2/users/{user_id}/tweets"
            
            # API参数 - 获取最近几条推文，包含创建时间，并排除回复和转发
            params = {
                "max_results": 5,
                "tweet.fields": "created_at,text",
                "exclude": "replies,retweets"
            }
            
            print(f"正在尝试获取 {username} 的推文...")
            response = session.get(tweets_url, headers=headers, params=params, timeout=20)
            
            # 打印响应状态以便调试
            print(f"状态码: {response.status_code}")
            
            if response.status_code != 200:
                print(f"获取 {username} 的推文失败: {response.status_code}")
                if response.status_code == 429:
                    print("请求过多，API限制，尝试下一个token")
                elif response.status_code in [401, 403]:
                    print("Token无效或权限不足，尝试下一个token")
                else:
                    print(f"错误详情: {response.text}")
                continue
            
            # 成功获取数据
            try:
                tweet_data = response.json()
            except Exception as e:
                print(f"解析JSON数据出错: {e}")
                continue
            
            if "data" in tweet_data and len(tweet_data["data"]) > 0:
                # 按创建时间排序推文，获取最新的
                try:
                    sorted_tweets = sorted(tweet_data["data"], 
                                           key=lambda x: x.get("created_at", ""), 
                                           reverse=True)
                    
                    latest_tweet = sorted_tweets[0]
                    latest_id = latest_tweet['id']
                    print(f"获取到 {username} 最新推文ID: {latest_id}")
                    
                    # 打印推文预览
                    tweet_text = latest_tweet.get('text', '')[:50] + "..." if len(latest_tweet.get('text', '')) > 50 else latest_tweet.get('text', '')
                    print(f"推文内容预览: {tweet_text}")
                    
                    return latest_id
                except Exception as e:
                    print(f"处理推文数据时出错: {e}")
                    continue
            else:
                print(f"未获取到 {username} 的推文数据，尝试下一个token")
                continue
                
        except Exception as e:
            print(f"请求 {username} 的推文时出错: {str(e)}，尝试下一个token")
            continue
    
    print(f"获取 {username} 的推文失败，所有token都尝试失败")
    return None

def main():
    # 从文件读取要监控的用户列表
    try:
        with open('x_monitor/user_info.txt', 'r', encoding='utf-8') as f:
            usernames = [line.strip().split(':')[0] for line in f.readlines() if line.strip()]
    except:
        print("未找到user_info.txt文件或文件为空")
        return
    
    while True:
        try:
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"\n开始获取所有用户推文数据 - {current_time}")
            
            # 保存所有用户的最新推文
            tweet_count = 0
            for username in usernames:
                # 获取最新推文
                latest_tweet_id = get_user_tweets(username)
                if latest_tweet_id:
                    save_tweet_data(
                        screen_name=username,
                        tweet_id=latest_tweet_id,
                        tweet_type='普通推文'
                    )
                    tweet_count += 1
                
                # 在用户之间添加较短的延迟
                time.sleep(random.uniform(3, 5))
            
            print(f"本轮已获取 {tweet_count}/{len(usernames)} 用户的最新推文")
            
            # 增加扫描间隔
            print(f"等待5分钟后再次获取所有用户的推文...")
            for _ in range(15
            ):
                time.sleep(60)
            
        except KeyboardInterrupt:
            print("\n程序被用户中断，正在退出...")
            break
        except Exception as e:
            print(f"发生错误: {e}")
            print("等待5分钟后重试...")
            time.sleep(300)

if __name__ == '__main__':
    main()





    # 在运行前请替换BEARER_TOKEN为您的实际Twitter API token
    # save_tweet_data(screen_name='wublockchain12', tweet_id='1854127645015130403', tweet_type='普通推文')
    # save_tweet_data('elonmusk','1683251900341268480','回复推文')
    # save_tweet_data('elonmusk','1659255574440169473', '普通推文')
    # save_tweet_data('elonmusk','1659256261068595201', '引用推文')