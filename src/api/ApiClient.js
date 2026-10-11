import Authentication from '../app/login/Authentication';
import ApiError from './ApiError';

class ApiClient{
  static _instance;

  constructor(baseUrl) {
    this.baseUrl = baseUrl ?? process.env.NEXT_PUBLIC_BASE_URL ?? '';
  }

  static getInstance() {
    if (!ApiClient._instance) {
      ApiClient._instance = new ApiClient();
    }
    return ApiClient._instance;
  }

  /**
   * Core request method. All verb helpers below funnel through this,
   * so auth headers, base URL, JSON handling, and error shape stay
   * consistent for every call site.
   *
   * @param {string} path        e.g. '/api/v1/user/create'
   * @param {object} options
   * @param {string} [options.method='GET']
   * @param {any}    [options.body]     plain object; will be JSON.stringify'd
   * @param {object} [options.headers]  extra/override headers
   * @param {boolean}[options.auth=true] attach Authorization header
   * @param {AbortSignal} [options.signal]
   */
  async request(path, options = {}) {
    const { method = 'GET', body, headers = {}, auth = true, signal } = options;

    const finalHeaders = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (auth) {
      const jwt = Authentication.getInstance().getJwt();
      if (jwt) {
        finalHeaders['Authorization'] = `Bearer ${jwt}`;
      }
    }

    let res;
    try {
      res = await fetch(`${this.baseUrl}${path}`, {
        method,
        headers: finalHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });
    } catch (err) {
      // fetch itself threw: network down, CORS, DNS, aborted, etc.
      throw new ApiError('NETWORK_ERROR', 0, null);
    }

    // Some endpoints (e.g. 204 No Content) won't have a JSON body.
    let data = null;
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        // non-JSON response body; leave data as null
      }
    }

    if (!res.ok) {
      const message = data?.message || `Request failed with status ${res.status}`;
      throw new ApiError(message, res.status, data);
    }

    return data;
  }

  get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' });
  }

  post(path, body, options = {}) {
    return this.request(path, { ...options, method: 'POST', body });
  }

  put(path, body, options = {}) {
    return this.request(path, { ...options, method: 'PUT', body });
  }

  patch(path, body, options = {}) {
    return this.request(path, { ...options, method: 'PATCH', body });
  }

  delete(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}

export default ApiClient;