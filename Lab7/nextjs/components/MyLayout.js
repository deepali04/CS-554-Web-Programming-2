import Header from './Header';
import Head from 'next/head';

const layoutStyle = {
  margin: 20,
  padding: 20,
  border: '1px solid #DDD'
};

const Layout = (props) => (
  <div style={layoutStyle}>
		<Head>
      <title>Trick-it-master </title>
    </Head>
    <Header />
    {props.children}

    <style jsx global>{`
			h1,h2,p, h3, dl, dt {
				color: white;
				text-align: center;
			}
			body {
				margin: 0;
				padding: 0;
				width: 100%;
				height: 100vh;
				background-color: black;
}
			}

			a:hover{
				color: white;
				background-color: #5F6A6A;
				border: 1px solid black:
			}
		   
			a{
				color: #ECF0F1 ;
				text-decoration: none;
				margin-right: 15px;
				padding 5px;
		   
			}
		`}</style>
  </div>
);

export default Layout;
