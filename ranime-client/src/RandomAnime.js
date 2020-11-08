import React from 'react';
import './App.css';
import { Card, Image, Container, Grid, Button, Segment, GridColumn } from 'semantic-ui-react'

import axios from 'axios';
import queryString from 'query-string'

class RandomAnime extends React.Component {
    constructor(){
      super();
      this.state = {
        "name": "",
        "title": "Loading...",
        "genres": [],
        "image": "https://media1.giphy.com/media/AAmhvrZzLCz1m/giphy.gif",
        "description": "いづれの御時にか、女御、更衣あまたさぶらひたまひけるなかに、いとやむごとなき際にはあらぬが、すぐれて時めきたまふありけり。はじめより我はと思ひ上がりたまへる御方がた、めざましきものにおとしめ嫉みたまふ。同じほど、それより下臈の更衣たちは、ましてやすからず。朝夕の宮仕へにつけても、人の心をのみ動かし、恨みを負ふ積りにやありけむ、いとあつしくなりゆき、もの心細げに里がちなるを、いよいよあかずあはれなるものに思ほして、人の そし りをもえ憚らせたまはず、世のためしにもなりぬべき御もてなしなり。",
        "aired": "Aired in Spring 2020"
      }
    }
  
    componentDidMount() {
      let parsed = queryString.parse(this.props.location.search);
      console.log(parsed)
      if(Object.keys(parsed).length > 0){
        axios.post(`/data/anime`, parsed)
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
      }else{
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
    }
  x
    render(){
      return (
        <div class="App-card">
          <Container text>
            <Grid stackable columns={2}>
              <Grid.Row>
                  <Grid.Column>
                    <Segment>
                        <Image fluid src={this.state.image} onClick={()=>{window.location.reload()}} />
                    </Segment>
                  </Grid.Column>
                  <Grid.Column>
                    <Segment>
                      <h1>{this.state.title}</h1>
                      <Card.Meta>
                        <span className='date'>{this.state.aired}</span>
                      </Card.Meta>
                      <Card.Description>
                        {this.state.description}
                      </Card.Description>
                    </Segment>
                  </Grid.Column>
                </Grid.Row>
            </Grid>
            
            <Grid stackable columns={1}>
              <GridColumn>
                <div class="refresh-button">
                  <Button onClick={()=>{window.location.reload()}}>gimme a new one</Button>
                  </div>
              </GridColumn>
            </Grid>
            
            </Container>
          </div>
        );
      }
  }

export default RandomAnime;