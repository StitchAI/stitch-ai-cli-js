import { BASE_URL } from '~/libs/api';

export async function listBranches(args: { apiKey: string; userId: string; repository: string }) {
  const { apiKey, userId, repository } = args;
  const fetched = await fetch(
    `${BASE_URL}/git/${repository}/branches?apiKey=${apiKey}&userId=${userId}`
  );
  if (!fetched.ok) throw new Error(`[STITCH CLI] List Branches Failed`);
  const res = (await fetched.json()) as string[];

  return res;
}

export async function checkoutBranch(args: {
  apiKey: string;
  userId: string;
  repository: string;
  branch: string;
}) {
  const { apiKey, userId, repository, branch } = args;
  const fetched = await fetch(
    `${BASE_URL}/git/${repository}/checkout?apiKey=${apiKey}&userId=${userId}`,
    {
      method: 'POST',
      body: JSON.stringify({ branch }),
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!fetched.ok) throw new Error(`[STITCH CLI] Branch Checkout Failed`);

  const res = (await fetched.json()) as string;

  return res;
}

export async function deleteBranch(args: {
  apiKey: string;
  userId: string;
  repository: string;
  branch: string;
}) {
  const { apiKey, userId, repository, branch } = args;
  const fetched = await fetch(
    `${BASE_URL}/git/${repository}/branch/${branch}?apiKey=${apiKey}&userId=${userId}`,
    {
      method: 'DELETE',
    }
  );
  if (!fetched.ok) throw new Error(`[STITCH CLI] Branch Deletion Failed`);
  const res = (await fetched.json()) as string;

  return res;
}

export async function getLog(args: {
  apiKey: string;
  userId: string;
  repository: string;
  depth?: number;
}) {
  const { apiKey, userId, repository, depth } = args;
  const url =
    `${BASE_URL}/git/${repository}/log?apiKey=${apiKey}&userId=${userId}` +
    (depth ? `&depth=${depth}` : '');

  const fetched = await fetch(url);
  if (!fetched.ok) throw new Error(`[STITCH CLI] Get Log Failed`);
  const res = await fetched.json();

  return res;
}

export async function diff(args: {
  apiKey: string;
  userId: string;
  repository: string;
  oid1: string;
  oid2: string;
}) {
  const { apiKey, userId, repository, oid1, oid2 } = args;
  const url = `${BASE_URL}/git/${repository}/diff?apiKey=${apiKey}&userId=${userId}&oid1=${oid1}&oid2=${oid2}`;
  const fetched = await fetch(url);
  if (!fetched.ok) throw new Error(`[STITCH CLI] Diff Failed`);
  const res = await fetched.json();

  return res;
}

export async function merge(args: {
  apiKey: string;
  userId: string;
  repository: string;
  ours: string;
  theirs: string;
  message: string;
}) {
  const { apiKey, userId, repository, ours, theirs, message } = args;
  const fetched = await fetch(
    `${BASE_URL}/git/${repository}/merge?apiKey=${apiKey}&userId=${userId}`,
    {
      method: 'POST',
      body: JSON.stringify({ ours, theirs, message }),
      headers: { 'Content-Type': 'application/json' },
    }
  );
  if (!fetched.ok) throw new Error(`[STITCH CLI] Merge Failed`);
  const res = (await fetched.json()) as string;

  return res;
}
