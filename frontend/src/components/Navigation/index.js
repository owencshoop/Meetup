import React from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import "./Navigation.css";
import OpenCreateGroupModal from "../FooterContainer/OpenCreateGroupModal";
import CreateGroupModalForm from "../CreateGroupFormModal";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);

  return (
    <nav className="navdiv">
      <div>
        <NavLink className="navigation-logo" exact to="/">
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
