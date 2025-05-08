from binance.spot import Spot
from binance.error import ClientError
import pandas as pd
import time
import logging
import random
import os

# 获取程序所在目录
script_dir = os.path.dirname(os.path.abspath(__file__))
log_file_path = os.path.join(script_dir, 'withdrawal.log')

# 设置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    filename=log_file_path
)

class BinanceWithdraw:
    def __init__(self, api_key, api_secret):
        self.client = Spot(api_key=api_key, api_secret=api_secret)
    
    def test_connection(self):
        """
        测试API连接是否正常
        """
        try:
            # 测试API连接和权限
            account_info = self.client.account()
            logging.info("API连接测试成功")
            return True
        except ClientError as e:
            logging.error(f"API连接测试失败: {str(e)}")
            return False
    
    def withdraw(self, coin, address, amount, network=None):
        try:
            params = {
                "coin": coin,
                "address": address,
                "amount": amount
            }
            if network:
                params["network"] = network
            
            # 添加参数打印，方便调试    
            logging.info(f"准备提现，参数: {params}")
            
            # 获取币种信息
            coin_info = self.client.coin_info()
            valid_coins = [c['coin'] for c in coin_info]
            if coin not in valid_coins:
                raise ValueError(f"不支持的币种: {coin}")
                
            result = self.client.withdraw(**params)
            logging.info(f"提现成功: {coin} - {amount} -> {address}")
            return True, result
        except ClientError as e:
            error_msg = f"提现失败: {coin} - {amount} -> {address}, 错误: {str(e)}"
            logging.error(error_msg)
            print(error_msg)
            return False, str(e)
        except Exception as e:
            error_msg = f"发生未知错误: {str(e)}"
            logging.error(error_msg)
            print(error_msg)
            return False, str(e)
    
    def batch_withdraw(self, csv_file):
        """
        从CSV文件批量提现，每次提现间隔1-200秒
        CSV格式: coin,address,amount,network
        """
        try:
            df = pd.read_csv(csv_file)
            if df.empty:
                raise ValueError("CSV文件是空的")
                
            # 验证CSV文件格式
            required_columns = ['coin', 'address', 'amount', 'network']
            missing_columns = [col for col in required_columns if col not in df.columns]
            if missing_columns:
                raise ValueError(f"CSV文件缺少必要的列: {', '.join(missing_columns)}")
                
            results = []
            
            # 获取账户余额
            account_info = self.client.account()
            balances = {asset['asset']: float(asset['free']) for asset in account_info['balances']}
            
            for index, row in df.iterrows():
                # 检查余额
                coin = row['coin']
                amount = float(row['amount'])
                if coin not in balances or balances[coin] < amount:
                    error_msg = f"余额不足: {coin} 需要 {amount}, 当前余额 {balances.get(coin, 0)}"
                    logging.error(error_msg)
                    print(error_msg)
                    continue
                
                # 随机等待1-200秒
                if index > 0:
                    wait_time = random.randint(1, 300)
                    print(f"\n等待 {wait_time} 秒后进行下一笔转账...")
                    logging.info(f"等待 {wait_time} 秒")
                    time.sleep(wait_time)
                    
                print(f"\n开始第 {index + 1} 笔转账:")
                success, result = self.withdraw(
                    coin=row['coin'],
                    address=row['address'],
                    amount=row['amount'],
                    network=row['network'] if 'network' in row else None
                )
                
                results.append({
                    'coin': row['coin'],
                    'address': row['address'],
                    'amount': row['amount'],
                    'status': 'success' if success else 'failed',
                    'result': result
                })
                
                # 更新余额信息
                if success:
                    balances[coin] -= amount
                
            # 获取程序所在目录
            script_dir = os.path.dirname(os.path.abspath(__file__))
            results_file_path = os.path.join(script_dir, 'withdrawal_results.csv')
            
            # 保存结果到CSV
            results_df = pd.DataFrame(results)
            results_df.to_csv(results_file_path, index=False)
            return results
        except Exception as e:
            error_msg = f"批量提现过程中发生错误: {str(e)}"
            logging.error(error_msg)
            print(error_msg)
            return []

    def get_account_balance(self):
        """
        获取账户所有币种余额
        """
        try:
            account_info = self.client.account()
            # 只显示有余额的币种
            balances = [
                {
                    'coin': asset['asset'],
                    'free': float(asset['free']),
                    'locked': float(asset['locked'])
                }
                for asset in account_info['balances']
                if float(asset['free']) > 0 or float(asset['locked']) > 0
            ]
            
            # 按余额从大到小排序
            balances.sort(key=lambda x: x['free'], reverse=True)
            return balances
        except Exception as e:
            error_msg = f"获取账户余额失败: {str(e)}"
            logging.error(error_msg)
            print(error_msg)
            return []

def main():
    # 从环境变量或配置文件读取API密钥
    API_KEY = "C75CHrsDYzfqiMyyzyLNjTqqmYLpzgg2rrF12G2MC6vDSUlumnt5ViJ0tbegwP1H"
    API_SECRET = "4LOPgIzlNZ9GDdMO4eayHpVgKvMWcLY3R0vEX7LGrUAurbYgZz7pUTc984A6aGzZ"
    
    withdrawer = BinanceWithdraw(API_KEY, API_SECRET)
    
    # 首先测试API连接
    if not withdrawer.test_connection():
        print("API连接测试失败，请检查API密钥是否正确")
        return
    print("API连接测试成功")

    # 显示转账前账户余额
    print("\n转账前账户余额:")
    print("币种\t\t可用余额\t\t锁定余额")
    print("-" * 50)
    balances_before = withdrawer.get_account_balance()
    for balance in balances_before:
        print(f"{balance['coin']:<10}\t{balance['free']:<15.8f}\t{balance['locked']:<15.8f}")
    print("-" * 50 + "\n")

    # 读取并显示待转账的地址
    try:
        # 获取脚本所在目录
        script_dir = os.path.dirname(os.path.abspath(__file__))
        # 构建withdrawals.csv的完整路径
        csv_path = os.path.join(script_dir, 'withdrawals.csv')
        
        df = pd.read_csv(csv_path)
        print("\n=== 即将转账到以下地址 ===")
        print("序号\t地址\t\t\t\t金额\t币种")
        print("-" * 80)
        for index, row in df.iterrows():
            print(f"{index+1}.\t{row['address']:<40}\t{row['amount']}\t{row['coin']}")
        print("-" * 80)
        print(f"\n总计提现地址数: {len(df)}")
        total_amount = df['amount'].sum()
        print(f"总计提现金额: {total_amount} {df['coin'].iloc[0]}\n")
    except Exception as e:
        print(f"读取转账列表失败: {str(e)}")
        return

    if input("是否继续执行批量提现? (yes/no): ").lower() == 'yes':
        # 执行批量提现
        results = withdrawer.batch_withdraw(csv_path)
        
        # 暂停3秒等待余额更新
        time.sleep(3)
        
        # 显示转账后账户余额
        print("\n转账后账户余额:")
        print("币种\t\t可用余额\t\t锁定余额")
        print("-" * 50)
        balances_after = withdrawer.get_account_balance()
        for balance in balances_after:
            print(f"{balance['coin']:<10}\t{balance['free']:<15.8f}\t{balance['locked']:<15.8f}")
        print("-" * 50 + "\n")
        
        # 获取结果文件路径
        results_file_path = os.path.join(script_dir, 'withdrawal_results.csv')
        print(f"批量提现完成，请查看 {results_file_path} 获取详细结果")

if __name__ == "__main__":
    main() 