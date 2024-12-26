import { useAtom } from 'jotai';
import { postAtomLoadable } from '@/store/postAtom';

export async function getAllPosts() {
  const [articles] = useAtom(postAtomLoadable);

  if (articles.state === 'hasData') {
    return articles.data;
  }
  throw new Error('Data is not available');
}

export async function getPostById(id: string) {
  const posts = getAllPosts();

  if (Array.isArray(posts)) {
    return posts.find((post) => post.id.toString() === id);
  }
  return await posts;
}
