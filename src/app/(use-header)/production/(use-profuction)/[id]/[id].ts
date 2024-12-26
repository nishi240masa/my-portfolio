// import { getAllPosts, getPostById } from '@/utils/article';

// export async function getStaticPaths() {
//   // Call an external API endpoint to get posts
//   const res = await getAllPosts();
//   const posts = res;

//   // Get the paths we want to pre-render based on posts
//   const paths = posts.map((post) => ({
//     params: { id: post.id },
//   }));

//   return { paths, fallback: false };
// }

// export async function getStaticProps({ params }: { params: { id: string } }) {
//   const res = await getPostById(params.id);
//   const post = res;

//   return { props: { post } };
// }
