import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Card, Image, Icon, Container, Header, Grid, Button, Item } from 'semantic-ui-react'
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
      "title": "Loading...",
      "genres": [],
      "image": "https://media1.giphy.com/media/AAmhvrZzLCz1m/giphy.gif",
      "description": "いづれの御時にか、女御、更衣あまたさぶらひたまひけるなかに、いとやむごとなき際にはあらぬが、すぐれて時めきたまふありけり。はじめより我はと思ひ上がりたまへる御方がた、めざましきものにおとしめ嫉みたまふ。同じほど、それより下臈の更衣たちは、ましてやすからず。朝夕の宮仕へにつけても、人の心をのみ動かし、恨みを負ふ積りにやありけむ、いとあつしくなりゆき、もの心細げに里がちなるを、いよいよあかずあはれなるものに思ほして、人の そしりをもえ憚らせたまはず、世のためしにもなりぬべき御もてなしなり。",
      "aired": "Aired in Spring 2020"
    }
  }

  componentDidMount() {
    axios.get(`/data/anime`)
      .then(res => {
        const title = res.data.title;
        const genres = res.data.genres;
        const image = res.data.image
        const description = res.data.description
        const aired = res.data.aired
        this.setState({ title });
        this.setState({ genres });
        this.setState({ image });
        this.setState({ description });
        this.setState({ aired });
      })
  }

  render(){
    return (
      <div class="App-card">
        <Grid centered columns={2}>
            <Grid.Column>
                  <Image src={this.state.image} />
            </Grid.Column>
            <Grid.Column>
              <Card>
              <Card.Content>
                <Card.Header>{this.state.title}</Card.Header>
                <Card.Meta>
                  <span className='date'>{this.state.aired}</span>
                </Card.Meta>
                <Card.Description>
                  {this.state.description}
                </Card.Description>
              </Card.Content>
              </Card>
            </Grid.Column>
        </Grid>
        </div>
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
