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
		border: '3px solid #8F0000',
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


const SingleEvent = () => {
	
	const [loading, setLoading] = useState(true);
	const { id } = useParams();
	const [eventData, setEventData] = useState(undefined);
	const [error, setError] = useState(false);
	const classes = useStyles();


	//date -time conversion
	
	const tConvert = (time) => {
		// Check correct time format and split into components
		time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [ time ];

		if (time.length > 1) {
			// If time format correct
			time = time.slice(1); // Remove full string match value
			time[5] = +time[0] < 12 ? 'AM' : 'PM'; // Set AM/PM
			time[0] = +time[0] % 12 || 12; // Adjust hours
		}
		return time.join(''); // return adjusted time or original string
	};
	const formatDate = (eventData) => {
		var year = eventData.substring(0, 4);
		var month = eventData.substring(5, 7);
		var day = eventData.substring(8, 10);
		return month + '/' + day + '/' + year;
	};


	//date -time conversion end here


	useEffect(() => {
		console.log('useEffect fired');
		async function fetchData() {
			try {
				const { data: event } = await axios.get(
					"https://app.ticketmaster.com/discovery/v2/events/" + id +"?apikey=hRDTD4SpvBCDCF39xCGw2GvmCENv2XH9"			
				);
				console.log(event);
				setEventData(event);
				setLoading(false);
				console.log(event);
			} catch (e) {
				setError(true);
				console.log(e);
			}
		}
		fetchData();
	}, [id]);

	console.log(eventData);

	let info = null;
	const regex = /(<([^>]+)>)/gi;
	if (eventData && eventData.info) {
		info = eventData && eventData.info.replace(regex, '');
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
				<CardHeader className={classes.titleHead} title={eventData.name} />
				<CardContent>
					<Typography variant='body2' color='textSecondary' component='span'>
						<dl>
							<p>

							<CardMedia
								className={classes.media}
								component='img'
								image={
									eventData.images[0].url
										? eventData.images[0].url
										: null
								}
								title='show image'
							/>
							</p>
							<p>
								<dt className='title'>Information:</dt>
								{eventData && eventData.info ? (
									<dd>{eventData.info}</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
							<p>
								<dt className='priceRanges'>Price Ranges:</dt>
								{eventData.priceRanges[0] ? (
									<dd>{
										"Type: "+ eventData.priceRanges[0].type +'\n'+
										"Currency: "+ eventData.priceRanges[0].currency +'\n'+
										"Minimum Price: "+ eventData.priceRanges[0].min +'\n'+
										"Maximum Price: "+ eventData.priceRanges[0].max +'\n'
									}</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
							<p>
								<dt className='publicSales'>Public Sales Details: </dt>
								{eventData.sales.public.startDateTime ? (
									<dd>{
										eventData && eventData.sales.public.startDateTime ? <dd>{formatDate(eventData.sales.public.startDateTime)}</dd> : <dd>N/A</dd>
									}</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
							<p>

								<dt className='preSales'>Pre Sales Details: </dt>
								{eventData.sales.presales.startDateTime ? (
									<dd>{
										eventData && eventData.sales.presales.startDateTime ? <dd>{formatDate(eventData.sales.presales.startDateTime)}</dd> : <dd>N/A</dd>
									}</dd>
								) : (
									<dd>N/A</dd>
								)}
							</p>
							<p>
							<dt className='timezone'>Time-Zone: </dt>
							{eventData.dates.timezone ? (
									<dd>{
										eventData && eventData.dates.timezone ? <dd>{eventData.dates.timezone}</dd> : <dd>N/A</dd>
									}</dd>
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

export default SingleEvent;
