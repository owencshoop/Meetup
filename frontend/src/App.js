import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import BodyContainer from "./components/BodyContainer";
import FooterContainer from "./components/FooterContainer";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="app-div">
      {/* <Navigation isLoaded={isLoaded} />
      <FooterContainer /> */}
      {isLoaded && <Switch>
          <Route exact path='/'>
            <Navigation isLoaded={isLoaded} />
            <div>Splash page is currently under construction. Thank you for your patience!</div>
            {/* <FooterContainer /> */}
          </Route>
          <Route path={['/groups', '/events']}>
            <Navigation isLoaded={isLoaded} />
            <BodyContainer />
            <FooterContainer />
          </Route>
          <Route path='/groups/:groupId'>
            <Navigation isLoaded={isLoaded} />
            <FooterContainer />
          </Route>
        </Switch>}
    </div>
  );
}

export default App;
