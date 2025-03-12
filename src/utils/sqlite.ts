import Database from 'better-sqlite3';
import fs from 'fs';

interface MemoryData {
  columns: string[];
  rows: string[][];
}

interface CharacterData {
  name?: string;
  system?: string;
  bio?: string;
  lore?: string;
  style?: string;
  adjectives?: string;
}
export const processSqliteFile = async (filePath: string): Promise<string> => {
  try {
    const db = new Database(filePath, { readonly: true });
    const columnsQuery = db.prepare('PRAGMA table_info(memories)').all();
    const columnNames = columnsQuery.map((col: any) => col.name);
    const rowsQuery = db.prepare('SELECT * FROM memories').all();

    const processedRows = rowsQuery.map((row: any) =>
      columnNames.map(col => {
        let value = row[col];

        // Convert Buffer to string
        if (value instanceof Buffer) {
          try {
            value = value.toString('utf-8');
          } catch {
            // Fall back to a safer representation if UTF-8 fails
            value = value.toString('base64');
          }
        }

        // Clean text data
        if (typeof value === 'string') {
          // Remove replacement characters (common encoding issues)
          value = value.replace(/\ufffd/g, '');

          // Remove other problematic special characters
          // eslint-disable-next-line no-control-regex
          value = value.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

          // Handle JSON strings - try to parse, clean, and re-stringify
          if (
            (value.startsWith('{') && value.endsWith('}'))(
              value.startsWith('[') && value.endsWith(']')
            )
          ) {
            try {
              const parsedJson = JSON.parse(value);

              // If it's a JSON object with a text property, clean that text
              if (parsedJson && typeof parsedJson === 'object' && parsedJson.text) {
                parsedJson.text = cleanText(parsedJson.text);
              }

              // Return cleaned JSON
              value = JSON.stringify(parsedJson);
            } catch {
              // If JSON parsing fails, just clean the string directly
              value = cleanText(value);
            }
          } else {
            // For non-JSON strings, clean directly
            value = cleanText(value);
          }
        }

        return value;
      })
    );

    db.close();
    const dbContent: { memories: MemoryData } = {
      memories: { columns: columnNames, rows: processedRows },
    };
    return JSON.stringify(dbContent, null, 2);
  } catch (err) {
    throw new Error(`Error processing SQLite database: ${(err as Error).message}`);
  }
};

// Helper function to clean text
function cleanText(text: string): string {
  if (typeof text !== 'string') return text;

  // Remove replacement characters and control characters
  let cleaned = text.replace(/\ufffd/g, '');
  // eslint-disable-next-line no-control-regex
  cleaned = cleaned.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');

  // Remove excessive Unicode symbols that are likely encoding errors
  cleaned = cleaned.replace(/[\u02bc-\uFFFF]/g, function (match) {
    // Keep common Unicode characters like emojis and language characters
    if (
      /[\u2600-\u27FF]/.test(match) || // Common symbols and emoji
      /[\u1F300-\u1F5FF]/.test(match) || // Additional emoji
      /[\u0080-\u024F]/.test(match)
    ) {
      // Latin extended and common accents
      return match;
    }
    return '';
  });

  // Remove consecutive spaces
  cleaned = cleaned.replace(/\s+/g, ' ');

  return cleaned.trim();
}
/**
 * JSON 캐릭터 파일을 읽고 특정 필드만 추출하는 함수
 */
export const processCharacterFile = async (filePath: string): Promise<string> => {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const charData: CharacterData = JSON.parse(data);

    const keysToExtract = ['name', 'system', 'bio', 'lore', 'style', 'adjectives'];

    const filteredData = Object.fromEntries(
      keysToExtract
        .filter(key => key in charData)
        .map(key => [key, charData[key as keyof CharacterData]])
    );

    return JSON.stringify(filteredData, null, 2);
  } catch {
    throw new Error(`Character memory file not found - ${filePath}`);
  }
};

/**
 * 일반 텍스트 메모리 파일을 읽는 함수
 */
export const processMemoryFile = async (filePath: string): Promise<string> => {
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch {
    throw new Error(`Memory file not found - ${filePath}`);
  }
};
