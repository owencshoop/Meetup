import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import BodyContainer from "./components/BodyContainer";
import FooterContainer from "./components/FooterContainer";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="app-div">
      <Navigation isLoaded={isLoaded} />
      <BodyContainer />
      <FooterContainer />
      {/* {isLoaded && <Switch></Switch>} */}
    </div>
  );
}

export default App;
