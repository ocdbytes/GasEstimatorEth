export const formatResult = (result: any, historicalBlocks: number) => {
  // getting blocknumber
  let blockNum = Number(result.oldestBlock);

  const formattedBlocks = [];

  for (let loopInd = 0; loopInd < historicalBlocks; loopInd++) {
    formattedBlocks.push({
      block_number: blockNum,
      baseFeePerGas: Number(result.baseFeePerGas[loopInd]),
      gasUsedRatio: Number(result.gasUsedRatio[loopInd]),
      priorityFeePerGasPercentiles: result.reward[loopInd].map((x: number) =>
        Number(x)
      ),
    });
    blockNum += 1;
  }

  return formattedBlocks;
};

/*
! Understanding formatted block structure :

* block_number : This is the block number 
* baseFeePerGas : It is the base fee of the gas in the particular block
* gasUsedRatio : This represents how full the block is or how much gas limit of the block is used.
* priorityFeePerGasPercentiles : This gives the array of the gas priority fees in the transactions included in the particular block (25,50,75 in our case)

{
    block_number: 8710496,
    baseFeePerGas: 118040832087,
    gasUsedRatio: 0.9201721666666667,
    priorityFeePerGasPercentiles: [ 1500000000, 1500000000, 2500000000 ]
}

But for our purpose we will be changing this percentile to 1,50,99 and check the max number of blocks that getFeeHistory can get us.
*/
