import { useRouter } from 'next/router';
import Head from 'next/head';
import axios from '../../utils/axios';

function Post({ post }) {
  const { title, content } = post;
  const { back } = useRouter();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={content} />
      </Head>
      <article>
        <h1>{title}</h1>
        <p>{content}</p>
        <button type="button" onClick={() => back()}>Back</button>
      </article>
    </>
  );
}

export const getStaticPaths = async () => {
  const { data: { data: posts } } = await axios.get('/api/post/all');
  const paths = posts.map(({ _id }) => ({ params: { _id } }));

  return { paths, fallback: false };
};

export const getStaticProps = async ({ params: { _id } }) => {
  const { data: { data: post } } = await axios.get(`/api/post/${_id}`);

  return { props: { post } };
};

export default Post;
