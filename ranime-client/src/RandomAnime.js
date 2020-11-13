import React from "react";
import "./App.css";
import {
  Card,
  Image,
  Container,
  Grid,
  Button,
  Segment,
  GridColumn,
} from "semantic-ui-react";

import axios from "axios";
import queryString from "query-string";

const color_dict = {
  "Netflix": "red",
  "Hulu": "olive",
  "Crunchyroll": "orange",
  "HBO Max": "purple",
  "Funimation": "violet",
  "Twitter": "twitter",
  "Amazon": "brown",
  "VRV": "yellow"
}

class RandomAnime extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: 0,
      name: "",
      title: "Loading...",
      genres: [],
      image: "https://media1.giphy.com/media/AAmhvrZzLCz1m/giphy.gif",
      description:
        "いづれの御時にか、女御、更衣あまたさぶらひたまひけるなかに、いとやむごとなき際にはあらぬが、すぐれて時めきたまふありけり。はじめより我はと思ひ上がりたまへる御方がた、めざましきものにおとしめ嫉みたまふ。同じほど、それより下臈の更衣たちは、ましてやすからず。朝夕の宮仕へにつけても、人の心をのみ動かし、恨みを負ふ積りにやありけむ、いとあつしくなりゆき、もの心細げに里がちなるを、いよいよあかずあはれなるものに思ほして、人の そし りをもえ憚らせたまはず、世のためしにもなりぬべき御もてなしなり。",
      aired: "Aired in Spring 2020",
      externalLinks: [{"url": "https://torrtle.co", "site": "Netflix"}, {"url": "https://torrtle.co", "site": "Netflix"}]
    };
    this.render=this.render.bind(this);
  }

  componentDidMount() {
    let parsed = queryString.parse(this.props.location.search);
    console.log(parsed);
    if (Object.keys(parsed).length > 0) {
      axios.post(`/data/anime`, parsed).then((res) => {
        const title = res.data.title;
        const genres = res.data.genres;
        const image = res.data.image;
        const description = res.data.description;
        const aired = res.data.aired;
        const externalLinks = res.data.external_links;
        const id = res.data.id;
        this.setState({ title });
        this.setState({ genres });
        this.setState({ image });
        this.setState({ description });
        this.setState({ aired });
        this.setState({ externalLinks });
        this.setState({ id });
      });
    } else {
      axios.get(`/data/anime`).then((res) => {
        const title = res.data.title;
        const genres = res.data.genres;
        const image = res.data.image;
        const description = res.data.description;
        const aired = res.data.aired;
        const externalLinks = res.data.external_links;
        const id = res.data.id;
        this.setState({ title });
        this.setState({ genres });
        this.setState({ image });
        this.setState({ description });
        this.setState({ aired });
        this.setState({ externalLinks });
        this.setState({ id });
      });
    }
  }

  render() {
    var watchButtons = []
    console.log("headsfa")

    for (const [index, value] of this.state.externalLinks.entries()) {
      watchButtons.push(<Card.Meta id="linkButton"><a href={value.url}><Button fluid ui  color={color_dict[value.site]}>{value.site}</Button></a></Card.Meta >)
    }

    return (
      <div class="App-card">
        <Container text>
          <Grid stackable columns={2}>
            <Grid.Row>
              <Grid.Column>
                <Segment>
                  <Image
                    fluid
                    src={this.state.image}
                    onClick={() => {
                      window.location.reload();
                    }}
                  />
                </Segment>
              </Grid.Column>
              <Grid.Column>
                <Segment>
                  <h1>{this.state.title}</h1>
                  <Card.Meta>
                    <span className="date">{this.state.aired}</span>
                  </Card.Meta>
                  <Card.Description id="cardDescription">{this.state.description}</Card.Description>
                  <Card.Meta id="linkButton"><a href={"https://anilist.co/anime/" + this.state.id} ><Button color="blue" fluid ui>{"anilist"}</Button></a></Card.Meta > 
                  {watchButtons}
                </Segment>
              </Grid.Column>
            </Grid.Row>
          </Grid>

          <Grid stackable columns={1}>
            <GridColumn>
              <div class="refresh-button">
                <Button
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  gimme a new one
                </Button>
              </div>
            </GridColumn>
          </Grid>
        </Container>
      </div>
    );
  }
}

export default RandomAnime;
