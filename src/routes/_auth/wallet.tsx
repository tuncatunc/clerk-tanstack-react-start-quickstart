import { createFileRoute } from '@tanstack/react-router'
import { createServerFn, json } from '@tanstack/react-start';
import { clerkClient, getAuth } from '@clerk/tanstack-react-start/server';
import { getWebRequest } from '@tanstack/react-start/server';
import { generatePrivateKey, privateKeyToAddress } from 'viem/accounts';
import { ethAddress } from 'viem';
import { encryptPrivateKey } from '~/utils/utils';

export const Route = createFileRoute('/_auth/wallet')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <button
      onClick={() => { createEthWalletAndUpdateClerkMetadata() }}
    >
      Click to create an Ethereum wallet
    </button>
  )
}

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
        ethAddress
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