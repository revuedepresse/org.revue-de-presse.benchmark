export function parseCallbackParams(input: string): URLSearchParams {
  const trimmed = input.trim();
  if (trimmed === '') {
    throw new Error('Callback input is empty');
  }

  let params: URLSearchParams;
  try {
    params = new URL(trimmed).searchParams;
  } catch {
    const qs = trimmed.startsWith('?') ? trimmed.slice(1) : trimmed;
    params = new URLSearchParams(qs);
  }

  if (!params.get('code')) {
    throw new Error('Callback URL is missing `code`');
  }
  if (!params.get('state')) {
    throw new Error('Callback URL is missing `state`');
  }
  return params;
}
