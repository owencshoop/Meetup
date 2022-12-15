import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalMenuItem from "./OpenModalMenuItem";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import { NavLink } from "react-router-dom";

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener("click", closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    closeMenu();
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  if (user) {
    return (
      <div className="profile-menu-dropdown">
        <div className="profile-button-selection" onClick={openMenu}>
          <div className="profileButton">{user.firstName[0].toUpperCase()}</div>
          <div>
            {showMenu ? (
              <i class="fa-solid fa-angle-up"></i>
            ) : (
              <i class="fa-solid fa-angle-down"></i>
            )}
          </div>
        </div>
        <div className={ulClassName} ref={ulRef}>
          <div className="profile-menu-group-event">
            <NavLink className="profile-menu-button" to="/groups">
              All Groups
            </NavLink>
            <NavLink className="profile-menu-button" to="/events">
              All Events
            </NavLink>
          </div>
          <div className="profile-menu">
            <div>username: {user.username}</div>
            <div>
              name: {user.firstName} {user.lastName}
            </div>
            <div>email: {user.email}</div>
            <div>
              <button onClick={logout}>Log Out</button>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="logout-profile-menu">
        <OpenModalMenuItem
          itemText="Log In"
          onItemClick={closeMenu}
          modalComponent={<LoginFormModal />}
        />
        <OpenModalMenuItem
          itemText="Sign Up"
          onItemClick={closeMenu}
          modalComponent={<SignupFormModal />}
        />
      </div>
    );
  }

  // <div className="profile-menu-dropdown">
  //   <div className="profile-button-selection" onClick={openMenu}>
  //     <div className="profileButton">
  //       {user ? (
  //         user.firstName[0].toUpperCase()
  //       ) : (
  //         <i className="fas fa-user-circle" />
  //       )}
  //     </div>
  //     <div>
  //       {showMenu ? (
  //         <i class="fa-solid fa-angle-up"></i>
  //       ) : (
  //         <i class="fa-solid fa-angle-down"></i>
  //       )}
  //     </div>
  //   </div>
  //   <div className={ulClassName} ref={ulRef}>
  //     {user ? (
  //       <div className="profile-menu">
  //         <div>{user.username}</div>
  //         <div>
  //           {user.firstName} {user.lastName}
  //         </div>
  //         <div>{user.email}</div>
  //         <div>
  //           <button onClick={logout}>Log Out</button>
  //         </div>
  //       </div>
  //     ) : (
  //       <div className="profile-menu">
  //         <OpenModalMenuItem
  //           itemText="Log In"
  //           onItemClick={closeMenu}
  //           modalComponent={<LoginFormModal />}
  //         />
  //         <OpenModalMenuItem
  //           itemText="Sign Up"
  //           onItemClick={closeMenu}
  //           modalComponent={<SignupFormModal />}
  //         />
  //       </div>
  //     )}
  //   </div>
  // </div>
}

export default ProfileButton;
