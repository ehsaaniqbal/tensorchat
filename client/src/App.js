import React from "react";
import "./assets/css/App.css";
import "./assets/css/blk-design-system-react.css.map";
import "./assets/css/blk-design-system-react.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./containers/Home.jsx";
import CreateRoom from "./containers/CreateRoom";
import Room from "./containers/Room";
const NoMatchPage = () => {
  return (
    <h3>404 - Not found</h3>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/createroom" component={CreateRoom} />
        <Route exact path="/r/:roomname" component={Room} />
        <Route component={NoMatchPage} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
