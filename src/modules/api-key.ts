import { BASE_URL } from '../utils/api';

type CreateApiKey = {
  walletAddress: string;
};

export async function createApiKey(args: CreateApiKey) {
  const fetched = await fetch(`${BASE_URL}/user?walletAddress=${args.walletAddress}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!fetched.ok) {
    return `[STITCH AI] Api Key Creation Failed`;
  }
  const res = await fetched.json();

  const apiKey = res.apiKey;

  return formatResult({ apiKey });
}

function formatResult(result: { apiKey: string }): string {
  return `
===========================================

[STITCH AI] Api Key Created
- API Key  : ${result.apiKey}

===========================================
`;
}
