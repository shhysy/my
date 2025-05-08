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
    0xD493D98835F33DEec2e5633762d18D60fFa0FED7
    0xe06912edB0F10C87F38Eb220f9e7e081e95020a2
    0x39CDD7156fBD3044a6D187197a63010Db74B1B97
    0xBCA3e3275d047c1d364851aD217E37E59e64D82c
    0x9373319853DD87d71C67c23051Bd71913Be76420
    0x8a4f3019c59198d5ACBF38BAAc43e1208bb528BE
    0x4611dD1B9fE163978462cb76731459DCd34E9548
    0xD55D0BdeE8086567Ff7ad139244B9214CEB959A3
    0x860E087d0997c6C9fF4bF2A48DbDA1c38CDe9471
    0x29734e1b8034fd6f3bEd3815Fbbe7d56F49776a4
    0xbBdF5C64BF463BE9E043AA0F79139cEAcb282656
    0x5d120834C41d4c8e7AF901A015d9F320cc9C51a4
    0x011d63abb34bA71aAC8d43854Ff9493377FD9BcB
    0xec58293E1003f33db27F2aAbBe67105718A9Cd31
    0x25304AFE2E34CAf664E150e364a0667550379101
    0x4390183a381444c172342885002dE4dA120789a0
    0x582502d16F1268F4f1FDDE1A1d6Ab666Ed1d1189
    0x80DFB890fdD1cb4F3B57a799eF80AAe896083926
    0xEe1d93A63bC4e68c666cbC1520A205e9EF2A32FF
    0x787257A1e22F3c79D0B04D89238f6AF4332E654a
    0xc26cBf5E31f34683a91f8E31255f1251c58fEB94
    0x7C813719e4dB54365d115019FB49f1B3A1C82A89
    0x97E6222Bd9E2A64217E25d28079655cB6DC24E3d
    0x03E8e2E0114621D9EBa379a3f338828b527f3d3F
    0xe451DE29B897B2495f5d7a04D69518fd47B6aBB0
    0xA8023c1d6141A9898eCf9F6FD8966bA4eB32EAe4
    0xf8dd98107e982866EDb1886Aa94E2edFDD39b65A
    0x8F120416847D89F9da510759C0DDdf85e66E93C3
    0x951FdFD5Ca620d7529c41697F158F9d2b23DE959
    0x54D020E046645D59A56a4AE89dcf4F7BbCF7412a
    0x3b9e9e18b42dadDAA50F6F46B77508EA5eef30aa
    0xa582B52944E8069dEc30838d97d04B9281A65De4
    0x9494f83428B0762b142e2Ef137A7e7380E035C52
    0x0295C09d6c0d18bB8090f866eC71595Ce2cCa4De
    0xA4918484c0e3F0655E025edB45ebC2608af1b5aB
    0xeDD92FAF24FaFB149BB716C1D7c8D398611bE2eF
    0xC403269c902C031B7719600528b91bc74A086b0f
    0x8AEDC019d92831e0e864C7e7C8A849f97f0B14CC
    0x823584AEcC4695F5B4416897B9e231b3e7186f3b
    0x17BeaE2C3e0f4683b3399Ff07FBDA6F229200Ff4
    0x7545B3776BD84285F9625d7a97e79B9F25bD379e
    0x21EF656D46Ef7Cf2c7D916E83B31A84567cB0837
    0x2710aB77E9a0b9b995F44A9A3d849F4AE6F158aB
    0x3e8d7df80aCE57aE5A5b587FA3AbADE38af0FEE8
    0x6F5568094203a3B902f0C04296413e6A5767c279
    0x4b832B8904b93D8E168cC65b10a4a87BAD984e89
    0x70637aAaCffF8C48e79671b744eadc1584670537
    0x10356b99579F1133506A6289580A394A1ff9ada8
    0xe21138054C16760fAED2392c83C301af01dEf67D
    0xc9E3Cb9bBe1A9Ca5a1FB01012D16e3EaBEcF4B28
    0x1CD73C554234bcC21C6cda21B3abF7eb20EbDa27
    0xb21834D3F3bA3d7567D806128143F73A7Be1C997
    0x37cc83DD69E02870216bE16d896FA94686C5e53d
    0x6395119F31E4711ADC72729D6eFb8De5FAc8abc7
    0xE81ec81c471426BC01A44f1DC91b8Ae41248634a
    0x0eC137e0f62142138740aB4Fc14A0A8E385b0e6F
    0xC05AfD184A7c5f97794c55c52eA47352d11DBf01
    0x3651268FF665570816aCA30e415a194684F69ca1
    0x42Bc060b046bB3f2238cd5F6D85Fad91bd6024B7
    0x7c8C4F0D2da3E5843bA5055d41f4a60f1B0142f7
    0x1775124D107F8a13F83Cd6ac8aCA538bC15eC16C
    0x6EA295a1B55898B31e7e8761FFC7faDddF3368AC
    0x495A17a1678060A2f9c57200843bDb1048B986B9
    0xd049D09bA33B78969c5c6Cb4FBF9777B82748d01
    0x6164a3777FED9EF41fA3a49b7e6096b08Ac74B39
    0xC5ad2fcBc5f242cF81901E7Dd5367b8Bd2ef9940
    0xa5542Af7Bde17aeC85eB977192acC8a3053DfC54
    0xe24f297aEC6e68F64C616ABB14a2932a6451B343
    0x888f6106aa691f8201B34CAa2266E127454fD351
    0x3cDee72B731c6Cb03EF2c2055E0547dA7bc65293
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