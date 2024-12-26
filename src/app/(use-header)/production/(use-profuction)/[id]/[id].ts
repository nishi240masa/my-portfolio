import { type GetStaticPropsContext, type GetStaticPropsResult } from 'next';
import { getAllPosts, getPostById } from '@/utils/article';

export async function getStaticProps(
  context: GetStaticPropsContext
): Promise<GetStaticPropsResult<{ postId: string; post: any }>> {
  if (context.params?.id == null) {
    return { notFound: true };
  }

  const postId = context.params.id as string; // context.params.id を明示的に型変換
  const post = await getPostById(postId); // 非同期処理を忘れずに追加

  if (post === null || post === undefined) {
    return { notFound: true }; // ポストが見つからない場合に404ページを表示
  }

  return {
    props: { postId, post },
  };
}

export async function getStaticPaths() {
  const posts = await getAllPosts();
  return {
    paths: posts.map((post) => ({
      params: { id: post.id.toString() },
    })),
    fallback: false,
  };
}
