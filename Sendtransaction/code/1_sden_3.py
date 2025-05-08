from web3 import Web3
import json
import time
import pandas as pd
import random
from eth_account import Account
from mnemonic import Mnemonic
from eth_keys import keys
import hashlib
from importlib.metadata import version
from eth_utils import to_hex, to_bytes
from typing import Optional
import os

# 启用助记词功能
Account.enable_unaudited_hdwallet_features()

def load_wallets(file_path):
    """加载钱包助记词"""
    with open(file_path, 'r') as f:
        return [line.strip() for line in f if line.strip()]

def load_completed_transfers(file_path='completed_transfers.txt'):
    """加载已完成转账的记录"""
    if not os.path.exists(file_path):
        return set()
    with open(file_path, 'r') as f:
        return set(line.strip() for line in f if line.strip())

def save_completed_transfer(address, file_path='completed_transfers.txt'):
    """保存已完成的转账记录"""
    with open(file_path, 'a') as f:
        f.write(f"{address}\n")

def mnemonic_to_private_key(mnemonic_str: str) -> str:
    """将助记词转换为私钥"""
    try:
        # 使用 eth_account 的 from_mnemonic 方法
        account = Account.from_mnemonic(mnemonic_str)
        private_key = account.key.hex()
        
        # 打印调试信息
        print(f"助记词: {mnemonic_str}")
        print(f"生成的私钥: {private_key}")
        print(f"生成的地址: {account.address}")
        
        return private_key
    except Exception as e:
        raise ValueError(f"处理助记词时出错: {str(e)}")

def transfer_eth(w3, from_private_key, to_address, amount):
    """执行ETH转账"""
    account = w3.eth.account.from_key(from_private_key)
    from_address = account.address
    
    # 获取nonce
    nonce = w3.eth.get_transaction_count(from_address)
    
    # 获取gas价格
    gas_price = w3.eth.gas_price
    
    # 计算交易所需的总费用（包括gas费用）
    gas_cost = 21000 * gas_price  # 21000是标准转账的gas限制
    total_cost = w3.to_wei(amount, 'ether') + gas_cost
    
    # 检查账户余额
    balance = w3.eth.get_balance(from_address)
    if balance < total_cost:
        raise ValueError(f"余额不足: 需要 {w3.from_wei(total_cost, 'ether')} ETH, 当前余额 {w3.from_wei(balance, 'ether')} ETH")
    
    # 构建交易
    transaction = {
        'nonce': nonce,
        'to': to_address,
        'value': w3.to_wei(amount, 'ether'),
        'gas': 21000,
        'gasPrice': gas_price,
        'chainId': 10  # Optimism主网
    }
    
    # 签名交易
    signed_txn = w3.eth.account.sign_transaction(transaction, from_private_key)
    
    # 发送交易
    if hasattr(signed_txn, 'raw_transaction'):
        tx_hash = w3.eth.send_raw_transaction(signed_txn.raw_transaction)
    else:
        raise AttributeError("Signed transaction has no 'raw_transaction' attribute")
    
    # 等待交易确认
    receipt = w3.eth.wait_for_transaction_receipt(tx_hash)
    return receipt

def main():
    # 检查web3版本
    web3_version = version('web3')
    print(f"Using web3 version: {web3_version}")
    
    # 连接到Optimism网络
    w3 = Web3(Web3.HTTPProvider('https://mainnet.optimism.io'))  # Optimism主网RPC
    
    # 检查网络连接
    if not w3.is_connected():
        raise ConnectionError("无法连接到Optimism网络")
    
    # 检查网络ID
    chain_id = w3.eth.chain_id
    if chain_id != 10:  # Optimism主网的chain_id是10
        raise ValueError(f"错误的网络ID: {chain_id}, 期望值: 10 (Optimism主网)")
    
    print(f"已连接到Optimism主网 (Chain ID: {chain_id})")

    # 读取Excel文件
    df = pd.read_excel('distribution_result.xlsx')
    
    # 读取密钥文件
    mnemonics = load_wallets('Sendtransaction/key/1/1_1_key.txt')
    print(f"读取到的助记词数量: {len(mnemonics)}")
    
    # 加载已完成转账的记录
    completed_transfers = load_completed_transfers()
    print(f"已完成的转账数量: {len(completed_transfers)}")
    
    # 获取第一行数据
    row = df.iloc[0]
    print(f"Excel中的发送者地址: {row['sden_ads'] if 'sden_ads' in row else '未找到发送者地址列'}")
    
    # 将助记词转换为私钥
    sender_private_key = mnemonic_to_private_key(mnemonics[0])
    
    # 获取发送者地址
    sender_address = w3.eth.account.from_key(sender_private_key).address
    sender_balance = w3.eth.get_balance(sender_address)
    print(f"生成的发送者地址: {sender_address}")
    print(f"发送者余额: {w3.from_wei(sender_balance, 'ether')} ETH")
    
    # 发送3次交易
    receiver_addresses = [
        row['接受地址1'],
        row['接受地址2'],
        row['接受地址3']
    ]
    
    receiver_amounts = [
        row['接受地址余额1'],
        row['接受地址余额2'],
        row['接受地址余额3']
    ]
    
    for i in range(3):
        # 检查余额是否大于0
        if receiver_amounts[i] <= 0:
            print(f"跳过交易: 地址 {receiver_addresses[i]} 的余额 {receiver_amounts[i]} ETH 小于等于0")
            continue
            
        # 检查是否已经完成过转账
        if receiver_addresses[i] in completed_transfers:
            print(f"跳过交易: 地址 {receiver_addresses[i]} 已经完成过转账")
            continue
            
        try:
            receipt = transfer_eth(w3, sender_private_key, receiver_addresses[i], receiver_amounts[i])
            print(f"转账成功: 到地址 {receiver_addresses[i]}, 金额: {receiver_amounts[i]} ETH, 交易哈希: {receipt['transactionHash'].hex()}")
            # 记录成功的转账
            save_completed_transfer(receiver_addresses[i])
            completed_transfers.add(receiver_addresses[i])
        except Exception as e:
            print(f"转账失败: 到地址 {receiver_addresses[i]}, 金额: {receiver_amounts[i]} ETH, 错误: {str(e)}")
        
        # 随机延时1-300秒
        delay = random.randint(1, 300)
        print(f"等待 {delay} 秒后继续下一笔交易...")
        time.sleep(delay)

if __name__ == "__main__":
    main()
