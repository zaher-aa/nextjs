import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from '../utils/axios';

function Home({ posts }) {
  const router = useRouter();

  const goToDetails = (postId) => router.push(`/post/${postId}`);

  return (
    <>
      <Head>
        <title>Home page</title>
        <meta name="description" content="this is the home page" />
      </Head>
      {
      posts.map(({ _id, title, content }) => (
        <article key={_id}>
          <h1>{title}</h1>
          <p>{content}</p>
          <button onClick={() => goToDetails(_id)} type="button">View</button>
        </article>
      ))
    }
    </>
  );
}

export const getStaticProps = async () => {
  const { data: { data: posts } } = await axios.get('/api/post/all');

  return { props: { posts }, revalidate: 1 };
};

export default Home;
