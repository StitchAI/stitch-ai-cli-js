import { BASE_URL } from '../libs/api';

// 1. Get User 정보
export async function getUser(args: { userId: string }) {
  const { userId } = args;
  const fetched = await fetch(`${BASE_URL}/user?userId=${encodeURIComponent(userId)}`);
  if (!fetched.ok) return `[STITCH AI] Get User Failed`;
  const res = await fetched.json();
  return res;
}

// 2. Get User Dashboard Stat
export async function getUserStat(args: { userId: string }) {
  const { userId } = args;
  const fetched = await fetch(
    `${BASE_URL}/user/dashboard/stat?userId=${encodeURIComponent(userId)}`
  );
  if (!fetched.ok) return `[STITCH AI] Get User Stat Failed`;
  const res = await fetched.json();

  return res;
}

// 3. Get User Dashboard Histories
export async function getUserHistories(args: {
  userId: string;
  paginate?: string;
  sort?: string;
  filters?: string;
}) {
  const { userId, paginate, sort, filters } = args;
  const params = new URLSearchParams({ userId });
  if (paginate) params.append('paginate', paginate);
  if (sort) params.append('sort', sort);
  if (filters) params.append('filters', filters);
  const fetched = await fetch(`${BASE_URL}/user/dashboard/histories?${params.toString()}`);
  if (!fetched.ok) return `[STITCH AI] Get User Histories Failed`;
  const res = await fetched.json();
  return res;
}

// 4. Get User Memory Spaces
export async function getUserMemorySpaces(args: {
  userId: string;
  paginate?: string;
  sort?: string;
  filters?: string;
}) {
  const { userId, paginate, sort, filters } = args;
  const params = new URLSearchParams({ userId });
  if (paginate) params.append('paginate', paginate);
  if (sort) params.append('sort', sort);
  if (filters) params.append('filters', filters);
  const fetched = await fetch(`${BASE_URL}/user/memory-space?${params.toString()}`);
  if (!fetched.ok) return `[STITCH AI] Get User Memory Spaces Failed`;
  const res = await fetched.json();
  return res;
}

// 6. Get User Marketplace Purchases
export async function getUserPurchases(args: {
  userId: string;
  paginate?: string;
  sort?: string;
  filters?: string;
}) {
  const { userId, paginate, sort, filters } = args;
  const params = new URLSearchParams({ userId });
  if (paginate) params.append('paginate', paginate);
  if (sort) params.append('sort', sort);
  if (filters) params.append('filters', filters);
  const fetched = await fetch(`${BASE_URL}/user/marketplace/purchases?${params.toString()}`);
  if (!fetched.ok) throw new Error(`[STITCH CLI] Get User Purchases Failed`);
  const res = await fetched.json();
  return res;
}
