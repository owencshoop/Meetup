import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import CreateGroupModalForm from "../CreateGroupFormModal";
import OpenCreateGroupModal from "./OpenCreateGroupModalHeader";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navdiv">
      <div>
        <NavLink className="navigation-logo" exact to={sessionUser ? '/groups' : '/'}>
          down2meet
        </NavLink>
      </div>
      {isLoaded && (
        <div className="navigation-right-container">
          {sessionUser ? <OpenCreateGroupModal
            itemText="Start a new group - 100% off!"
            modalComponent={<CreateGroupModalForm />}
          /> : <div></div>}
          <ProfileButton user={sessionUser} />
        </div>
      )}
    </nav>
  );
}

export default Navigation;
