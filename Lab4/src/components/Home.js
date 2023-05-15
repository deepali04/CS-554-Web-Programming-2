import React from 'react';
import '../App.css';
import noImage from '../img/tktmasterimg.webp';

const Home = () => {
	return (
		<>
		<div class='homeBody'>
		<p class='para'>Ticketmaster API is an interface that allows developers to access and integrate Ticketmaster's database of events, venues, and tickets into their own applications. The API provides real-time access to event listings, ticket availability, pricing, and seating charts. With the <strong>Ticketmaster API</strong>, developers can create custom applications that allow users to search for and purchase tickets directly from the Ticketmaster database.</p>

		<div class="ticket-info">
			<h2>What the Ticketmaster API provides Real Time Access to:</h2>

			<button class="btn">Event Listings</button> <br/><br/>
			<button class="btn">Ticket Availability</button> <br/><br/>
			<button class="btn">Pricing</button> <br/><br/>
			<button class="btn">Seating Charts</button> <br/><br/>
			<p>With the Ticketmaster API, developers can create custom applications that provide a seamless ticket buying experience for users. To learn more, visit <a href="https://developer.ticketmaster.com/">Ticketmaster's developer portal</a>.</p>
		</div>

		</div>

		
		</>

	);
};

export default Home;
