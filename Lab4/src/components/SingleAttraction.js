import React, { useState, useEffect } from 'react';

import axios from 'axios';
import { Link, useParams } from "react-router-dom";
//import noImage from '../img/download.jpeg';
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

const SingleAttraction = () => {
	
	const [loading, setLoading] = useState(true);
	const { id } = useParams();
	const [attractionData, setAttractionData] = useState(undefined);
	const [error, setError] = useState(false);
	const classes = useStyles();

	useEffect(() => {
		console.log('useEffect fired');
		async function fetchData() {
			try {
				const { data: event } = await axios.get(
					"https://app.ticketmaster.com/discovery/v2/attractions/" + id +"?apikey=hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9"

					
				);
				console.log(event);
				setAttractionData(event);
				setLoading(false);
				console.log(event);
			} catch (e) {
				setError(true);
				console.log(e);
			}
		}
		fetchData();
	}, [id]);

	console.log(attractionData);

	let info = null;
	const regex = /(<([^>]+)>)/gi;
	if (attractionData && attractionData.info) {
		info = attractionData && attractionData.info.replace(regex, '');
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
				<CardHeader className={classes.titleHead} title={attractionData.name} />
				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
							<p>
							<CardMedia
								className={classes.media}
								component='img'
								image={
									attractionData.images[0].url
										? attractionData.images[0].url
										: null
								}
								title='show image'
							/>
							</p>
							<p>
								<dt className='name'>Name:</dt>
								{attractionData && attractionData.name ? (
									<dd>{attractionData.name}</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
							
							<p>
								<dt className='title'>Upcoming Events:</dt>
								{attractionData && attractionData.upcomingEvents ? (
									<dd>{"Total Events: " +attractionData.upcomingEvents._total}</dd>
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

export default SingleAttraction;