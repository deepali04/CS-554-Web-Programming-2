import { useQuery, useMutation } from "@apollo/client";
import React from "react";
import queries from '../graphql/queries';
import noImage from '../img/NoImage.jpg';
import ErrorPage from "./NotFound";
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


const MyLikes = () => {
  const { loading, error, data, refetch  } = useQuery(queries.GET_LIKED_LOCATIONS, {
    fetchPolicy: "cache-and-network",
  });

  const classes = useStyles();

  console.log(data); 
  console.log(error);
  const [updatedLocation] = useMutation(queries.REMOVE_FROM_LIKED);

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
                        <Button className="showlink" onClick={() => {
                          updatedLocation({
                            variables: {
                              id: location.id, 
                              image: location.image, 
                              userPosted: location.userPosted, 
                              name: location.name, 
                              address: location.address, 
                              liked: false
                          },
                      });
                      //refetch(); 
                        }                                                       
                          }
                        >
                            Unlike
                        </Button>
                    ) : (
                        <Button
                            className="showlink"
                            onClick={() => {
                              updatedLocation({
                                    variables: {
                                        id: location.id, 
                                        image: location.image, 
                                        userPosted: location.userPosted, 
                                        name: location.name, 
                                        address: location.address, 
                                        liked: true
                                    },
                                });
                                refetch();
                            }}
                        >
                            Like
                        </Button>
                    )}
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
  } else if (data.likedLocations.length===0) {
    return (
      <div>
        <ErrorPage name={"Liked Locations"} />
      </div>
    );
  }

  else if (!loading && data.likedLocations.length) {
    return (
      <>
        <div>      
          <br></br> <br></br>
        </div>
        <Grid container className={classes.grid} spacing={5}>
              {data.likedLocations.map((d) =>  buildCard(d))}
        </Grid>
      </>
    )
  }
}
export default MyLikes