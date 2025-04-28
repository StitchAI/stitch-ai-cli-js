export const BASE_URL =
  process.env.STITCH_IS_LOCAL?.toLowerCase() === 'true'
    ? 'http://localhost:8080'
    : 'https://api-demo.stitch-ai.co';
