import Link from 'next/link';

const linkStyle = {
  padding:" 0.4rem 0.8rem",
	background: "white",
	color: "black",
	margin: "5px"
};

const Header = () => (
  <div>
    <Link href="/"><a style={linkStyle}>Home</a></Link>
    <Link href="/events"><a style={linkStyle}>Events</a></Link>
    <Link href="/attractions"><a style={linkStyle}>Attractions</a></Link>
    <Link href="/venues"><a style={linkStyle}>Venues</a></Link>

    <style jsx global>{`
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

export default Header;
