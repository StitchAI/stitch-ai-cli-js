import { BASE_URL } from '../utils/api';

type CreateMemorySpace = {
  name: string;
};

export async function createMemorySpace(args: CreateMemorySpace) {
  const apiKey = process.env.STITCH_API_KEY;

  if (!apiKey) {
    throw new Error('STITCH_API_KEY is not set');
  }

  const fetched = await fetch(`${BASE_URL}/memory/space`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apiKey: apiKey,
    },
    body: JSON.stringify(args),
  });
  if (!fetched.ok) {
    return `[STITCH AI] Memory Space Creation Failed`;
  }
  const res = await fetched.json();

  const id = res.id;
  const name = res.name;

  return formatResult({ id, name });
}

function formatResult(result: { id: string; name: string }): string {
  return `
===========================================

[STITCH AI] Memory Space Created
- ID    : ${result.id}
- Name  : ${result.name}

===========================================
`;
}

export async function listSpaces() {
  const apiKey = process.env.STITCH_API_KEY;

  if (!apiKey) {
    throw new Error('STITCH_API_KEY is not set');
  }

  const fetched = await fetch(`${BASE_URL}/memory/spaces`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      apiKey: apiKey,
    },
  });
  if (!fetched.ok) {
    return `[STITCH AI] Memory Space Listing Failed`;
  }
  const res = await fetched.json();

  return formatSpacesResult(res.data);
}

function formatSpacesResult(result: { id: string; name: string }[]): string {
  return `
===========================================

[STITCH AI] Memory Spaces
${result.map(space => `- ${space.id} : ${space.name}`).join('\n')}

===========================================
`;
}
