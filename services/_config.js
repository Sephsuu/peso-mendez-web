export const BASE_URL = 'http://localhost:3005';

export async function requestData(url, method, headers, body) {
    console.log('Endpoint:', url);
    console.log('Method:', method);
    console.log('Headers:', headers);
    console.log('Body:', body);

    let finalHeaders = headers || {};

    if (!(body instanceof FormData)) {
        finalHeaders = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            ...finalHeaders,
        };
    }

    const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: body instanceof FormData ? body : body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || err.message || "Request failed");
    }

    const response = await res.json();
    console.log('Response Body:', response);

    return response;
}
