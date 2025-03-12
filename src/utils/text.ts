export const chunkText = (
  text: string,
  chunkSize: number = 2000,
  overlap: number = 200
): string[] => {
  if (!text) return [];

  const chunks: string[] = [];
  let start = 0;
  const textLength = text.length;

  while (start < textLength) {
    let end = start + chunkSize;

    // Try to find a natural breakpoint (period, question mark, or exclamation mark)
    if (end < textLength) {
      for (let i = Math.min(end + 100, textLength) - 1; i > start + chunkSize / 2; i--) {
        if ('.!?'.includes(text[i]) && text[i + 1] === ' ') {
          end = i + 1;
          break;
        }
      }
    } else {
      end = textLength;
    }

    // Add chunk to list
    chunks.push(text.slice(start, end).trim());

    // Move the start pointer, including overlap
    start = Math.max(end - overlap, start + 1);

    // If near the end, just include the rest
    if (textLength - start < chunkSize) {
      if (start < textLength) {
        chunks.push(text.slice(start).trim());
      }
      break;
    }
  }

  return chunks;
};
