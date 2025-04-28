import { BASE_URL } from '~/libs/api';

// 메모리 공간 생성
export async function createMemorySpace(args: {
  userId: string;
  apiKey: string;
  repository: string;
}) {
  const { userId, apiKey, repository } = args;
  const fetched = await fetch(`${BASE_URL}/memory-space/create?userId=${userId}&apiKey=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ repository }),
  });
  if (!fetched.ok) throw new Error(`[STITCH CLI] Memory Space Creation Failed`);
  const res = (await fetched.json()) as string;

  return res;
}

// 메모리 공간 정보 조회
export async function getMemorySpace(args: {
  repository: string;
  userId: string;
  apiKey: string;
  ref?: string;
  offset?: number;
  limit?: number;
}) {
  const { repository, userId, apiKey, ref, offset, limit } = args;
  const url =
    `${BASE_URL}/memory-space/${repository}?userId=${userId}&apiKey=${apiKey}` +
    (ref ? `&ref=${ref}` : '') +
    (offset ? `&offset=${offset}` : '') +
    (limit ? `&limit=${limit}` : '');
  const fetched = await fetch(url);
  if (!fetched.ok) throw new Error(`[STITCH CLI] Get Memory Space Failed`);
  const res = await fetched.json();

  return res;
}

// 메모리 공간 삭제
export async function deleteMemorySpace(args: {
  repository: string;
  userId: string;
  apiKey: string;
}) {
  const { repository, userId, apiKey } = args;
  const fetched = await fetch(
    `${BASE_URL}/memory-space/${repository}?userId=${userId}&apiKey=${apiKey}`,
    {
      method: 'DELETE',
    }
  );
  if (!fetched.ok) throw new Error(`[STITCH CLI] Delete Memory Space Failed`);
  const res = (await fetched.json()) as string;

  return res;
}

// 메모리 공간 히스토리 조회
export async function getMemorySpaceHistory(args: {
  repository: string;
  userId: string;
  apiKey: string;
}) {
  const { repository, userId, apiKey } = args;
  const url = `${BASE_URL}/memory-space/${repository}/history?userId=${userId}&apiKey=${apiKey}`;
  const fetched = await fetch(url);
  if (!fetched.ok) throw new Error(`[STITCH CLI] Get Memory Space History Failed`);
  const res = await fetched.json();

  return res;
}
