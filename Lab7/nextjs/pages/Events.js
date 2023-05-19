import Layout from '../components/MyLayout';
import axios from 'axios';
import Link from 'next/link';
import Router from 'next/router';
// import noImage from '../public/download.jpeg';

const linkStyle = {
  padding: "0.4rem 0.8rem",
  background: "white",
  color: "black",
};




const EventCard = ({ event }) => {
  return (
    <Link href={`/events/${event.id}`}>
    <div className="card" >
    <img src={event.images[0].url} alt={event.name} />     
      <h2>{event.name}</h2>
      <p>Genre: {event.classifications[0].genre ? event.classifications[0].genre.name : 'No Information Available'}</p>
      <p>Information: {event.info ? event.info.slice(0,event.info.indexOf(".")+1) : 'No Information Available'}</p>
      {/* <p>{event.city.name}, {attraction.state.stateCode}, {attraction.country.countryCode}</p> */}
      <style jsx>{`
        .card {
          width: 300px;
          height: 500px;
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

const Events = ({ events, page, totalPages }) => {
  // console.log(events);
  // console.log(typeof(events));
  return (
    <Layout>
      <h1>Events</h1>
      <div className="pagination">
        {page > 1 && (
          <Link href={{ pathname: "/events", query: { page: page - 1 } }}>
            <a a style={linkStyle}>Prev</a>
          </Link>
        )}
        {page < totalPages && (
          <Link href={{ pathname: "/events", query: { page: page + 1 } }}>
            <a a style={linkStyle}>Next</a>
          </Link>
        )}
      </div>

      <div className="events">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
      <style jsx>{`
        .events {
          display: flex;
          flex-wrap: wrap;
        }
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          margin-top: 20px;
        }
        .pageButton {
          padding: 0.4rem 0.8rem;
          background: white;
          color: black;
          margin: 5px;
        }
        
      `}</style>
    </Layout>
  );
};


Events.getInitialProps = async ({ res, query }) => {
  try {
    const page = parseInt(query.page || 1);
    const perPage = 20;
    const apiKey = "hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9";
    const baseURL = "https://app.ticketmaster.com";
    const extraURL = "/discovery/v2/events.json?";
    const startIndex = (page - 1) * perPage;

    const result = await axios.get(baseURL + extraURL + `apikey=${apiKey}&page=${page}&size=${perPage}`);
    const events = result.data._embedded.events;

    return {
      events,
      page,
      totalPages: Math.ceil(result.data.page.totalElements / perPage)
    };
  } catch (error) {
    //console.error(error);
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
export default Events;