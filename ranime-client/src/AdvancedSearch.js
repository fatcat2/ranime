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
  Dropdown,
  Header,
  Divider,
} from "semantic-ui-react";
import { Link } from "react-router-dom";

import axios from "axios";

var rangeInclusive = require('range-inclusive')

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

class AdvancedSearch extends React.Component {
  constructor() {
    super();
    this.state = {
      nsfw: 0,
      year: 1950,
      link: "/anime",
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e, d) {
    console.log(d.value);

    if (d.name === "nsfw") {
      this.setState({ nsfw: d.value });
      let link = `/anime?nsfw=${d.value}&seasonYear=${this.state.year}`;
      this.setState({ link: link });
    }else if (d.name === "seasonYear") {
        this.setState({ year: d.value });
        let link = `/anime?nsfw=${this.state.nsfw}&seasonYear=${d.value}`;
        this.setState({ link: link });
      }
  }

  

  render() {
    var year;
    var yearOptions = []
    var years = rangeInclusive(1950, 2020)
    years.reverse()
    for(year in years){
        yearOptions.push(
            {
                key: parseInt(years[year]),
                text: parseInt(years[year]),
                value: parseInt(years[year]),
            }
        )
    }

    console.log(yearOptions)
    return (
      <Grid centered columns={1}>
        <Grid.Column>
          <div class="App-header">
            <Container>
              <Header as="h1" color="black">
                /advanced
              </Header>

              <Link to="/anime">
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
            <Divider />
            <Container text>
              <p>
                Show me shows from year {" "}
                <Dropdown
                  name="seasonYear"
                  search
                  options={yearOptions}
                  defaultValue={yearOptions[0].value}
                  onChange={this.onChange}
                />.
              </p>
            </Container>
          </div>
        </Grid.Column>
      </Grid>
    );
  }
}

export default AdvancedSearch;
