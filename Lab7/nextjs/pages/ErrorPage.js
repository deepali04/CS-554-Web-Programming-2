import Layout from '../components/MyLayout';
import Link from 'next/link';

const linkStyle = {
  marginRight: 15
};

const ErrorPage = () => {
  return (
    <Layout>
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
    </Layout>
  );
};

export default ErrorPage;
