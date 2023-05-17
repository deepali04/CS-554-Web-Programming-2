import "./App.css";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import CharacterList from "./components/CharacterList";
import SingleCharacter from "./components/SingleCharacter";
import Collectors from "./components/Collectors";
import Home from "./components/Home";
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from "@apollo/client";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: new HttpLink({ uri: "http://localhost:4000", }),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">  Come on Marvel Characters, we wanna say Hi to you! </h1>
            <br></br>
            <nav>
              <Link className="buttonLink" to="/">Home </Link>
              <Link className="buttonLink" to="/characters/page/0"> Characters </Link>
              <Link className="buttonLink" to="/collectors"> Collectors </Link>
            </nav>
          </header>
          <div className="App-body">
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/characters/page/:pageNum" element={<CharacterList />}/>
              <Route exact path="/character/:id" element={<SingleCharacter />} />
              <Route exact path="/collectors" element={<Collectors />} />
            </Routes>
          </div>
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
