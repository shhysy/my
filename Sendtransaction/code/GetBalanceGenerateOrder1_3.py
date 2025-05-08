from web3 import Web3
import json
import os
import random
from tabulate import tabulate
import pandas as pd

def get_balance(address, web3):
    """Get the balance of an address in ETH"""
    try:
        balance_wei = web3.eth.get_balance(address)
        balance_eth = web3.from_wei(balance_wei, 'ether')
        return float(balance_eth)
    except Exception as e:
        print(f"Error getting balance: {str(e)}")
        return None

def calculate_distribution_amounts(balance):
    """Calculate 95% of balance and split into 3 equal parts"""
    total_amount = balance * 0.95
    part_amount = total_amount / 3
    return part_amount

def read_addresses(file_path):
    """Read addresses from a text file"""
    try:
        with open(file_path, 'r') as file:
            addresses = [line.strip() for line in file if line.strip()]
        return addresses
    except Exception as e:
        print(f"Error reading addresses file: {str(e)}")
        return None

def random_split(total, n):
    """将total随机分成n份，返回一个长度为n的列表，且和为total"""
    cuts = sorted([0] + [random.uniform(0, total) for _ in range(n-1)] + [total])
    return [round(cuts[i+1] - cuts[i], 8) for i in range(n)]

def main():
    # Connect to Optimism network
    web3 = Web3(Web3.HTTPProvider('https://mainnet.optimism.io'))  # Optimism 主网
    
    print("=== Optimism 余额分配工具 ===")
    print("正在读取源地址文件...")
    
    # Read source address from file
    source_file = "release/wall/1.txt"
    if not os.path.exists(source_file):
        print(f"错误: 找不到源地址文件 {source_file}")
        return
    
    source_addresses = read_addresses('Sendtransaction/ads/1/1_1_ads.txt')
    if source_addresses is None or len(source_addresses) == 0:
        print("错误: 无法读取源地址或文件为空")
        return
    
    # Use the first address as source address
    source_address = source_addresses[0]
    print(f"源地址: {source_address}")
    
    # Get balance
    print("\n正在查询余额...")
    balance = get_balance(source_address, web3)
    if balance is None:
        return
    
    print(f"当前余额: {balance} ETH")
    
    # Calculate distribution amounts
    part_amount = calculate_distribution_amounts(balance)
    print(f"每份分配金额: {part_amount} ETH")
    
    # Read target addresses from 1_3_ads.txt
    target_file = "Sendtransaction/ads/1/1_3_ads.txt"
    print("\n正在读取目标地址文件...")
    if not os.path.exists(target_file):
        print(f"错误: 找不到目标地址文件 {target_file}")
        return
    
    target_addresses = read_addresses(target_file)
    if target_addresses is None:
        return
    
    if len(target_addresses) != 300:
        print(f"警告: 期望300个目标地址，但找到 {len(target_addresses)} 个")
        proceed = input("是否继续? (y/n): ").lower()
        if proceed != 'y':
            return
    
    # Create distribution plan
    print("\n正在生成分配计划...")
    distribution_plan = []
    for i in range(0, len(target_addresses), 3):
        if i + 2 < len(target_addresses):
            group = {
                'address1': target_addresses[i],
                'address2': target_addresses[i + 1],
                'address3': target_addresses[i + 2],
                'amount': part_amount
            }
            distribution_plan.append(group)
    

    rows = []
    print(f"source_addresses: {len(source_addresses)}")
    print(f"target_addresses: {len(target_addresses)}")
    for i in range(0, len(target_addresses), 3):
        group_num = i // 3 + 1
        group_addresses = target_addresses[i:i+3]
        group_source_address = source_addresses[group_num-1]
        group_balance = get_balance(group_source_address, web3)
        total_amount = group_balance * 0.95 if group_balance else 0
        amounts = random_split(total_amount, 3) if total_amount > 0 else [0, 0, 0]
        row = [
            group_num,
            group_source_address,
            group_balance
        ]
        for addr in group_addresses:
            row.append(addr)
        for amt in amounts:
            row.append(amt)
        print(row)  # 调试输出
        rows.append(row)

    # 保存为Excel
    df = pd.DataFrame(
        rows,
        columns=[
            'id', 'sden_ads', '总余额',
            '接受地址1', '接受地址2', '接受地址3',
            '接受地址余额1', '接受地址余额2', '接受地址余额3'
        ]
    )
    df.to_excel('distribution_result.xlsx', index=False)
    print("分配结果已保存为 distribution_result.xlsx")

if __name__ == "__main__":
    main()
