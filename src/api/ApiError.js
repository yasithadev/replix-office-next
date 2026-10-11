/**
 * Normalized error thrown for any non-OK response.
 * `status` and `data` let callers branch on specific cases
 * (e.g. 401 -> redirect to login, `data.errors` -> field errors)
 * without re-parsing the response themselves.
 */

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
  }
}

export default ApiError;