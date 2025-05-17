import "./App.css";
import { Switch, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Home from "./components/Home";

function App() {
  return (
    <>
      <Switch>
        <Route exact path="/" component={Landing} />
        <Home />
      </Switch>
    </>
  );
}

export default App;
