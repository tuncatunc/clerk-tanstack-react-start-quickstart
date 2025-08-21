import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, json } from '@tanstack/react-start';
import { clerkClient, getAuth } from '@clerk/tanstack-react-start/server';
import { getWebRequest } from '@tanstack/react-start/server';
import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts';
import { ethAddress } from 'viem';
import { encryptPrivateKey } from '~/utils/utils';
import { useServerFn } from '@tanstack/react-start';
import { useCallback, useEffect, useState } from 'react';
import { depositMethodIds, getDepositMethodId } from '~/utils/shift-to-usdt-bsc-pairs';

export const Route = createFileRoute('/_auth/wallet')({
  component: RouteComponent,
})


function RouteComponent() {

  const [result, setResult] = useState<{ ethAddress?: string; error?: string } | null>(null);
  const [selectedDepositMethod, setSelectedDepositMethod] = useState<string>(depositMethodIds[0]);

  // Create a server function caller
  const fetchEthereumAddress = useServerFn(getEthereumAddress);

  // Function to call the server function
  const handleFetchAddress = async () => {
    try {
      const { ethAddress, error } = await fetchEthereumAddress({});
      if (error) {
        return;
      }
      setResult(ethAddress);
    } catch (error) {
      setResult({ error: 'Failed to fetch address' });
    }
  };

  const handleShowPlugin = useCallback(() => {
    const sideshiftWidgetFrameId = 'sideshift-widget-frame'
    /**
     * Sideshift plugin library
     */
    const sideshift = window.sideshift;

    const sideshiftWidgetFrame = document.getElementById(sideshiftWidgetFrameId)
    if (sideshiftWidgetFrame) {
      sideshiftWidgetFrame.remove();
    }

    const defaultDepositMethodId = selectedDepositMethod

    window.__SIDESHIFT__ = {
      parentAffiliateId: "rKaKpotcg",
      defaultDepositMethodId,
      defaultSettleMethodId: "usdtbsc",
      settleAddress: "0x22a242833F7Af1E8120C47DB200563dcDB7200e7",
      type: "fixed",
      settleAmount: "200",
      theme: "dark",
      localWidgetTesting: true
    }

    const frame = document.createElement('iframe');
    frame.id = sideshiftWidgetFrameId;
    frame.src = 'https://sideshift.ai/widget';
    frame.title = sideshiftWidgetFrameId;
    frame.allowtransparency = true;
    frame.allow = 'camera; clipboard-read; clipboard-write';
    frame.style.display = 'none';
    frame.style.position = 'fixed';
    frame.style.top = 0;
    frame.style.left = 0;
    frame.style.height = '100vh';
    frame.style.width = '100vw';
    frame.style.border = 'none';
    frame.style.zIndex = 99999;
    document.body.appendChild(frame);

    /**
     * Show plugin
     */
    sideshift.show();

  }, [selectedDepositMethod])

  useEffect(() => {
    /**
     * Sideshift plugin library
     */
    const sideshift = window.sideshift;

    /**
     * Listen for settled event
     * (happens when a shift has been settled with at least one deposit)
     */
    sideshift.addEventListener('settled', (deposits) => {
      console.log(deposits);
      // deposits = [{
      //   "depositId": "de6279c2101e211cebbc",
      //   "createdAt": "1555820836956",
      //   "createdAt": "1555820836970",
      //   "depositAmount": "0.0000346",
      //   "settleRate": "17.5324",
      //   "settleAmount": "0.0006066072",
      //   "networkFeePaidUsd": "3.14",
      //   "status": "received" || "settling" || "settled" || "settle_fail" || "rejected" || "refund" || "refunding" || "refunded" || "refund_fail",
      //   "settleTxid": "dvmeagwdkuy34grkuy32dgby3k4ugdb2ykgyu23yu3k2",
      //   "refundAddress": null || "fjdhvbehv543ev4h35bg4u5i34jhcbru3hjfhbj34",
      //   "refundTxid": null || "dfjbd1hjb42hjb5uhj3bh4j2r3b2hjbrt43hj23bruhj3b",
      //   "reason": null || "admin" || "refund" || "insufficient funds"
      //   "order": order (see 'order' event)
      // }]
    });

    /**
     * Listen for deposit event
     * (happens when a deposit is made)
     */
    sideshift.addEventListener('deposit', (deposits) => {
      console.log(deposits);
      // deposits = [{
      //   "depositId": "de6279c2101e211cebbc",
      //   "createdAt": "1555820836956",
      //   "createdAt": "1555820836970",
      //   "depositAmount": "0.0000346",
      //   "settleRate": "17.5324",
      //   "settleAmount": "0.0006066072",
      //   "networkFeeAmount": null,
      //   "status": "received" || "settling" || "settled" || "settle_fail" || "rejected" || "refund" || "refunding" || "refunded" || "refund_fail",
      //   "settleTxid": "dvmeagwdkuy34grkuy32dgby3k4ugdb2ykgyu23yu3k2",
      //   "refundAddress": null || "fjdhvbehv543ev4h35bg4u5i34jhcbru3hjfhbj34",
      //   "refundTxid": null || "dfjbd1hjb42hjb5uhj3bh4j2r3b2hjbrt43hj23bruhj3b",
      //   "reason": null || "admin" || "refund" || "insufficient funds"
      //   "order": order (see 'order' event)
      // }]
    })

    /**
     * Listen for order event
     * (happens when order is supplied to user)
     */
    sideshift.addEventListener('order', (order) => {
      console.log(order);
      // order = {
      //     "orderId": "de6279c2101e211cebbc",
      //     "createdAt": "1555820836956",
      //     "depositMethodId": "btc",
      //     "settleMethodId": "bch",
      //     "depositAddress": {
      //       "address": "3Nh4fgyUpdcihZt5f9Ei1QJpREvRDh2TqZ"
      //     },
      //     "depositMax": "1.867",
      //     "depositMin": "0.0001867"
      //   }
      // }
    })

  }, [])
  return (
    <div>

      <button
        onClick={() => { createEthWalletAndUpdateClerkMetadata() }}
      >
        Click to create an Ethereum wallet
      </button>
      <div>
        <button onClick={handleFetchAddress}>Fetch Ethereum Address</button>
        {result?.ethAddress && <p>Address: {result.ethAddress}</p>}
        {result?.error && <p>Error: {result.error}</p>}
      </div>
      <div>
        <button onClick={handleShowPlugin}>Show Sideshift Plugin</button>
      </div>
      <div>
        <select value={selectedDepositMethod} onChange={(e) => {
          console.log(`Selected deposit method: ${e.target.value}`)
          setSelectedDepositMethod(e.target.value);
        }}>
          {/* {pairs.map((pair, index) => (
            <option key={index} value={index}>
              {pair.from} {pair.fromNetwork ? `(${pair.fromNetwork})` : ''}
            </option>
          ))} */}
          {Object.keys(depositMethodIds).map((key, index) => (
            <option key={key} value={depositMethodIds[key]}
            >
              {key}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}


const getEthereumAddress = createServerFn({
  type: 'dynamic',
  method: 'GET'
}).handler(async ({ data }) => {
  const request = getWebRequest();
  const { userId } = await getAuth(request!);
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const user = await clerkClient().users.getUser(userId);
  const metadata = user.publicMetadata;
  if (!metadata.ethAddress) {
    return { error: 'Wallet not found' };
  }

  return { ethAddress: metadata.ethAddress };
});

const createEthWalletAndUpdateClerkMetadata = createServerFn({
  type: 'dynamic',
  method: 'POST'
}).handler(async ({ data }) => {
  const request = getWebRequest();
  const { userId } = await getAuth(request!);
  if (!userId) {
    return { error: 'Unauthorized' };
  }

  // Create the wallet
  const privateKey = generatePrivateKey();
  const ethAddress = privateKeyToAddress(privateKey);
  try {
    const user = await clerkClient().users.getUser(userId);
    const metadata = user.publicMetadata;
    if (metadata.ethAddress) {
      return { error: 'Wallet already exists' };
    }

    await clerkClient().users.updateUserMetadata(userId, {
      publicMetadata: {
        ethAddress: ethAddress.toString()
      },
      privateMetadata: {
        encryptedPrivateKey: encryptPrivateKey(privateKey)
      }
    });
    return { success: true, ethAddress };
  } catch (error) {
    return { error: 'Failed to create wallet', message: error.message };
  }
})