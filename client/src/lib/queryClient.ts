import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.carmarketvaluator.com';
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url}`;
  
  console.log(`Making API request to: ${fullUrl}`);
  console.log('Request data:', data);

  try {
    const res = await fetch(fullUrl, {
      method,
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json",
        "X-API-Key": process.env.NEXT_PUBLIC_API_KEY || '',
        "X-Requested-With": "XMLHttpRequest"
      },
      body: data ? JSON.stringify(data) : undefined,
      credentials: "include",
    });

    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('API error response:', {
        status: res.status,
        statusText: res.statusText,
        error: errorText
      });
      throw new Error(`API request failed: ${res.status} ${res.statusText} - ${errorText}`);
    }

    return res;
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

// Add rate limiting and retry logic
export async function retryableApiRequest(
  method: string,
  url: string,
  data?: unknown,
  maxRetries = 3,
  delay = 1000
): Promise<Response> {
  let lastError;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiRequest(method, url, data);
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, i)));
      }
    }
  }
  
  throw lastError;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey[0] as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});
