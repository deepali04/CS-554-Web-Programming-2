import { useQuery, useMutation } from '@apollo/client';
import queries from '../graphql/queries';
import noImage from '../img/NoImage.jpg';
import ErrorPage from "./NotFound";
import { Link } from "react-router-dom";
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles, Button} from '@material-ui/core';

import '../App.css';
const useStyles = makeStyles({
  card: {
    maxWidth: 250,
    height: 'auto',
    marginLeft: 'auto',
    marginRight: 'auto',
    borderRadius: 5,
    border: '1px solid #1e8678',
    boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);',
  },
  titleHead: {
    borderBottom: '1px solid #1e8678',
    fontWeight: 'bold',
  },
  grid: {
    flexGrow: 1,
    flexDirection: 'row',
  },
  media: {
    height: '100%',
    width: '100%',
  },
  button: {
    color: '#1e8678',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

const MyLocations = () => {
  const { loading, error, data, refetch } = useQuery(
    queries.GET_USER_POSTED_LOCATIONS,
    {
      fetchPolicy: "cache-and-network",
    }
  );
  console.log(data);

  const classes = useStyles();

  const [updateLocation] = useMutation(queries.ADD_TO_LIKED);
  const [deleteLocation] = useMutation(queries.DELETE_USER_LOCATION);

  const buildCard = (location) => {
      return (
        <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={location.id}>
          <Card className={classes.card} variant='outlined'>
            <CardActionArea>
                <CardMedia
                  className={classes.media}
                  component='img'
                  image={
                    location.image && location.image
                      ? location.image
                      : noImage
                  }
                  title='place image'
                />
  
                <CardContent>
                  <Typography
                    className={classes.titleHead}
                    gutterBottom
                    variant='h6'
                    component='h3'
                  >
                    {location.name}
                  </Typography>
                  <Typography variant='body2' color='textSecondary' component='p'>
                    {location.address
                      ? location.address
                      : 'No Address'}
                      <br/>
                      {location.liked ? (
                          <Button className="showlink" onClick={() => 
                                  ({
                                        variables: {
                                          id: location.id, 
                                          image: location.image, 
                                          userPosted: location.userPosted, 
                                          name: location.name, 
                                          address: location.address, 
                                          liked: false
                                      },
                                  })
                              
                            }
                          >
                              Unlike
                          </Button>
                      ) : (
                          <Button
                              className="showlink"
                              onClick={() => {
                                updateLocation({
                                      variables: {
                                          id: location.id, 
                                          image: location.image, 
                                          userPosted: location.userPosted, 
                                          name: location.name, 
                                          address: location.address, 
                                          liked: true
                                      },
                                  });
                              }}
                          >
                              Like
                          </Button>
                      )}
                      <Button
                          className="showlink"
                          onClick={() => {
                          deleteLocation({ variables: { id: location.id } });
                          refetch();
                          alert("Place has been deleted");
                          }}>
                          Delete Location
                      </Button>
                  </Typography>
                </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      );
    };

  if (loading) {
    return (
      <div>
        <h2 style={{ color: '#a8a4a4' }}>Loading...</h2>
      </div>
    );
  } else if (error) {
    return (
      <div>
        <ErrorPage name={"My Locations"} />
      </div>
    );
  }
  else if (!loading && data.userPostedLocations.length) {
    return (
      <>
        <div>
          <br></br> <br></br>
          <Link to="/new-location" className = "navLink" >
            Add New Location
          </Link>
          <br></br> <br></br>
        </div>
        <Grid container className={classes.grid} spacing={5}>
              {data.userPostedLocations.map((d) =>  buildCard(d))}
        </Grid>
      </>
    )
}
   
}

export default MyLocations