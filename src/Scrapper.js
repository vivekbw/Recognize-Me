import React, { Component } from "react";
import rp from "request-promise";
import cheerio from "cheerio";

import "./App.css";

class Scrapper extends Component {
  state = { names: [] };

  componentDidMount() {
    // use the request-promise library to fetch the HTML from pokemon.org
    rp("https://pokedex.org/")
      .then((html) => {
        let names = [];
        let $ = cheerio.load(html);

        // find what element ids, classes, or tags you want from opening console in the browser
        // cheerio library lets you select elements similar to querySelector
        $("#monsters-list li span").each(function (i, element) {
          let name = $(this).prepend().text();
          names.push(name);
        });

        this.setState({ names });
      })
      .catch(function (err) {
        console.log("crawl failed");
      });
  }

  render() {
    return (
      <div>
        <ul>
          {this.state.names.map((name) => {
            return <li key={name}>{name}</li>;
          })}
        </ul>
      </div>
    );
  }
}

export default Scrapper;
