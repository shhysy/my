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

def read_addresses(file_path):
    """Read addresses from a text file"""
    try:
        with open(file_path, 'r') as file:
            addresses = [line.strip() for line in file if line.strip()]
        return addresses
    except Exception as e:
        print(f"Error reading addresses file: {str(e)}")
        return None

def clean_path(path):
    """清理文件路径，移除引号和多余的空格"""
    return path.strip().strip("'").strip('"')

def main():
    # Connect to Optimism network
    web3 = Web3(Web3.HTTPProvider('https://mainnet.optimism.io'))  # Optimism 主网
    
    print("=== Optimism 余额分配工具 ===")
    
    # 手动输入源地址文件路径
    while True:
        source_file = clean_path(input("\n请输入源地址文件路径: "))
        if os.path.exists(source_file):
            break
        print(f"错误: 找不到源地址文件 {source_file}，请重新输入")
    
    # 手动输入目标地址文件路径
    while True:
        target_file = clean_path(input("请输入目标地址文件路径: "))
        if os.path.exists(target_file):
            break
        print(f"错误: 找不到目标地址文件 {target_file}，请重新输入")
    
    print("\n正在读取源地址文件...")
    source_addresses = read_addresses(source_file)
    if source_addresses is None or len(source_addresses) == 0:
        print("错误: 无法读取源地址或文件为空")
        return
    
    print("\n正在读取目标地址文件...")
    target_addresses = read_addresses(target_file)
    if target_addresses is None:
        return
    
    if len(target_addresses) != len(source_addresses):
        print(f"警告: 源地址数量({len(source_addresses)})与目标地址数量({len(target_addresses)})不匹配")
        proceed = input("是否继续? (y/n): ").lower()
        if proceed != 'y':
            return
    
    # Create distribution plan
    print("\n正在生成分配计划...")
    rows = []
    print(f"source_addresses: {len(source_addresses)}")
    print(f"target_addresses: {len(target_addresses)}")
    
    for i in range(len(source_addresses)):
        source_address = source_addresses[i]
        target_address = target_addresses[i]
        balance = get_balance(source_address, web3)
        amount = balance if balance else 0  # 使用100%的余额
        
        row = [
            i + 1,  # id
            source_address,
            balance,
            target_address,
            amount
        ]
        print(row)  # 调试输出
        rows.append(row)

    # 手动输入输出文件路径
    output_file = clean_path(input("\n请输入保存结果的文件路径 (例如: distribution_result.xlsx): "))
    if not output_file.endswith('.xlsx'):
        output_file += '.xlsx'

    # 保存为Excel
    df = pd.DataFrame(
        rows,
        columns=[
            'id', '源地址', '总余额',
            '目标地址', '分配金额'
        ]
    )
    df.to_excel(output_file, index=False)
    print(f"分配结果已保存为 {output_file}")

if __name__ == "__main__":
    main()
