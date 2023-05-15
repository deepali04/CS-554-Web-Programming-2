import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useParams } from "react-router-dom";
import noImage from '../img/download.jpeg';
import {makeStyles,	Card,	CardContent, CardMedia,	Typography,	CardHeader,} from '@material-ui/core';
import '../App.css';

const useStyles = makeStyles({
	card: {
		maxWidth: 550,
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

const SingleVenue = () => {
	
	const [loading, setLoading] = useState(true);
	const { id } = useParams();
	const [venueData, setVenueData] = useState(undefined);
	const [error, setError] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		console.log('useEffect fired');
		async function fetchData() {
			try {
				const { data: venue } = await axios.get(
					"https://app.ticketmaster.com/discovery/v2/venues/" + id +"?apikey=hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9"

					
				);
				console.log(venue);
				setVenueData(venue);
				setLoading(false);
				console.log(venue);
			} catch (e) {
				setError(true);
				console.log(e);
			}
		}
		fetchData();
	}, [id]);

	console.log(venueData);

	let info = null;
	const regex = /(<([^>]+)>)/gi;
	if (venueData && venueData.info) {
		info = venueData && venueData.info.replace(regex, '');
	} else {
		info = 'No Information Available';
	}

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	} else {
		return (
			<Card className={classes.card} variant='outlined'>
				<CardHeader className={classes.titleHead} title={venueData.name} />
				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
							<p>
							{ <CardMedia
									className={classes.media}
									component='img'
									image={
										venueData.images
											? venueData.images[0].url
											: noImage
									}
					title='show image'
				/> }
							</p>
							<p>
								<dt className='name'>Address:</dt>
								{venueData ? (
									<dd>{venueData.address.line1+", " + venueData.city.name + ", " + venueData.state.stateCode}</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
							<p>
								<dt className='title'>General Information:</dt>
								{venueData && venueData.generalInfo ? (
									<dd>{venueData.generalInfo.generalRule}</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>						
							<p>
							</p>
							<p>
								<dt className='title'>Upcoming Events:</dt>
								{venueData &&
								venueData.upcomingEvents ? (
									<dd>{"Total Events: " + venueData.upcomingEvents._total}</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
							
						</dl>
					</Typography>
				</CardContent>
			</Card>


			
		);
	}
};

export default SingleVenue;