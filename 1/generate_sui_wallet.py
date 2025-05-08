import json
import csv
import os
from datetime import datetime
from eth_account.hdaccount import generate_mnemonic
from mnemonic import Mnemonic
import hashlib
import hmac
from nacl.signing import SigningKey
import base64

class SuiWalletGenerator:
    def __init__(self):
        """初始化SUI钱包生成器"""
        self.derivation_path = "m/44'/784'/0'/0'/0'"  # SUI标准路径
        self.mnemo = Mnemonic("english")

    def _derive_ed25519_private_key(self, mnemonic: str) -> bytes:
        """使用Ed25519特定的派生方法"""
        # 生成种子
        seed = self.mnemo.to_seed(mnemonic)
        
        # 生成主私钥
        I = hmac.new(b"ed25519 seed", seed, hashlib.sha512).digest()
        key, chain_code = I[:32], I[32:]

        # 解析路径
        path_indices = [
            int(i[:-1]) | 0x80000000 if i.endswith("'") else int(i)
            for i in self.derivation_path.strip("m/").split("/")
        ]

        # Ed25519特定的派生
        for index in path_indices:
            data = bytes([0]) + key + index.to_bytes(4, 'big')
            I = hmac.new(chain_code, data, hashlib.sha512).digest()
            key = I[:32]
            chain_code = I[32:]

        return key

    def generate_wallet(self, mnemonic: str = None):
        """生成单个SUI钱包"""
        if not mnemonic:
            mnemonic = generate_mnemonic(12, "english")
        
        # 使用Ed25519派生方法获取私钥
        private_key = self._derive_ed25519_private_key(mnemonic)
        
        # 生成密钥对
        signing_key = SigningKey(private_key)
        verify_key = signing_key.verify_key
        public_key = bytes(verify_key)
        
        # 生成地址 - 使用Blake2b哈希
        address = "0x" + hashlib.blake2b(b'\x00' + public_key, digest_size=32).hexdigest()
        
        return {
            'address': address,
            'private_key': private_key.hex(),
            'mnemonic': mnemonic,
            'created_at': datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        }

def generate_sui_wallets(num_wallets=190):
    """生成多个SUI钱包"""
    generator = SuiWalletGenerator()
    wallets = []
    
    for i in range(num_wallets):
        wallet = generator.generate_wallet()
        wallets.append(wallet)
        
        print(f"\n钱包 #{i+1}:")
        print(f"地址: {wallet['address']}")
        print(f"助记词: {wallet['mnemonic']}")
    
    return wallets

def save_to_csv(wallets, filename='sui_wallets.csv'):
    # 获取脚本所在目录
    script_dir = os.path.dirname(os.path.abspath(__file__))
    csv_path = os.path.join(script_dir, filename)
    
    # 保存为CSV，只保存必要的列
    with open(csv_path, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=['address', 'private_key', 'mnemonic', 'created_at'])
        writer.writeheader()
        writer.writerows(wallets)
    
    print(f"\n已生成 {len(wallets)} 个 SUI 钱包")
    print(f"已保存到: {csv_path}")

def main():
    try:
        # 生成钱包
        num_wallets = 150  # 可以修改生成数量
        wallets = generate_sui_wallets(num_wallets)
        
        # 保存为CSV
        save_to_csv(wallets)
    except Exception as e:
        print(f"发生错误: {str(e)}")

if __name__ == "__main__":
    main() 