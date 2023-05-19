import Layout from "../../components/MyLayout";
import axios from "axios";
import Router from 'next/router';
// import Image from 'next/image';

const Attraction = (props) => (
  <Layout>
    <div className="mainArea">
  <div className="card">
    <img
      src={props.attraction.images && props.attraction.images[0].url ? props.attraction.images[0].url : "/download.jpg"}
      alt="No Image"
    />
    <div className="card-content">
      <h1>{props.attraction.name}</h1>
      <div style={{ textAlign: "center" }}>
        <dl>
          <dt>Upcoming Events Information</dt>
          {props.attraction && props.attraction.upcomingEvents ? (
            <dd>{"Total Events: " + props.attraction.upcomingEvents._total}</dd>
          ) : (
            <dd>N/A</dd>
          )}
        </dl>
      </div>
      <p>{props.attraction.description}</p>
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

Attraction.getInitialProps = async ({res, query}) => {
  const { id } = query;

  console.log(id)

  const apiKey = "hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9";
  const baseURL = "https://app.ticketmaster.com";
  const extraURL = `/discovery/v2/attractions/${id}.json?`;

  try {
  const result = await axios.get(baseURL + extraURL + "&apikey=" + apiKey);
  console.log(`Fetched Data: Count: 1`);
  console.log(result.data);

  return {
    attraction: result.data,
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

export default Attraction;
