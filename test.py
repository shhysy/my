from eth_account import Account
from web3 import Web3

# 启用助记词功能
Account.enable_unaudited_hdwallet_features()

# 读取包含多个助记词的文件，每个助记词一行
with open(r'C:\\code\\meta\\key.txt', 'r', encoding='utf-8') as file:
    mnemonic_lines = file.readlines()

# 去除每行的空白字符
mnemonics = [line.strip() for line in mnemonic_lines if line.strip()]

# 遍历每个助记词并生成账户私钥
private_keys = []
for mnemonic_phrase in mnemonics:
    try:
        account = Account.from_mnemonic(mnemonic_phrase)
        private_key = account.key.hex()
        #private_keys.append(private_key)
        #print(f"{mnemonic_phrase}")
        #print(f"{private_key}")
        print(f"{account.address}")
    except Exception as e:
        print(f"处理助记词 '{mnemonic_phrase}' 时出错: {e}")

with open('private_keys.txt', 'w') as key_file:
    for private_key in private_keys:
        key_file.write(private_key + '\n')

print("所有私钥已保存到 private_keys.txt")