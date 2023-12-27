## 1. Download dependencies
```
yarn
```

## 2. Run project
### Contract
```
npx hardhat compile
yarn deploy
```
Go to `.\src\frontend\contractsData\Marketplace.json` and get `address`.
```
npx hardhat verify --network sepolia <address>
```

### Frontend
```
yarn start
```