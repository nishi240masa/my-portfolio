// JSON ファイルの読み書き共通ユーティリティ
// - 読み込みは fs/promises で都度ファイルから取得（プロセス内キャッシュなし）
// - 書き込みは一時ファイル → rename の atomic write
// - 並行編集は想定しないが、書き込み中に読まれても整合性が崩れないようにする

import { promises as fs } from 'node:fs';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');

export function dataFilePath(filename: string): string {
  return path.join(DATA_DIR, filename);
}

export async function readJson<T>(filename: string): Promise<T> {
  const filePath = dataFilePath(filename);
  const text = await fs.readFile(filePath, 'utf8');
  return JSON.parse(text) as T;
}

export async function writeJson<T>(filename: string, data: T): Promise<void> {
  const filePath = dataFilePath(filename);
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  const text = JSON.stringify(data, null, 2) + '\n';
  await fs.writeFile(tmpPath, text, 'utf8');
  await fs.rename(tmpPath, filePath);
}
