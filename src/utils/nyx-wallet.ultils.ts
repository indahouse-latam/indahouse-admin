import { fetchWalletCredentials } from "@/utils/auth-session";

export const getPrivateKey = async (
  walletId: string,
  token: string,
): Promise<string> => {
  try {
    const response = await fetch(`/api/wallet-proxy/transaction-solver`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ walletId }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch secure credentials");
    }

    const data = await response.json();
    const decodedKey = atob(data.credentials);

    return decodedKey;
  } catch (error) {
    console.error("Error fetching secure credentials:", error);
    throw error;
  }
};

export async function getPrivateKeyFromSession(): Promise<string> {
  const { walletId, token } = await fetchWalletCredentials();
  const privateKey = await getPrivateKey(walletId, token);
  return privateKey;
}

/** @deprecated Usar getPrivateKeyFromSession */
export const getPrivateKeyFromLocalStorage = getPrivateKeyFromSession;
