import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import BodyContainer from "./components/BodyContainer";
import FooterContainer from "./components/FooterContainer";
import { NavLink, Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import GroupShow from "./components/GroupShow";
import EventShow from "./components/EventShow";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="app-div" style={{position: 'relative'}}>
      {/* <Navigation isLoaded={isLoaded} />
      <FooterContainer /> */}
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <Navigation isLoaded={isLoaded} />
            <div>
              Splash page is currently under construction. Thank you for your
              patience!
            </div>
            <div>
              <NavLink to="/groups">Groups</NavLink>
            </div>
            <div>
              <NavLink to="/events">Events</NavLink>
            </div>
            {/* <FooterContainer /> */}
          </Route>
          <Route exact path={["/groups", "/events"]}>
            <Navigation isLoaded={isLoaded} />
            <BodyContainer />
            <FooterContainer />
          </Route>
          <Route path="/groups/:groupId">
            <Navigation isLoaded={isLoaded} />
            <GroupShow />
            <FooterContainer />
          </Route>
          <Route path='/events/:eventId'>
            <Navigation isLoaded={isLoaded} />
            <EventShow />
            <FooterContainer />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
