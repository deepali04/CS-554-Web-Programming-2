import Layout from '../components/MyLayout';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';



const AttractionCard = ({ attraction }) => {
  return (
    <Link href={`/attractions/${attraction.id}`}>
    <div className="card" >
    <img src={attraction.images[0].url} alt={attraction.name} />
      
      <h2>{attraction.name}</h2>
      <p>Genre: {attraction.classifications[0].genre ? attraction.classifications[0].genre.name : 'No Information Available'}</p>
      {/* <p>{attraction.city.name}, {attraction.state.stateCode}, {attraction.country.countryCode}</p> */}
      <style jsx>{`
        .card {
          width: 300px;
          height: 400px;
          border: 1px solid #ccc;
          border-radius: 5px;
          overflow: hidden;
          margin: 10px;
          box-shadow: 0 2px 4px rgba(0,0,0,.2);
        }
        img {
          width: 100%;
          height: 300px;
          object-fit: cover;
        }
        h2 {
          margin: 10px;
        }
        p {
          margin: 5px;
        }
      `}</style>
    </div>
    </Link>
  );
};

const Attractions = ({ attractions, page, totalPages }) => {
  return (
    <Layout>
      <h1>Attractions</h1>

      <div className="pagination">
        {page > 1 && (
          <Link href={{ pathname: "/attractions", query: { page: page - 1 } }}>
            <a>Prev</a>
          </Link>
        )}
        {page < totalPages && (
          <Link href={{ pathname: "/attractions", query: { page: page + 1 } }}>
            <a>Next</a>
          </Link>
        )}
      </div>
      <div className="attractions">
        {attractions.map((attraction) => (
          <AttractionCard key={attraction.id} attraction={attraction} />
        ))}
      </div>
      <style jsx>{`
        .attractions {
          display: flex;
          flex-wrap: wrap;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }
      `}</style>
    </Layout>
  );
};

Attractions.getInitialProps = async ({ res, query }) => {

  try {
  const page = parseInt(query.page || 1);
  const perPage = 20;
  const apiKey = "hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9";
  const baseURL = "https://app.ticketmaster.com";
  const extraURL = "/discovery/v2/attractions.json?";
  const startIndex = (page - 1) * perPage;
  
  const result = await axios.get(baseURL + extraURL + `apikey=${apiKey}&page=${page}&size=${perPage}`);
  const attractions = result.data._embedded.attractions;

  console.log("page = " + page + "and totalPages = " + Math.ceil(result.data.page.totalElements / perPage) );

  return {
    attractions,
    page,
    totalPages: Math.ceil(result.data.page.totalElements / perPage)
  };
} catch (error) {
  console.error(error);
  if (res) {
    res.writeHead(302, {
      Location: '/ErrorPage'
    });
    res.end();
  } else {
    Router.push('/ErrorPage');
  }
}
};
export default Attractions;
