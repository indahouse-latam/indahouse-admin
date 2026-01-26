import { LocalStorageUser } from "@/providers/AuthProvider";

export const getPrivateKey = async (walletId: string, token: string): Promise<string> => {
  try {
    const response = await fetch(`/api/wallet-proxy/transaction-solver`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletId }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch secure credentials');
    }

    const data = await response.json();
    const decodedKey = atob(data.credentials);

    return decodedKey;
  } catch (error) {
    console.error('Error fetching secure credentials:', error);
    throw error;
  }
};

export const getPrivateKeyFromLocalStorage = async (): Promise<string> => {
  const localstorageUser = localStorage.getItem('admin_user');
  const user: LocalStorageUser = JSON.parse(localstorageUser || '{}');
  const token = user.token;
  const privateKey = await getPrivateKey(user?.walletId, token);
  console.log('privateKey', privateKey);
  return privateKey;
}


