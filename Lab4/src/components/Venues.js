import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams , useNavigate } from 'react-router-dom';
import Search from './Search';
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

	const Venues = () => {

	const regex = /(<([^>]+)>)/gi;
	const classes = useStyles();


	const apiKey = "hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9";
	const baseURL = "https://app.ticketmaster.com";
	const extraURL = "/discovery/v2/venues?";

	const navigate = useNavigate();

	let  { page } = useParams();
	page = parseInt(typeof (page) === "undefined" ||  page === 'NaN' ? 1 : page);

	const [nextPage, setNextPage] = useState(false);
	const [prevPage, setPrevPage] = useState(false);
	const [loading, setLoading] = useState(true);
	const [searchData, setSearchData] = useState(undefined);
	const [venueData, setVenueData] = useState(undefined);
	const [searchTerm, setSearchTerm] = useState('');
	const [currentPage, setCurrentPage] = useState([]);
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
		console.log('useEffect fired');
		async function fetchData() {
			try {
				//console.log(page);
				const result = await axios.get(baseURL + extraURL +"&apikey=" + apiKey + "&page=" + pageNum);
        console.log(result.data._embedded.venues)
				setVenueData(result.data._embedded.venues);
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
				const result = await axios.get(
					'https://app.ticketmaster.com/discovery/v2/venues?&apikey=hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9&keyword=' + searchTerm
				);
				console.log(result.data._embedded.venues)
				setSearchData(result.data._embedded.venues);
				setLoading(false);
        setPrevPage(false);
        setNextPage(false);
			} catch (e) {
				setLoading(true);
        setNextPage(false);
        setError(true);
				navigate("/noSearchTerm");
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
	const buildCard = (venue) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={venue.id}>
				<Card className={classes.card} variant='outlined'>
					<CardActionArea>
						<Link to={`/venues/${venue.id}`}>
              <CardMedia
                className={classes.media}
                component='img'
                image={
                  venue.images
                    ? venue.images[0].url
                    : noImage
                }
                title='event image'
              />

							<CardContent>
								<Typography
									className={classes.titleHead}
									gutterBottom
									variant='h6'
									component='h3'
								>
									{venue.name}
								</Typography>
							</CardContent>
						</Link>
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

	if (searchTerm) {
		card =
			searchData &&
			searchData.map((venues) => {
				//let { venue } = venues;
				return buildCard(venues);
			});
	} else {
		card =
		venueData &&
		venueData.map((venue) => {
				return buildCard(venue);
			});
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<div>
				<Search searchValue={searchValue} />
				<br />
				{page === 1 ? (
					''
				) : (
					<button className='buttons'>
						<Link to={`/venues/page/${page - 1}`} onClick={decr}>
							Prev{' '}
						</Link>
					</button>
				)}
				{nextPage === true ? (
					''
				) : (
					<button className='buttons'>
						<Link to={`/venues/page/${page + 1}`} onClick={incr}>
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
		);
	}
};

export default Venues;
