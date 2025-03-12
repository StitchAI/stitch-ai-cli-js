#!/usr/bin/env node
import { Command } from 'commander';

import { createApiKey } from './modules/api-key';
import { listMemories, pullMemory, pushMemory } from './modules/memory';
import { createMemorySpace, listSpaces } from './modules/memory-space';
const program = new Command();

program.version('1.0.0').description('Stitch CLI');

// create-space
program
  .command('key <walletAddress>')
  .description('Create api key for the given wallet address')
  .action(async (walletAddress: string) => {
    const result = await createApiKey({ walletAddress });
    console.log(result);
  });

// create-space
program
  .command('create-space <spaceName>')
  .description('Create a new space with the given name')
  .action(async (spaceName: string) => {
    const result = await createMemorySpace({ name: spaceName });
    console.log(result);
  });

// push
program
  .command('push <space> <message>')
  .description('Push to a specific memory with a message')
  .action(async (space: string, message: string) => {
    const result = await pushMemory({ space, message });
    console.log(result);
  });

// pull
program
  .command('pull <space> <id>')
  .description('Pull from a specific memory')
  .action(async (space: string, id: string) => {
    const result = await pullMemory({ space, id });
    console.log(result);
  });

// list spaces
program
  .command('list')
  .description('List all spaces or memories in a space')
  .option('-s, --space <space>', 'Space name')
  .action(async (options: { space?: string }) => {
    if (options.space) {
      const result = await listMemories({ space: options.space });
      console.log(result);
    } else {
      const result = await listSpaces();
      console.log(result);
    }
  });

program.parse(process.argv);
