import Layout from '../components/MyLayout';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';

const VenueCard = ({ venue }) => {

  return (
    <Link href={`/venues/${venue.id}`}>
    <div className="card" >
    <img src={venue.images && venue.images[0].url ? venue.images[0].url : "/download.jpg"} 
    alt="No Image"
    />   
      <h2>{venue.name}</h2> 
      <p>Address: {venue.address.line1}, {venue.city.name}, {venue.state.stateCode}</p>
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

const Venues = ({venues, page, totalPages }) => {

  return (
    <Layout>
      <h1>Venues</h1>
      <div className="pagination">
      {page > 1 && (
          <Link href={{ pathname: "/venues", query: { page: page - 1 } }}>
            <a>Prev</a>
          </Link>
        )}
        {page < totalPages && (
          <Link href={{ pathname: "/venues", query: { page: page + 1 } }}>
            <a>Next</a>
          </Link>
        )}
      </div>

      <div className="venues">
      {venues.map((venue) => (
          <VenueCard key={venue.id} venue={venue} />
        ))}
      </div>  
      <style jsx>{`
        .venues {
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

Venues.getInitialProps = async ({ res, query }) => {
  try {
  const page = parseInt(query.page || 1);
  const perPage = 20;
  const apiKey = "hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9";
  const baseURL = "https://app.ticketmaster.com";
  const extraURL = "/discovery/v2/venues.json?";
  const startIndex = (page - 1) * perPage;

  const result = await axios.get(baseURL + extraURL + `apikey=${apiKey}&page=${page}&size=${perPage}`);
  const venues = result.data._embedded.venues;
  
  console.log("page = " + page + "and totalPages = " + Math.ceil(result.data.page.totalElements / perPage));
    return {      
        venues,
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

export default Venues;
