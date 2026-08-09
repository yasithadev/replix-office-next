export async function makeLoginAPICall(email, password) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/test/signin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }), // adjust field names to match SignInRequestDto exactly
  });

  if (response.status === 401 || response.status === 403) {
    throw new Error('INVALID_CREDENTIALS');
  }

  if (!response.ok) {
    throw new Error('NETWORK_ERROR');
  }

  return response.json(); // expected shape: { token, permissions } — adjust to match your actual response
}
