# 批量转账工具

这是一个用于批量转账的工具，支持币安交易所。

## 文件说明

- `batch_withdraw`: 主程序，用于执行批量转账
- `prepare_withdrawals`: 用于准备转账地址列表
- `withdrawals.csv`: 转账地址配置文件

## 使用方法

1. 准备转账地址：
```bash
./prepare_withdrawals
```

2. 执行批量转账：
```bash
./batch_withdraw
```
123sslY.
Web361535566!
## 注意事项

1. 使用前请确保已正确配置 API 密钥
2. 请确保 `withdrawals.csv` 文件格式正确
3. 建议先小额测试后再进行大额转账
4. 转账过程中请勿关闭程序

## 配置文件格式

`withdrawals.csv` 文件格式：
```csv
coin,address,amount,network
SOL,地址1,数量1,SOL
SOL,地址2,数量2,SOL
```

## 日志

- 程序运行日志保存在 `withdrawal.log`
- 转账结果保存在 `withdrawal_results.csv` 