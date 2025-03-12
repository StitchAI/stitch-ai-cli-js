import { BASE_URL } from '../utils/api';
import { processCharacterFile, processMemoryFile, processSqliteFile } from '../utils/sqlite';

type PushMemory = {
  space: string;
  message: string;
  episodicPath?: string;
  characterPath?: string;
};

export async function pushMemory(args: PushMemory) {
  const apiKey = process.env.STITCH_API_KEY;

  if (!apiKey) {
    throw new Error('STITCH_API_KEY is not set');
  }

  if (!args.episodicPath && !args.characterPath) {
    throw new Error('episodic and character memory file path must be provided');
  }

  let episodicData: string = '';
  let characterData: string = '';

  if (args.episodicPath) {
    if (args.episodicPath.endsWith('.sqlite')) {
      episodicData = await processSqliteFile(args.episodicPath);
    } else {
      episodicData = await processMemoryFile(args.episodicPath);
    }
  }

  if (args.characterPath) {
    if (args.characterPath.endsWith('.json')) {
      characterData = await processCharacterFile(args.characterPath);
    } else {
      characterData = '';
    }
  }

  const fetched = await fetch(`${BASE_URL}/memory/${args.space}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apiKey: apiKey,
    },
    body: JSON.stringify({
      message: args.message,
      episodicMemory: episodicData,
      characterMemory: characterData,
    }),
  });
  if (!fetched.ok) {
    return `[STITCH AI] Memory Push Failed`;
  }
  const res = await fetched.json();

  const id = res.id;
  const space = res.space;
  const message = res.message;

  return formatPushResult({ id, space, message });
}

function formatPushResult(result: { id: string; space: string; message: string }): string {
  return `
===========================================

[STITCH AI] Memory Push Success
- ID    : ${result.id}
- Space : ${result.space}
- Message : ${result.message}

===========================================
`;
}

type PullMemory = {
  space: string;
  id: string;
};

export async function pullMemory(args: PullMemory) {
  const apiKey = process.env.STITCH_API_KEY;

  if (!apiKey) {
    throw new Error('STITCH_API_KEY is not set');
  }

  const fetched = await fetch(`${BASE_URL}/memory/${args.space}/${args.id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      apiKey: apiKey,
    },
  });
  if (!fetched.ok) {
    return `[STITCH AI] Memory Pull Failed`;
  }
  const res = await fetched.json();

  return formatPullResult({
    id: res.id,
    space: args.space,
    message: res.message,
    createdAt: res.createdAt,
    updatedAt: res.updatedAt,
  });
}

function formatPullResult(result: {
  id: string;
  space: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}): string {
  return `
===========================================

[STITCH AI] Memory Pull Success
- ID    : ${result.id}
- Space : ${result.space}
- Message : ${result.message}

- Created At : ${result.createdAt}
- Updated At : ${result.updatedAt}

===========================================
`;
}

type ListMemories = {
  space: string;
};

export async function listMemories(args: ListMemories) {
  const apiKey = process.env.STITCH_API_KEY;

  if (!apiKey) {
    throw new Error('STITCH_API_KEY is not set');
  }

  const fetched = await fetch(`${BASE_URL}/memory/${args.space}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      apiKey: apiKey,
    },
  });
  if (!fetched.ok) {
    return `[STITCH AI] Memory Listing Failed`;
  }
  const res = await fetched.json();

  return formatMemoriesResult(res.name, res.histories);
}

function formatMemoriesResult(space: string, result: { id: string; message: string }[]): string {
  return `
===========================================

[STITCH AI] Memories in ${space}
${result.map(memory => `- ${memory.id} : ${memory.message}`).join('\n')}

===========================================   
`;
}
