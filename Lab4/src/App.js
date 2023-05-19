import React from 'react';
import logo from './img/logoooo.webp';
import { Grid, Button } from '@material-ui/core';
import './App.css';
import { BrowserRouter as Router, Route, Link, Routes } from 'react-router-dom';
import Home from "./components/Home";
import Events from "./components/Events";
import SingleEvent from "./components/SingleEvent";
import Attractions from "./components/Attractions";
import SingleAttraction from "./components/SingleAttraction";
import Venues from "./components/Venues";
import SingleVenue from "./components/SingleVenue";
import ErrorPage from "./components/ErrorPage";
import NoSearchTerm from './components/NoSearchTerm';

const App = () => {
	return (

		<>
		<Router>
		 <div className='App'>
      <header className='App-header'>
				<h1>Trick-it-Master</h1>
				<br></br>
        <Grid container spacing={2} justify='center'>
          <Grid item>
            <Link to='/'>
              <Button variant='contained' color='primary'>
                Home
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to='/events/page/1'>
              <Button variant='contained' color='primary'>
                Events
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to='/attractions/page/1'>
              <Button variant='contained' color='primary'>
                Attractions
              </Button>
            </Link>
          </Grid>
          <Grid item>
            <Link to='/venues/page/1'>
              <Button variant='contained' color='primary'>
                Venues
              </Button>
            </Link>
          </Grid>
        </Grid>
		<br></br>
			</header>
				<div className='App-body'>
					<Routes>
          <Route exact path="/" element={<Home />} />
            <Route path="/events/page/:page" element={ <Events /> }></Route>
            <Route exact path="/events/:id" element={ <SingleEvent/> }></Route>
            <Route exact path="/attractions/page/:page" element={ <Attractions/> }></Route> 
            <Route exact path="/attractions/:id" element={ <SingleAttraction/> }></Route>
            <Route exact path="/venues/page/:page" element={ <Venues/> }></Route>
            <Route exact path="/venues/:id" element={ <SingleVenue/> }></Route>
						<Route exact path="/errorPage" element={ <ErrorPage/> }></Route>
						<Route exact path="/noSearchTerm" element={ <NoSearchTerm/> }></Route>
				</Routes>
				</div>
			</div>
		</Router> 

		</>

	);
};

export default App;
