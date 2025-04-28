#!/usr/bin/env node
import { Command } from 'commander';

import * as ApiKey from './modules/api-key';
import * as Git from './modules/git';
import * as Memory from './modules/memory';
import * as MemorySpace from './modules/memory-space';
import * as User from './modules/user';

const program = new Command();
program.version('1.0.0').description('Stitch CLI');

// API KEY
program
  .command('user-info-from-api-key')
  .description('Get user info from apiKey (from env)')
  .action(async () => {
    const apiKey = ApiKey.getApiKey();
    const result = await ApiKey.getUserIdFromApiKey({ apiKey });

    console.log(`[STITCH CLI] User ID: ${result}`);
  });

program
  .command('git-branches')
  .requiredOption('--repository <repository>', 'Repository name')
  .description('List branches in a repository')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });

    const result = await Git.listBranches({
      apiKey,
      userId,
      repository: options.repository,
    });
    console.log(`[STITCH CLI] Branches:\n` + `  - ${result.join('\n  - ')}`);
  });

program
  .command('git-checkout')
  .requiredOption('--repository <repository>', 'Repository name')
  .requiredOption('--branch <branch>', 'Branch name')
  .description('Checkout a branch (create a new branch if not exists)')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });

    const result = await Git.checkoutBranch({
      apiKey,
      userId,
      repository: options.repository,
      branch: options.branch,
    });
    console.log(`[STITCH CLI] Checkout to branch: ${result}`);
  });

program
  .command('git-delete-branch')
  .requiredOption('--repository <repository>', 'Repository name')
  .requiredOption('--branch <branch>', 'Branch name')
  .description('Delete a branch')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });

    const result = await Git.deleteBranch({
      apiKey,
      userId,
      repository: options.repository,
      branch: options.branch,
    });
    console.log(`[STITCH CLI] Branch deleted: ${result}`);
  });

program
  .command('git-log')
  .requiredOption('--repository <repository>', 'Repository name')
  .option('--depth <depth>', 'Log depth', parseInt)
  .description('Get git log')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });

    const result = await Git.getLog({
      apiKey,
      userId,
      repository: options.repository,
      depth: options.depth,
    });
    console.log(result);
  });

program
  .command('git-diff')
  .requiredOption('--repository <repository>', 'Repository name')
  .requiredOption('--oid1 <oid1>', 'OID 1')
  .requiredOption('--oid2 <oid2>', 'OID 2')
  .description('Get diff between two oids')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });
    const result = await Git.diff({
      apiKey,
      userId,
      repository: options.repository,
      oid1: options.oid1,
      oid2: options.oid2,
    });
    console.log(result);
  });

program
  .command('git-merge')
  .requiredOption('--repository <repository>', 'Repository name')
  .requiredOption('--ours <ours>', 'Ours branch')
  .requiredOption('--theirs <theirs>', 'Theirs branch')
  .requiredOption('--message <message>', 'Merge message')
  .description('Merge branches')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });
    const result = await Git.merge({
      apiKey,
      userId,
      repository: options.repository,
      ours: options.ours,
      theirs: options.theirs,
      message: options.message,
    });
    console.log(result);
  });

// MEMORY
program
  .command('memory-commit')
  .requiredOption('--repository <repository>', 'Repository name')
  .requiredOption(
    '--files <files>',
    'Files JSON string, e.g. \'[{"filePath":"a.txt","content":"abc"}]\''
  )
  .requiredOption('--message <message>', 'Commit message')
  .description('Commit memory files')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });

    const files = JSON.parse(options.files);

    const result = await Memory.commitMemory({
      repository: options.repository,
      userId,
      apiKey,
      files,
      message: options.message,
    });
    console.log(result);
  });

// MEMORY SPACE
program
  .command('create-space')
  .requiredOption('--repository <repository>', 'Repository name')
  .description('Create a new memory space')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });
    const result = await MemorySpace.createMemorySpace({
      userId,
      apiKey,
      repository: options.repository,
    });
    console.log(result);
  });

program
  .command('get-space')
  .requiredOption('--repository <repository>', 'Repository name')
  .option('--ref <ref>', 'Branch ref')
  .option('--offset <offset>', 'Offset')
  .option('--limit <limit>', 'Limit')
  .description('Get memory space info')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });
    const result = await MemorySpace.getMemorySpace({
      repository: options.repository,
      userId,
      apiKey,
      ref: options.ref,
      offset: options.offset,
      limit: options.limit,
    });
    console.log(result);
  });

program
  .command('delete-space')
  .requiredOption('--repository <repository>', 'Repository name')
  .description('Delete a memory space')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });
    const result = await MemorySpace.deleteMemorySpace({
      repository: options.repository,
      userId,
      apiKey,
    });
    console.log(result);
  });

program
  .command('space-history')
  .requiredOption('--repository <repository>', 'Repository name')
  .description('Get memory space history')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = await ApiKey.getUserIdFromApiKey({ apiKey });
    const result = await MemorySpace.getMemorySpaceHistory({
      repository: options.repository,
      userId,
      apiKey,
    });
    console.log(result);
  });

// USER
program
  .command('user-info')
  .description('Get user info')
  .option('--userId <userId>', 'User ID (default: from apiKey)')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = options.userId || (await ApiKey.getUserIdFromApiKey({ apiKey }));

    const result = await User.getUser({ userId });
    console.log(result);
  });

program
  .command('user-stat')
  .description('Get user dashboard stat')
  .option('--userId <userId>', 'User ID (default: from apiKey)')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = options.userId || (await ApiKey.getUserIdFromApiKey({ apiKey }));
    const result = await User.getUserStat({ userId });
    console.log(result);
  });

program
  .command('user-histories')
  .description('Get user dashboard histories')
  .option('--userId <userId>', 'User ID (default: from apiKey)')
  .option('--paginate <paginate>', 'Pagination string')
  .option('--sort <sort>', 'Sort string')
  .option('--filters <filters>', 'Filters string')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = options.userId || (await ApiKey.getUserIdFromApiKey({ apiKey }));
    const result = await User.getUserHistories({
      userId,
      paginate: options.paginate,
      sort: options.sort,
      filters: options.filters,
    });
    console.log(result);
  });

program
  .command('user-memory-spaces')
  .description('Get user memory spaces')
  .option('--userId <userId>', 'User ID (default: from apiKey)')
  .option('--paginate <paginate>', 'Pagination string')
  .option('--sort <sort>', 'Sort string')
  .option('--filters <filters>', 'Filters string')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = options.userId || (await ApiKey.getUserIdFromApiKey({ apiKey }));
    const result = await User.getUserMemorySpaces({
      userId,
      paginate: options.paginate,
      sort: options.sort,
      filters: options.filters,
    });
    console.log(result);
  });

program
  .command('user-purchases')
  .description('Get user marketplace purchases')
  .option('--userId <userId>', 'User ID (default: from apiKey)')
  .option('--paginate <paginate>', 'Pagination string')
  .option('--sort <sort>', 'Sort string')
  .option('--filters <filters>', 'Filters string')
  .action(async options => {
    const apiKey = ApiKey.getApiKey();
    const userId = options.userId || (await ApiKey.getUserIdFromApiKey({ apiKey }));
    const result = await User.getUserPurchases({
      userId,
      paginate: options.paginate,
      sort: options.sort,
      filters: options.filters,
    });
    console.log(result);
  });

program.parse(process.argv);
