import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Route
} from "react-router-dom";

import Home from "./Home";
import AdvancedSearch from "./AdvancedSearch"
import RandomAnime from "./RandomAnime";

class Main extends React.Component {
  render(){
    return (
      <Router>
        <Route path="/" exact component={Home} />
        <Route path="/advanced" exact component={AdvancedSearch} />
        <Route path="/anime" exact component={RandomAnime} />
      </Router>
    )
  }
}

export default Main;