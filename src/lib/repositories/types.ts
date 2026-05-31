// リポジトリ層のインタフェース定義
// 永続化方式（JSON / DB）を抽象化するための型

export interface Identifiable {
  id: number;
}

// 複数エンティティ（Production など）を扱うリポジトリ
export interface CollectionRepository<T extends Identifiable> {
  list(): Promise<T[]>;
  getById(id: number): Promise<T | null>;
  create(data: Omit<T, 'id'>): Promise<T>;
  update(id: number, data: Partial<Omit<T, 'id'>>): Promise<T>;
  delete(id: number): Promise<void>;
}

// 単一エンティティ（Profile / Skill / Home など）を扱うリポジトリ
export interface SingletonRepository<T> {
  get(): Promise<T>;
  update(data: T): Promise<T>;
}
