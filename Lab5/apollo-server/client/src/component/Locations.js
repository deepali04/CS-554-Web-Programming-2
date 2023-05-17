import React, {useState} from 'react';
import { useQuery, useMutation } from "@apollo/client";
import queries from '../graphql/queries';
import noImage from '../img/NoImage.jpg';
import ErrorPage from "./NotFound";
import Pagination from "./Pagination";
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
    fontSize: 12,
  },
});

const Locations = () => {
  const [pageNum, setPageNum] = useState(1);
  const [updateLocation] = useMutation(queries.ADD_TO_LIKED);


  const getMore = () => {
    setPageNum(pageNum + 1);
  }; 

  const classes = useStyles();

  const { loading, error, data} = useQuery(queries.LOAD_LOCATIONS, {
    variables: { pageNum },
    fetchPolicy: "cache-and-network",
  });

  console.log(data)

  const buildCard = (location) => {
    return (
      <Grid item key={location.id}>
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
                title='location image'
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
                                        liked: false
                                    },
                                });
                            }}
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
                </Typography>
              </CardContent>
          </CardActionArea>
        </Card>
      </Grid>
    );

  }

    if (loading) {
      return (
        <div>
          <h2 style={{ color: '#a8a4a4' }}>Loading..</h2>
        </div>
      );
    } else if (error) {
      return (
        <div>
          <ErrorPage name={"BoreSquare Locations"} />
        </div>
      );
    }
    else if (!loading && data.locationPosts.length) {
      return (
        <>
          <br></br><br></br>
          <Pagination
            pageNum={pageNum}
            getMore={getMore}
          />
          <br></br><br></br>
        <Grid container className={classes.grid} spacing={5}>
              {data.locationPosts.map((d) =>  buildCard(d))}
        </Grid>
        </>
      )



}
}
export default Locations