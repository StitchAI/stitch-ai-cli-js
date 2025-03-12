import fs from 'fs';
import sqlite3 from 'sqlite3';

sqlite3.verbose();

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
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(filePath, sqlite3.OPEN_READONLY, err => {
      if (err) return reject(new Error(`Error reading SQLite database: ${err.message}`));
    });

    db.serialize(() => {
      db.all('SELECT * FROM memories', (err, rows: any[]) => {
        if (err) return reject(new Error(`Error executing SQL query: ${err.message}`));

        db.all('PRAGMA table_info(memories)', (err, columns: { name: string }[]) => {
          if (err) return reject(new Error(`Error fetching column names: ${err.message}`));

          const columnNames = columns.map(col => col.name);
          const processedRows = rows.map(row =>
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

          const dbContent: { memories: MemoryData } = {
            memories: { columns: columnNames, rows: processedRows },
          };

          resolve(JSON.stringify(dbContent, null, 2));
        });
      });
    });

    db.close();
  });
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
