import { sideshiftCoins } from "./coins";
import axios from "axios";
import { writeFileSync } from "fs";

async function getValidPairsToSettleUSDTBSC() {
  const validPairs = [];

  for (const coin of sideshiftCoins) {
    if (coin.networks.length === 1) {
      validPairs.push({
        from: coin.coin,
        fromNetwork: null,
        to: "usdt",
        toNetwork: "bsc"
      });
    }
    else {
      for (const network of coin.networks) {
        try {

          const response = await axios.get(`https://sideshift.ai/api/v2/pair/${coin.coin}-${network}/usdt-bsc?affiliateId=rKaKpotcg`, {
            headers: {
              'x-sideshift-secret': 'af89a9d0b4ddc447404c5979abcc5c55'
            }
          })

          if (response.status !== 200) {
            console.error(`Error fetching pair for ${coin.coin}:`, response.statusText);
            continue;
          }

          if (response.data) {
            validPairs.push({
              from: coin.coin,
              fromNetwork: network,
              to: "usdt",
              toNetwork: "bsc"
            });
          }
        } catch (error) {
          console.error(`Error fetching pair for ${coin.coin}:`);
        }

      }
    }
  }
  return validPairs;
}


getValidPairsToSettleUSDTBSC().then(validPairs => {
  writeFileSync("valid-pairs-to-usdt-bsc.json", JSON.stringify(validPairs, null, 2));
});