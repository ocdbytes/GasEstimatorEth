# Gas Fee Estimator (ETH)

We will be using getFeeHistory to get the data of the previous blocks and then we will use that data to get the estimated gas fee for a transaction to be included.

We will use this logic to get the estimated gas fees

```text
Top 1 %ile of the transactions to get slow gas fee
Top 50 %ile of the transactions to get average gas fee
Top 99 %ile of the transactions to get fast gas fee
```

Demo Code :

```ts
web3.eth
  .getFeeHistory(4, "pending", [25, 50, 75])
  .then((result) => {
    console.log(result);
});

// gives 4 blocks and their transaction data
```

O/P :

```sh
{
  baseFeePerGas: [
    '0x1ca4585f75',
    '0x20088ba00f',
    '0x1f69bc3768',
    '0x1dcf8fe9b1',
    '0x1c0df207ce'
  ],
  gasUsedRatio: [
    0.9736275666666667,
    0.4225367666666667,
    0.29597783333333333,
    0.2643383
  ],
  oldestBlock: '0x84e95a',
  reward: [
    [ '0x362845373', '0x3eefd5de7', '0x4729167a3' ],
    [ '0x59682f00', '0x59682f00', '0x9502f900' ],
    [ '0x59682f00', '0x59682f00', '0xdf736f7f' ],
    [ '0x40a406d8', '0x59682f00', '0x59682f00' ]
  ]
}
```

I wrote a formatter to format the above data into more readable form so the above data is represented as :

```sh
[
  {
    block_number: 8710493,
    baseFeePerGas: 128036366769,
    gasUsedRatio: 0.3185674666666667,
    priorityFeePerGasPercentiles: [ 1084491480, 1500000000, 1500000000 ]
  },
  {
    block_number: 8710494,
    baseFeePerGas: 122228876174,
    gasUsedRatio: 0.46493013333333333,
    priorityFeePerGasPercentiles: [ 1331000000, 1500000000, 1500000000 ]
  },
  {
    block_number: 8710495,
    baseFeePerGas: 121157238577,
    gasUsedRatio: 0.397112,
    priorityFeePerGasPercentiles: [ 1500000000, 1500000000, 5000000000 ]
  },
  {
    block_number: 8710496,
    baseFeePerGas: 118040832087,
    gasUsedRatio: 0.9201721666666667,
    priorityFeePerGasPercentiles: [ 1500000000, 1500000000, 2500000000 ]
  }
]
```

Now after writing the logic our final output is :

```ts
web3.eth
  .getFeeHistory(historicalBlocks, "pending", [1, 50, 99])
  .then((result) => {
    const res = formatResult(result, historicalBlocks);

    const slow = calcAverage(
      res.map((block) => block.priorityFeePerGasPercentiles[0])
    );
    const average = calcAverage(
      res.map((block) => block.priorityFeePerGasPercentiles[1])
    );
    const fast = calcAverage(
      res.map((block) => block.priorityFeePerGasPercentiles[2])
    );

    // Getting the latest block
    web3.eth.getBlock("pending").then((block) => {
      const baseFeeOfLatestBlock = Number(block.baseFeePerGas);
      console.log(`Gas Estimation (Block Number : ${Number(block.number)}) :
slow 🐌 : ${slow + baseFeeOfLatestBlock}
average 🚩 : ${average + baseFeeOfLatestBlock}
fast ⚡ : ${fast + baseFeeOfLatestBlock}`);
    });
  });
```

```sh
Gas Estimation (Block Number : 8710534) :
slow 🐌 : 160758582325
average 🚩 : 161582842530
fast ⚡ : 455478648655
```
