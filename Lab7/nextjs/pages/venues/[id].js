import Layout from "../../components/MyLayout";
import axios from "axios";
import Router from 'next/router';
// import Image from 'next/image';

const Venue = (props) => (

  <Layout>
    <div className="mainArea">
    <div className="card">
      <img
        src={props.venue.images && props.venue.images[0].url ? props.venue.images[0].url : "/download.jpg"}
        alt="No Image"
      />
      <div className="card-content">
        <h1>{props.venue.name}</h1>
        <p>{props.venue.description}</p>
        <div>
        <dl style={{ textAlign: "center" }}>
          <dt>Address</dt>
          {props.venue ? (
            <dd>{props.venue.address.line1 + ", " + props.venue.city.name +  ", " + props.venue.state.stateCode}</dd>
          ) : (
            <dd>N/A</dd>
          )}
        </dl>
      </div>
      <div>
        <dl style={{ textAlign: "center" }}>
          <dt>General Information</dt>
          {props.venue && props.venue.generalInfo ? (
            <dd>{props.venue.generalInfo.generalRule}</dd>
          ) : (
            <dd>N/A</dd>
          )}
        </dl>
        </div>

      </div>
    </div>
    </div>
    <style jsx>
      {`
      .mainArea {
        display: flex;
        justify-content: center;
        align-items: center;
      }
      
      .card {
        width: 400px;
        height: 650px;
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
      

      .card:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }

      .card-content {
        padding: 20px;
      }

      h1,h3 {
        margin-top: 0;
      }
    `}</style>
  </Layout>
);


Venue.getInitialProps = async ({res, query}) => {
  const { id } = query;

  const apiKey = "hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9";
  const baseURL = "https://app.ticketmaster.com";
  const extraURL = `/discovery/v2/venues/${id}.json?`;

  try {
  const result = await axios.get(baseURL + extraURL + "&apikey=" + apiKey);
  console.log(`Fetched Data: Count: 1`);
  console.log(result.data);

  return {
    venue: result.data,
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

export default Venue;
