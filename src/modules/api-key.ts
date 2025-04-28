import { BASE_URL } from '~/libs/api';

export function getApiKey() {
  const apiKey = process.env.STITCH_API_KEY;
  if (!apiKey) throw new Error('[STITCH CLI] STITCH_API_KEY is not set in environment variables');

  return apiKey;
}

export async function getUserIdFromApiKey(args: { apiKey: string }) {
  const apiKey = args.apiKey;

  const fetched = await fetch(`${BASE_URL}/user/api-key/user?apiKey=${apiKey}`);
  if (!fetched.ok) throw new Error(`[STITCH CLI] Get UserId From Api Key Failed`);

  const res = await fetched.json();
  return res.userId;
}
