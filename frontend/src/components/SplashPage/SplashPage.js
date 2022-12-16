import { NavLink } from "react-router-dom";
import "./SplashPage.css";

function SplashPage() {
  const startDate = new Date("12/12/2022");
  const todayDate = new Date(Date.now());
  const oneDay = 1000 * 60 * 60 * 24;
  const differenceInTime = todayDate.getTime() - startDate.getTime();
  const differenceInDays = Math.round(differenceInTime / oneDay);
  return (
    <div className="splash-page-body">
      <div className="splash-page-content-container">
        <div className="splash-page-content-left-container">
          <h1 className="splash-page-title">
            Celebrating {differenceInDays} days of fake connections on
            down2meet!
          </h1>
          <p className="splash-page-description">
            Whatever you're looking to do this year, down2meet probably can't
            help. For {differenceInDays} days, people have kind of been able to
            use down2meet to make friends, find support, grow a business, and
            explore their interests. A few events are happening -- Join the fun!
          </p>
        </div>
        <div className="splash-page-content-right-container">
          <img
            className="splash-page-img"
            src="https://secure.meetupstatic.com/next/images/shared/online_events.svg?w=640"
            alt="Splash Page"
          ></img>
        </div>
      </div>
      <div className="splash-page-button-container">
        <NavLink to="/groups" className="splash-page-button">
          All Groups
        </NavLink>
        <NavLink to="/events" className="splash-page-button">
          All Events
        </NavLink>
      </div>
    </div>
  );
}

export default SplashPage;
