import { NextRequest, NextResponse } from 'next/server';

/**
 * API para obtener credenciales seguras para operaciones de la wallet.
 * Esta API funciona como proxy para solicitar datos sensibles a la API de Nyx
 * con un nombre menos obvio para mayor seguridad.
 *
 * @param request La solicitud HTTP
 * @returns Una respuesta con las credenciales o un error
 */
export async function POST(request: NextRequest) {
  // Verificar la autenticación del usuario
  const authHeader = request.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { walletId } = body;
    const walletUrl = process.env.NEXT_PUBLIC_WALLET_URL;

    if (!walletId) {
      return NextResponse.json({ error: 'Missing wallet ID' }, { status: 400 });
    }

    const response = await fetch(`${walletUrl}/api/wallets/${walletId}/private-key`, {
      method: 'GET',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error('Failed to retrieve secure credentials:', errorData);
      return NextResponse.json(
        { error: errorData.message || 'Failed to retrieve secure credentials' },
        { status: response.status },
      );
    }

    const data = await response.json();
    const encodedKey = Buffer.from(data.privateKey).toString('base64');

    return NextResponse.json({
      credentials: encodedKey,
    });
  } catch (error) {
    console.error('Error in secure-credentials API:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
