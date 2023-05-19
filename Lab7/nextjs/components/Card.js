const Card = ({ data }) => (
  <div className="card">
    <img src={data.image} alt={data.title} />
    <h2>{data.title}</h2>
    <p>{data.description}</p>
    <a href={data.link}>Learn more</a>
    <style jsx>{`
      .card {
        border: 1px solid #ddd;
        border-radius: 4px;
        overflow: hidden;
        margin-bottom: 1rem;
      }
      img {
        max-width: 100%;
        height: auto;
      }
      h2 {
        margin: 1rem;
      }
      p {
        margin: 1rem;
      }
      a {
        display: block;
        text-align: center;
        background-color: #0070f3;
        color: white;
        padding: 0.5rem;
        text-decoration: none;
        transition: background-color 0.3s ease;
      }
      a:hover {
        background-color: #0060d3;
      }
    `}</style>
  </div>
);

export default Card;
