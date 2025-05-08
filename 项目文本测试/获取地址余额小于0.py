from web3 import Web3
import os

def get_balance(address, rpc_url):
    try:
        # 连接到 Optimism 节点
        w3 = Web3(Web3.HTTPProvider(rpc_url))
        
        # 检查连接
        if not w3.is_connected():
            return f"无法连接到 Optimism 节点: {rpc_url}"
        
        # 检查地址格式
        if not w3.is_address(address):
            return f"无效的地址格式: {address}"
        
        # 获取余额（以 Wei 为单位）
        balance_wei = w3.eth.get_balance(address)
        
        # 转换为 ETH
        balance_eth = w3.from_wei(balance_wei, 'ether')
        
        return f"{address}:{balance_eth} ETH", float(balance_eth)
    
    except Exception as e:
        return f"错误: {str(e)}", None

def main():
    # Optimism 主网 RPC 节点
    rpc_url = "https://mainnet.optimism.io"
    
    # 获取用户输入的文件路径
    print("请输入地址文件路径：")
    file_path = input().strip().strip("'").strip('"')  # 移除可能的引号
    
    # 设置日志文件路径
    log_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'log', 'log.txt')
    
    try:
        # 读取地址文件
        with open(file_path, 'r') as file:
            addresses = file.readlines()
        
        print("开始查询地址余额...")
        
        # 创建日志文件目录（如果不存在）
        os.makedirs(os.path.dirname(log_path), exist_ok=True)
        
        # 打开日志文件准备写入
        with open(log_path, 'w', encoding='utf-8') as log_file:
            for address in addresses:
                address = address.strip()  # 移除换行符和空格
                if address:  # 跳过空行
                    result, balance = get_balance(address, rpc_url)
                    print(result)  # 打印到控制台
                    # 只保存余额小于等于0的地址
                    if balance is not None and balance <= 0:
                        log_file.write(address + '\n')  # 写入日志文件
        
        print(f"\n查询完成！余额为0的地址已保存到：{log_path}")
                
    except FileNotFoundError:
        print(f"错误：找不到文件 {file_path}")
        print("请确保文件路径正确，并且文件存在")
    except Exception as e:
        print(f"发生错误：{str(e)}")

if __name__ == "__main__":
    main()
