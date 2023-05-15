import React from 'react';
import logo from './img/logoooo.webp';
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
		<Router>
			<div className='App'>
				<header className='App-header'>
					<img src={logo} className='App-logo' alt='logo' />  
          <Link className="showlink" to="/"><button>Home</button></Link>
          <Link className="showlink" to="/events/page/1"><button>Events</button></Link>
          <Link className="showlink" to="/attractions/page/1"><button>Attractions</button></Link>
          <Link className="showlink" to="/venues/page/1"><button>Venues</button></Link>
				</header>
				<br />
				<br />

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

	);
};

export default App;
