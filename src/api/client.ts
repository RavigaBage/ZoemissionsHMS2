export interface ApiError {
  status?: number;
  message: string;
}

type ConnectionListener = (isOnline: boolean, isReconnecting: boolean) => void;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class ApiClient {
  private baseUrl: string;
  private listeners: Set<ConnectionListener> = new Set();
  private isOnline: boolean = true;
  private isReconnecting: boolean = false;
  private onUnauthorizedCallback?: () => void;
  private cache = new Map<string, CacheEntry<any>>();
  private cacheTTLMs = 10000; // Default 10 seconds cache for fast response flow

  constructor() {
    this.baseUrl = (import.meta.env.VITE_API_BASE_URL as string) || '';
  }

  public setUnauthorizedHandler(handler: () => void) {
    this.onUnauthorizedCallback = handler;
  }

  public subscribeConnection(listener: ConnectionListener) {
    this.listeners.add(listener);
    listener(this.isOnline, this.isReconnecting);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyConnection(online: boolean, reconnecting: boolean) {
    this.isOnline = online;
    this.isReconnecting = reconnecting;
    this.listeners.forEach((l) => l(this.isOnline, this.isReconnecting));
  }

  private getToken(): string | null {
    return localStorage.getItem('missions_clinic_token');
  }

  public clearCache() {
    this.cache.clear();
  }

  public async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = this.getToken();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    

    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, { ...options, headers });

      if (this.isReconnecting || !this.isOnline) {
        this.notifyConnection(true, false);
      }

      if (!response.ok) {
        let errData: any = {};
        try {
          errData = await response.json();
        } catch {
          // ignore non-json
        }

        if (response.status === 401) {
          if (this.onUnauthorizedCallback) {
            this.onUnauthorizedCallback();
          }
          
          throw {
            status: 401,
            message: errData.detail || 'Your session ended. Please log in again.',
          };
        }

        if (response.status === 404) {
          throw {
            status: 404,
            message: errData.message || 'That record does not exist. It may have been removed.',
          };
        }

        if (response.status === 422) {
          throw {
            status: 422,
            message: errData.message || 'Something required was left blank. Check the highlighted field.',
          };
        }

        if (response.status >= 500) {
          throw {
            status: response.status,
            message: errData.message || 'Something went wrong on our end. Note what you were doing and tell an admin.',
          };
        }

        throw {
          status: response.status,
          message: errData.message || `Request failed with status ${response.status}`,
        };
      }

      // 204 No Content
      if (response.status === 204) {
        return {} as T;
      }

      const data = (await response.json()) as T;

      // Invalidate cache on mutations
      const method = (options.method || 'GET').toUpperCase();
      if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
        this.clearCache();
      }
      return data;
      
    } catch (err: any) {
      if (err.status) {
        throw err;
      }

      // Network error / offline
      this.notifyConnection(false, true);
      throw {
        status: 0,
        message: "Can't reach the clinic system. Checking connection…",
      };
    }
  }

  public async get<T>(endpoint: string, bypassCache: boolean = false): Promise<T> {
    if (!bypassCache) {
      const cached = this.cache.get(endpoint);
      if (cached && Date.now() - cached.timestamp < this.cacheTTLMs) {
        return cached.data as T;
      }
    }

    const data = await this.request<T>(endpoint, { method: 'GET' });
    this.cache.set(endpoint, { data, timestamp: Date.now() });
    return data;
  }

  public post<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  public delete<T>(endpoint: string) {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }

  public patch<T>(endpoint: string, body: any) {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient();
