const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
    const storedUser = typeof window !== 'undefined' ? localStorage.getItem('admin_user') : null;
    const user = storedUser ? JSON.parse(storedUser) : null;
    const token = user?.token;

    const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : '',
            'UserId': user?.id ? String(user.id) : '1', // Default to 1 if not present for bypass
            ...options.headers,
        },
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'An error occurred' }));
        throw new Error(error.message || 'An error occurred');
    }

    return response.json();
}
