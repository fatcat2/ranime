import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Container, Header, Grid, Button } from 'semantic-ui-react'
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import axios from 'axios';

class RandomAnime extends React.Component {
  constructor(){
    super();
    this.state = {
      "progress": 0,
      "name": "",
      "anime": "",
      "tags": [],
    }
  }

  componentDidMount() {
    axios.get(`/data/anime`)
      .then(res => {
        const anime = res.data;
        this.setState({ anime });
      })
  }

  render(){
    return (
        <Grid centered columns={1}>
            <Grid.Column>
              <div class="App-header">
                <Container>
                  <Header as="h1">
                    { this.state.anime }
                  </Header>
                </Container>
              </div>
            </Grid.Column>
        </Grid>
      );
    }
}

class Home extends React.Component{
  render(){
    return (
        <Grid centered columns={1}>
            <Grid.Column>
              <div class="App-header">
                <Container>
                  <Header as="h1" color="black">
                    random anime
                  </Header>
                  <Link to="/anime">
                    <Button color="blue">
                      Give me a show!
                    </Button>
                  </Link>
                </Container>
              </div>
            </Grid.Column>
        </Grid>
      );
    }
}

class Main extends React.Component {
  render(){
    return (
      <Router>
        <div className="App">
        </div>
        <Route path="/" exact component={Home} />
        <Route path="/anime" exact component={RandomAnime} />
      </Router>
    )
  }
}

export default Main;
