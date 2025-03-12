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
        if (row[col] instanceof Buffer) {
          try {
            return row[col].toString('utf-8');
          } catch {
            return row[col].toString('base64');
          }
        }
        return row[col];
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
