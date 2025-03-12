# Stitch SDK Guide

This guide explains how to use the Stitch SDK tool for managing memory spaces and memories. Follow
the instructions below to set up your environment, create memory spaces, upload and download
memories, and list spaces and memories.

---

## Environment Setup

Before using any commands, ensure that your environment variable is set with your API key. The API
key is associated with your wallet address.

- **Environment Variable:** `STITCH_API_KEY`
- **Demo API Key Format:** `demo-[wallet_address]`
- **Note:** Each wallet is allowed only one API key.

```bash
export STITCH_API_KEY=demo-[your_wallet_address]
```

## Commands

The Stitch SDK provides a set of commands to manage memory spaces and the memories stored within
them. Below is an in-depth explanation of each command along with its functionality and usage
examples.

### 0. Generate Api Key

Generate new api key for the given wallet address

```bash
stitch key [walletAddress]
```

### 1. Create Memory Space

Creates a new memory space using the specified name.

```bash
stitch create-space [name]
```

### 2. Upload Memory

Uploads a memory to a specified space with an associated message.

```bash
stitch push [space] [message]
```

### 3. Download Memory

Downloads a specific memory from a space using the unique hash.

```bash
stitch pull [space] [hash]
```

### 4. List All Spaces

Lists all memory spaces available for the user.

```bash
stitch list
```

### 5. List All Memories in a Space

Lists all memories stored within a specified space.

```bash
stitch list -s [space]
```
