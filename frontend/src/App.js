import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import BodyContainer from "./components/BodyContainer";
import FooterContainer from "./components/FooterContainer";
import { Route, useHistory } from "react-router-dom";
import { Switch } from "react-router-dom";
import GroupShow from "./components/GroupShow";
import EventShow from "./components/EventShow";
import SplashPage from "./components/SplashPage/SplashPage";



function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const user = useSelector((state) => state.session.user);
  const history = useHistory();

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <div className="app-div" style={{ position: "relative" }}>
      {/* <Navigation isLoaded={isLoaded} />
      <FooterContainer /> */}
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            {user ? history.push("/groups") : ""}
            <Navigation isLoaded={isLoaded} />
            <SplashPage />
            <FooterContainer />
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
          <Route path="/events/:eventId">
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
