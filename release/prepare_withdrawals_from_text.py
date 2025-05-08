import pandas as pd
import os
import random

def prepare_withdrawal_csv_from_text(addresses_text, coin, min_amount=1.0, max_amount=1.2, network="SUI"):
    try:
        # 获取脚本所在目录
        script_dir = os.path.dirname(os.path.abspath(__file__))
        
        # 使用脚本目录的绝对路径
        csv_path = os.path.join(script_dir, 'withdrawals.csv')
        
        # 检查并删除已存在的CSV文件
        if os.path.exists(csv_path):
            try:
                os.remove(csv_path)
                print(f"已删除现有的 {csv_path} 文件")
            except Exception as e:
                print(f"删除文件时出错: {str(e)}")
                return
        
        # 分割文本为地址列表
        addresses = [addr.strip() for addr in addresses_text.split('\n') if addr.strip()]
        
        # 准备提现数据
        withdrawal_data = []
        total_amount = 0
        
        # 处理每个地址
        for address in addresses:
            # 生成1-1.2之间的随机金额，保留2位小数
            amount = round(random.uniform(min_amount, max_amount), 5)
            total_amount += amount
            
            withdrawal_data.append({
                'coin': coin,
                'address': address,
                'amount': amount,
                'network': network
            })
        
        if not withdrawal_data:
            raise ValueError("没有找到有效的地址")
        
        # 创建DataFrame并保存为CSV
        df = pd.DataFrame(withdrawal_data)
        df.to_csv(csv_path, index=False)
        print(f"成功创建 {csv_path}，共{len(withdrawal_data)}个地址")
        
        # 显示前5个地址作为预览
        print("\n前5个地址预览:")
        for i, data in enumerate(withdrawal_data[:5]):
            print(f"{i+1}. {data['address']} - {data['amount']:.2f} {data['coin']} ({data['network']})")
            
        # 显示总金额，保留2位小数
        print(f"\n总转账金额: {total_amount:.2f} {coin}")
            
    except Exception as e:
        print(f"发生错误: {str(e)}")

if __name__ == "__main__":
    # 示例地址文本
    addresses_text = """
    0xe06912edB0F10C87F38Eb220f9e7e081e95020a2
    0x39CDD7156fBD3044a6D187197a63010Db74B1B97
    0x9373319853DD87d71C67c23051Bd71913Be76420
    0x8a4f3019c59198d5ACBF38BAAc43e1208bb528BE
    0x4611dD1B9fE163978462cb76731459DCd34E9548
    0x5d120834C41d4c8e7AF901A015d9F320cc9C51a4
    0x011d63abb34bA71aAC8d43854Ff9493377FD9BcB
    0x582502d16F1268F4f1FDDE1A1d6Ab666Ed1d1189
    0x80DFB890fdD1cb4F3B57a799eF80AAe896083926
    0xEe1d93A63bC4e68c666cbC1520A205e9EF2A32FF
    0xc26cBf5E31f34683a91f8E31255f1251c58fEB94
    0x7C813719e4dB54365d115019FB49f1B3A1C82A89
    0xA8023c1d6141A9898eCf9F6FD8966bA4eB32EAe4
    0x951FdFD5Ca620d7529c41697F158F9d2b23DE959
    0x54D020E046645D59A56a4AE89dcf4F7BbCF7412a
    0x3b9e9e18b42dadDAA50F6F46B77508EA5eef30aa
    0x8AEDC019d92831e0e864C7e7C8A849f97f0B14CC
    0x21EF656D46Ef7Cf2c7D916E83B31A84567cB0837
    0x3e8d7df80aCE57aE5A5b587FA3AbADE38af0FEE8
    0xc9E3Cb9bBe1A9Ca5a1FB01012D16e3EaBEcF4B28
    0x1CD73C554234bcC21C6cda21B3abF7eb20EbDa27
    0x37cc83DD69E02870216bE16d896FA94686C5e53d
    0x3651268FF665570816aCA30e415a194684F69ca1
    0x1775124D107F8a13F83Cd6ac8aCA538bC15eC16C
    0x6EA295a1B55898B31e7e8761FFC7faDddF3368AC
    0xd049D09bA33B78969c5c6Cb4FBF9777B82748d01
    0xC5ad2fcBc5f242cF81901E7Dd5367b8Bd2ef9940
    0xe24f297aEC6e68F64C616ABB14a2932a6451B343
    0x888f6106aa691f8201B34CAa2266E127454fD351
    0x51bC32DF8EF3248eE27cF5B4C2559eFE398011dE
"""
    
    # 使用示例 - 指定随机金额范围
    coin = "ETH"  # 币种代码
    network = "Optimism"  # 网络名称
    min_amount = 0.008  # 最小金额
    max_amount = 0.01  # 最大金额
    
    prepare_withdrawal_csv_from_text(
        addresses_text, 
        coin, 
        min_amount=min_amount,
        max_amount=max_amount,
        network=network
    ) 