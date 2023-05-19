import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams , useNavigate } from 'react-router-dom';
import Search from './Search';
import ErrorPage from "./ErrorPage";
import NoSearchTerm from './NoSearchTerm';
import noImage from '../img/download.jpeg';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography, makeStyles,} from '@material-ui/core';
import '../App.css';

   
const useStyles = makeStyles({
	card: {
		maxWidth: 250,
		height: 'auto',
		marginLeft: 'auto',
		marginRight: 'auto',
		borderRadius: 5,
		border: '1px solid #8F0000',
		boxShadow: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.67);',
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
  	padding: '15px 32px',
	},	
});

	const Events = () => {
		
	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();
	const apiKey = "hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9";
	const baseURL = "https://app.ticketmaster.com";
	const extraURL = "/discovery/v2/events?countryCode=US";
	const navigate = useNavigate();


	let  { page } = useParams();
	page = parseInt(typeof (page) === "undefined" ||  page === 'NaN' ? 1 : page);


	const [nextPage, setNextPage] = useState(false);
	const [prevPage, setPrevPage] = useState(false);
	const [loading, setLoading] = useState(true);
	const [searchData, setSearchData] = useState(undefined);
	const [searchTerm, setSearchTerm] = useState('');
	const [eventData, setEventData] = useState(undefined);
	const [currentPage, setCurrentPage] = useState(page);
	const [noSearchTermPage, setNoSearchTerm] = useState(false);
	const [error, setError] = useState(false);

	let card = null;
	const incr = () => {
		setCurrentPage(currentPage + 1+1);
	};
	const decr = () => {
		setCurrentPage(currentPage - 1+1);
	};


	useEffect(() => {
		let pageNum = page -1;
		console.log(pageNum);
		console.log('normal useEffect fired');
		async function fetchData() {
			try {
				const result = await axios.get(baseURL + extraURL +"&apikey=" + apiKey + "&page=" + pageNum);
				result.data._embedded.events.length === 0 ? setError(true) : setError(false);
				setEventData(result.data._embedded.events);
				setNextPage(false);
				setLoading(false);
			} catch (e) {
				setLoading(true);
        setNextPage(false);
        setError(true);
				navigate("/errorPage");
			}
		}
		fetchData();
  }, [page]);


	

	useEffect(() => {
		console.log('search useEffect fired');
		async function fetchData() {
			try {
				console.log(`in fetch searchTerm: ${searchTerm}`);
				const result = await axios.get(baseURL + "/discovery/v2/events?apikey=" + apiKey + "&keyword=" + searchTerm + "&countryCode=US") ;
				setSearchData(result.data._embedded.events);
				setLoading(false);
        setPrevPage(false);
        setNextPage(false);
			} catch (e) {
				setLoading(true);
        setNextPage(false);
        setError(true);
				navigate("/noSearchTerm");
				//console.log(e);
			}
		}
		if (searchTerm) {
			console.log('searchTerm is set');
			fetchData();
		}
	}, [searchTerm]);


	const searchValue = async (value) => {
		setSearchTerm(value);
	};
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         
	const buildCard = (event) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={event.id}>
					<Card className={classes.card} variant='outlined'style={{ height: '300px', width: '200px' }} >
					<CardActionArea>
						<Link to={`/events/${event.id}`}>
							<CardMedia
								className={classes.media}
								component='img'
								image={
									event.images[0].url
										? event.images[0].url
										: noImage
								}
								title='show image'
							/>

							<CardContent>
								<Typography
									className={classes.titleHead}
									gutterBottom
									variant='h6'
									component='h3'
								>
									{event.name}
								</Typography>
								<Typography variant='body2' color='textSecondary' component='p'>
									{event.info
										? event.info.replace(regex, '').substring(0, 139) + '...'
										: 'No Information Available'}
										<br></br><br></br>
									<span>More Info</span>
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};
	
	//console.log(searchTerm)
	
	if (searchTerm) {
		card = searchData && searchData.map((events) => {
				return buildCard(events);
			});
	} else {
		card = eventData &&	eventData.map((event) => {
				return buildCard(event);
			});
	}


	if (page >= 0) {
    if (loading) {
      return (
        <div>{error ? <ErrorPage name={"Page"} /> : <h2>Loading....</h2>}</div>
      );
    } else {
      return (
        <>
          {error ? (
            <ErrorPage name={"Page"} />
          ) : (
            <div>
				<Search searchValue={searchValue} />
				<br />
				{page === 1 ? (
					''
				) : (
					<button className='buttons'>
						<Link to={`/events/page/${page - 1}`} onClick={decr}>
							Prev{' '}
						</Link>
					</button>
				)}
				{nextPage === true ? (
					''
				) : (
					<button className='buttons'>
						<Link to={`/events/page/${page + 1}`} onClick={incr}>
							Next{' '}
						</Link>
					</button>
				)}
				<br />
				<br />

				<Grid container className={classes.grid} spacing={5}>
					{card}
				</Grid>
			</div>
          )}
        </>
      );
    }
  } else {
    return (
      <div>
        <ErrorPage name={"Page"} />{" "}
      </div>
    );
  }
};

export default Events;
