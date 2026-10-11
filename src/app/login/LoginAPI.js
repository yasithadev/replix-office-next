import ApiClient from '../../api/ApiClient';
import ApiError from '../../api/ApiError';

export async function makeLoginAPICall(email, password) {
  try {
    // auth: false — no JWT exists yet at login time
    return await ApiClient.getInstance().post(
      '/api/v1/auth/signin',
      { email, password }, // adjust field names to match SignInRequestDto exactly
      { auth: false }
    );
  } catch (err) {
    if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
      throw new Error('INVALID_CREDENTIALS');
    }
    throw new Error('NETWORK_ERROR');
  }
}

