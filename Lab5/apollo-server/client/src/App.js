import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import React from 'react';
import './App.css';
import Locations from './component/Locations';
import MyLikes from './component/MyLikes';
import MyLocations from './component/MyLocations';
import NewLocation from './component/NewLocation';
import NotFound from './component/NotFound';

import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({
    uri: "http://localhost:4000",
  }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">BoreSquare</h1>
            <nav>
              <Link className = "navLink" to="/"> Locations</Link>         
              <Link className = "navLink" to="/my-likes"> My-Likes </Link>         
              <Link className = "navLink" to="/my-locations"> My-locations </Link>
              <Link className = "navLink" to="/new-location"> New-location </Link>
            </nav>
          </header>
          <div className="App-body">
          <Routes>
              <Route exact path="/" element={<Locations/>} />
              <Route exact path="/my-likes" element={<MyLikes/>} />
              <Route exact path="/my-locations" element={<MyLocations/>} />
              <Route exact path="/new-location" element={<NewLocation/>} />
              <Route exact path="*" element={<NotFound/>} />
          </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;



















// import React from 'react';
// //import { BrowserRouter as Router, Route, Routes, NavLink} from 'react-router-dom';
// import { BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
// import { Switch } from 'react-router-dom';
// import './App.css';
// import Locations from './component/Locations';
// import MyLikes from './component/MyLikes';
// import MyLocations from './component/MyLocations';
// import NewLocation from './component/NewLocation';
// import NotFound from './component/NotFound';
  
// import {
//   ApolloClient,
//   HttpLink,
//   InMemoryCache,
//   ApolloProvider
// } from '@apollo/client';

// const client = new ApolloClient({
//   cache: new InMemoryCache(),
//   link: new HttpLink({
//     uri: 'http://localhost:4000'
//   })
// });

// function App() {
//   return (
//     <ApolloProvider client={client}>
//       <Router>
//       <header className='App-header'>
//         <nav>
//             <h1 className='App-name'>BoreSquare</h1>
//             <NavLink className = "navLink" to="/"> Locations</NavLink>         
//             <NavLink className = "navLink" to="/my-likes"> My-Likes </NavLink>         
//             <NavLink className = "navLink" to="/my-locations"> My-locations </NavLink>
//             <NavLink className = "navLink" to="/new-location"> New-location </NavLink>
//         </nav>
//         </header>

//         <Switch>
//           <Route exact path="/" component={Locations} />
//           <Route exact path="/my-likes" component={MyLikes} />
//           <Route exact path="/my-locations" component={MyLocations} />
//           <Route exact path="/new-location" component={NewLocation} />
//           <Route exact path="*" component={NotFound} />
//         </Switch>
        
//       </Router>
//    </ApolloProvider>
//   );
// }

// export default App;