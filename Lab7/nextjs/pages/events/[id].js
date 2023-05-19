import Layout from "../../components/MyLayout";
import axios from "axios";
import Router from 'next/router';
// import Image from 'next/image';

const Event = (props) => (
  <Layout>
    <div className="mainArea">
    <div className="card">    
        <img
          src={props.event.images && props.event.images[0].url ? props.event.images[0].url : "/download.jpg"}
          alt="No Image"
        />
      <div className="card-content">
        <h1>{props.event.name}</h1>
      
                    <div>
              <p>Price ranges:</p>
              {props.event.priceRanges && props.event.priceRanges[0] ? (
                <dl>
                  <dt>Price Type:</dt>
                  <dd>{props.event.priceRanges[0].type}</dd>
                  <dt>Price Currency:</dt>
                  <dd>{props.event.priceRanges[0].currency}</dd>
                  <dt>Minimum Price:</dt>
                  <dd>${props.event.priceRanges[0].min}</dd>
                  <dt>Maximum Price:</dt>
                  <dd>${props.event.priceRanges[0].max}</dd>
                </dl>
              ) : (
                <p>N/A</p>
              )}
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
        height: 600px;
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


Event.getInitialProps = async ({res, query}) => {
  console.log("here is the query")
  const { id } = query;

  const apiKey = "hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9";
  const baseURL = "https://app.ticketmaster.com";
  const extraURL = `/discovery/v2/events/${id}.json?`;

  try {
    const result = await axios.get(baseURL + extraURL + "&apikey=" + apiKey);
    console.log(`Fetched Data: Count: 1`);
    console.log(result.data);  
    return {
      event: result.data,
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

export default Event;
