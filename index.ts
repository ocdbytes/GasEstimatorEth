import Web3 from "web3";
import * as dotenv from "dotenv";
import { formatResult } from "./utils/formatResult";
import { calcAverage } from "./utils/calcAverage";
dotenv.config();

const ETH_RPC: string = process.env.ETH_RPC || "";
const web3 = new Web3(ETH_RPC);

// Historical Blocks : Defines how many older blocks we want to see.
const historicalBlocks = 20;

/*
getFeeHistory : This function is required to get the fee history of the previous blocks
getFeeHistory(arg1, arg2, arg3)

* arg 1 : historical blocks
* arg 2 : type of blocks to retrieve ("pending in our case")
* arg 3 : array of numbers defining the percentile of the priority fee of the blocks we want to fetch

For Eg : 
In our case 1,50,99
represents priority fee in the 1 percentile of transactions, 50 percentile of the transactions and 99 percentile of transactions
*/

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
