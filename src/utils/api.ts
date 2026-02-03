

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const storedUser = typeof globalThis.window !== 'undefined' ? localStorage.getItem('admin_user') : null;
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token;

    const url = `${API_URL}${endpoint}`;

    const isFormData = options.body instanceof FormData;

    const headers: Record<string, string> = {
        'Authorization': token ? `Bearer ${token}` : '',
        'UserId': user?.id ? String(user.id) : '1',
    };

    if (!isFormData) {
        headers['Content-Type'] = 'application/json';
    }

    const requestConfig = {
        ...options,
        credentials: 'include' as RequestCredentials,
        headers: {
            ...headers,
            ...options.headers,
        },
    };

    console.log('🌐 API Request:', {
        method: options.method || 'GET',
        url,
        headers: requestConfig.headers,
        body: isFormData ? '[FormData]' : (options.body ? JSON.parse(options.body as string) : null)
    });

    const response = await fetch(url, requestConfig);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'An error occurred' }));

        console.error('❌ API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            url,
            method: options.method || 'GET',
            errorData,
            sentPayload: isFormData ? '[FormData]' : (options.body ? JSON.parse(options.body as string) : null)
        });

        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('✅ API Success Response:', { url, data });

    return data;
}
