import "antd/dist/antd.css";
import { createBrowserHistory } from "history";
import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import FlavorForm from "./Component/Pagetest/Pagetest";

const customHistory = createBrowserHistory();

class App extends React.Component {
  render() {
    return (
      <Router history={customHistory}>
        <Switch>
          <Route exact path="/" component={FlavorForm} />
        </Switch>
      </Router>
    );
  }
}
export default App;
