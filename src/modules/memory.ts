import { BASE_URL } from '~/libs/api';

type CommitMemoryFile = {
  filePath: string;
  content: string;
};

type CommitMemoryArgs = {
  repository: string;
  userId: string;
  apiKey: string;
  files: CommitMemoryFile[];
  message: string;
};

export async function commitMemory(args: CommitMemoryArgs) {
  const { repository, userId, apiKey, files, message } = args;

  const fetched = await fetch(
    `${BASE_URL}/memory/${repository}/create?userId=${userId}&apiKey=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ files, message }),
    }
  );

  if (!fetched.ok) throw new Error(`[STITCH CLI] Memory Commit Failed`);
  const res = (await fetched.json()) as string;

  return res;
}
