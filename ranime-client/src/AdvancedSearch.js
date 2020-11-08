import React from 'react';
import './App.css';
import { Card, Image, Container, Grid, Button, Segment, GridColumn, Dropdown, Header, Divider } from 'semantic-ui-react'
import { Link } from "react-router-dom";

import axios from 'axios';


const nsfwOptions = [
    {
      key: 'sfw',
      text: 'only SFW',
      value: 0
    },
    {
      key: 'nsfw',
      text: 'only NSFW',
      value: 1
    },
    {
      key: 'both',
      text: 'SFW and NSFW',
      value: 2
    },
  ]
  

class AdvancedSearch extends React.Component {
    constructor(){
      super();
      this.state = {
        "nsfw": 0,
        "link": "/anime"
      }
      this.onChange = this.onChange.bind(this)
    }
  
    onChange(e, d){
      console.log(d.value)
  
      if(d.name === "nsfw"){
        this.setState({"nsfw": d.value})
        let link = `/anime?nsfw=${d.value}`
        this.setState({"link": link})
      }
    }
  
    render(){
      return (
          <Grid centered columns={1}>
              <Grid.Column>
                <div class="App-header">
                  <Container>
                    <Header as="h1" color="black">
                      {this.state.link}
                    </Header>
  
                    <Link to="/anime">
                      <Button color="blue">
                        Give me a show!
                      </Button>
                    </Link>
                    </Container>
                    <Divider />
                    <Container text>
                    <p>
                      Show me {' '}
                      <Dropdown
                        name="nsfw"
                        inline
                        options={nsfwOptions}
                        defaultValue={nsfwOptions[0].value}
                        text={nsfwOptions[0].text}
                        onChange={this.onChange}
                      />
                      shows.
                    </p>
                  </Container>
                </div>
              </Grid.Column>
          </Grid>
        );
      }
  }

export default AdvancedSearch;