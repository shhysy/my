from eth_account import Account
from eth_account.hdaccount import generate_mnemonic
import json
import time
from datetime import datetime
import os
import base58
from solders.keypair import Keypair
from nacl.signing import SigningKey
from typing import Dict, Any
import hashlib
import hmac
from mnemonic import Mnemonic
from bip32utils import BIP32Key
from bitcoinlib.wallets import Wallet
from bitcoinlib.keys import HDKey
import csv
import argparse

class HDWalletGenerator:
    def __init__(self):
        """初始化HD钱包生成器"""
        Account.enable_unaudited_hdwallet_features()
        self.derivation_paths = {
            'ETH': "m/44'/60'/0'/0/0",     # ETH
            'SOL': "m/44'/501'/0'/0'",     # SOL Phantom标准路径
            'BTC': "m/84'/0'/0'/0/0",      # BTC Native SegWit (bech32)
            'SUI': "m/44'/784'/0'/0'/0'"   # SUI 标准路径
        }
        self.mnemo = Mnemonic("english")

    def _derive_ed25519_private_key(self, mnemonic: str, path: str) -> bytes:
        """使用Ed25519特定的派生方法"""
        # 生成种子
        seed = self.mnemo.to_seed(mnemonic)
        
        # 生成主私钥
        I = hmac.new(b"ed25519 seed", seed, hashlib.sha512).digest()
        key, chain_code = I[:32], I[32:]

        # 解析路径
        path_indices = [
            int(i[:-1]) | 0x80000000 if i.endswith("'") else int(i)
            for i in path.strip("m/").split("/")
        ]

        # Ed25519特定的派生
        for index in path_indices:
            data = bytes([0]) + key + index.to_bytes(4, 'big')
            I = hmac.new(chain_code, data, hashlib.sha512).digest()
            key = I[:32]
            chain_code = I[32:]

        return key

    def generate_eth_wallet(self, mnemonic: str) -> Dict[str, str]:
        """生成ETH钱包"""
        account = Account.from_mnemonic(
            mnemonic,
            account_path=self.derivation_paths['ETH']
        )
        return {
            "type": "ETH",
            "address": account.address,
            "private_key": account.key.hex(),
            "derivation_path": self.derivation_paths['ETH']
        }

    def generate_sol_wallet(self, mnemonic: str) -> Dict[str, str]:
        """生成SOL钱包"""
        seed = self.mnemo.to_seed(mnemonic)
        path = self.derivation_paths['SOL']
        
        # 使用Ed25519派生方法获取私钥
        private_key = self._derive_ed25519_private_key(mnemonic, path)
        
        # 创建签名密钥
        signing_key = SigningKey(private_key)
        verify_key = signing_key.verify_key
        
        # 组合私钥和公钥
        keypair_bytes = bytes(private_key) + bytes(verify_key)
        
        # 使用完整的密钥对创建Keypair
        keypair = Keypair.from_bytes(keypair_bytes)
        
        return {
            "type": "SOL",
            "address": str(keypair.pubkey()),
            "private_key": base58.b58encode(bytes(keypair.to_bytes())).decode(),
            "derivation_path": path
        }

    def generate_btc_wallet(self, mnemonic: str) -> Dict[str, str]:
        """生成BTC钱包 (Native SegWit)"""
        seed = self.mnemo.to_seed(mnemonic)
        
        # 创建主密钥
        master_key = HDKey.from_seed(seed)
        
        # 派生子密钥
        derived_key = master_key.subkey_for_path(self.derivation_paths['BTC'])
        
        # 生成地址和私钥
        address = derived_key.address()
        private_key = derived_key.wif()
        
        return {
            "type": "BTC",
            "address": address,
            "private_key": private_key,
            "derivation_path": self.derivation_paths['BTC']
        }

    def generate_sui_wallet(self, mnemonic: str) -> Dict[str, str]:
        """生成SUI钱包"""
        seed = self.mnemo.to_seed(mnemonic)
        path = self.derivation_paths['SUI']
        
        # 使用Ed25519派生方法获取私钥
        private_key = self._derive_ed25519_private_key(mnemonic, path)
        
        # 创建签名密钥
        signing_key = SigningKey(private_key)
        verify_key = signing_key.verify_key
        
        # 获取公钥
        public_key = bytes(verify_key)
        
        # 使用 Blake2b 生成 SUI 地址，输入为 b'\x00'+public_key
        sui_address = "0x" + hashlib.blake2b(b'\x00' + public_key, digest_size=32).hexdigest()
        
        return {
            "type": "SUI",
            "address": sui_address,
            "private_key": private_key.hex(),
            "derivation_path": path
        }

    def generate_wallet_group(self) -> Dict[str, Any]:
        """生成一组钱包"""
        mnemonic = generate_mnemonic(12, "english")
        return {
            "mnemonic": mnemonic,
            "wallets": {
                "ETH": self.generate_eth_wallet(mnemonic),
                "SOL": self.generate_sol_wallet(mnemonic),
                "BTC": self.generate_btc_wallet(mnemonic),
                "SUI": self.generate_sui_wallet(mnemonic)
            },
            "created_at": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

def main():
    """主函数"""
    parser = argparse.ArgumentParser(description='生成指定数量的钱包')
    parser.add_argument('num_groups', type=int, nargs='?', default=30, help='要生成的钱包组数')
    args = parser.parse_args()

    if args.num_groups <= 0:
        print("请输入大于0的数字")
        return

    wallet_generator = HDWalletGenerator()
    wallet_groups = []
    
    # 获取程序所在目录
    program_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = program_dir
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
    
    # 创建单个CSV文件
    csv_file_path = os.path.join(output_dir, "wallets.csv")
    
    try:
        # 创建CSV文件并写入表头
        with open(csv_file_path, mode='w', newline='') as csv_file:
            fieldnames = ['序号', 'Mnemonic', 'ETH Address', 'SOL Address', 'BTC Address', 'SUI Address']
            writer = csv.DictWriter(csv_file, fieldnames=fieldnames)
            writer.writeheader()
            
            # 生成钱包并写入CSV
            for i in range(args.num_groups):
                group = wallet_generator.generate_wallet_group()
                wallet_groups.append(group)
                
                writer.writerow({
                    '序号': i + 1,
                    'Mnemonic': group['mnemonic'],
                    'ETH Address': group['wallets']['ETH']['address'],
                    'SOL Address': group['wallets']['SOL']['address'],
                    'BTC Address': group['wallets']['BTC']['address'],
                    'SUI Address': group['wallets']['SUI']['address']
                })
                
                print(f"\n已生成第{i + 1}/{args.num_groups}组钱包:")
                print(f"ETH地址: {group['wallets']['ETH']['address']}")
                print(f"SOL地址: {group['wallets']['SOL']['address']}")
                print(f"BTC地址: {group['wallets']['BTC']['address']}")
                print(f"SUI地址: {group['wallets']['SUI']['address']}")
    
    except Exception as e:
        print(f"发生错误: {str(e)}")
    finally:
        print(f"\n完成！共生成了 {len(wallet_groups)} 组钱包")
        print(f"所有数据已保存到文件: {csv_file_path}")

if __name__ == "__main__":
    main() 