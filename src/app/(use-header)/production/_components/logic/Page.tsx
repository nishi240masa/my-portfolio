import { Grid2 } from '@mui/material';
import CardPage from '../view/Page/card';
import { type Post } from '@/types/post';

export default function ProductionPageLogic() {
  const postDatas: Post[] = [
    {
      id: 1,
      title: 'タイトル1',
      image: 'https://placehold.jp/150x150.png',
      description:
        'ここは説明を書く欄です。テストのために仮置きでデータを配列で置いています。長くなった場合の挙動を確認するために文章を追加。',
      date: '2024-02-01',
    },
    {
      id: 2,
      title: 'タイトル2',
      image: 'https://placehold.jp/150x150.png',
      description: '説明2',
      date: '2024-10-02',
    },
    {
      id: 3,
      title: 'タイトル3',
      image: 'https://placehold.jp/150x150.png',
      description: '説明3',
      date: '2024-11-03',
    },
    {
      id: 4,
      title: 'タイトル4',
      image: 'https://placehold.jp/150x150.png',
      description: '説明4',
      date: '2024-12-04',
    },
    {
      id: 5,
      title: 'タイトル5',
      image: 'https://placehold.jp/150x150.png',
      description: '説明5',
      date: '2024-01-05',
    },
    {
      id: 6,
      title: 'タイトル6',
      image: 'https://placehold.jp/150x150.png',
      description: '説明6',
      date: '2024-02-06',
    },
  ];

  return (
    <div>
      <Grid2
        container
        spacing={3}
        sx={{
          alignItems: 'stretch', // 高さを揃える
        }}
      >
        {postDatas.map((data) => (
          <Grid2 key={data.id} size={{ md: 3, sm: 6, xs: 12 }} sx={{ display: 'flex', justifyContent: 'center' }}>
            <CardPage data={data} />
          </Grid2>
        ))}
      </Grid2>
    </div>
  );
}
