import React from "react";
import "./App.css";
import {
  Container,
  Header,
  Grid,
  Button,
  Dropdown,
  Divider,
} from "semantic-ui-react";

import { Link } from "react-router-dom";

const nsfwOptions = [
  {
    key: "sfw",
    text: "only SFW",
    value: 0,
  },
  {
    key: "nsfw",
    text: "only NSFW",
    value: 1,
  },
  {
    key: "both",
    text: "SFW and NSFW",
    value: 2,
  },
];

class Home extends React.Component {
  constructor() {
    super();
    this.state = {
      nsfw: 0,
      link: "/anime",
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, d) {
    console.log(d.value);

    if (d.name === "nsfw") {
      this.setState({ nsfw: d.value });
      let link = `/anime?nsfw=${d.value}`;
      this.setState({ link: link });
    }
  }

  render() {
    return (
      <Grid centered columns={1}>
        <Grid.Column>
          <div class="App-header">
            <Container>
              <Header as="h1" color="black">
                random anime
              </Header>
              <Link to={this.state.link}>
                <Button color="blue">Give me a show!</Button>
              </Link>
            </Container>
            <Divider />
            <Container text>
              <p>
                Show me{" "}
                <Dropdown
                  name="nsfw"
                  inline
                  options={nsfwOptions}
                  defaultValue={nsfwOptions[0].value}
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

export default Home;
