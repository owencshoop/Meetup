import OpenCreateGroupModal from "./OpenCreateGroupModal";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import CreateGroupModalForm from "../CreateGroupFormModal";
import OpenModalFooterItem from "./OpenModalFooterItem";
import "./FooterContainer.css";
import { useSelector } from "react-redux";

const FooterContainer = () => {
  const user = useSelector((state) => state.session.user);

  return (
    <div className="footer-container">
      {user ? (
        <div className="footer-button-container">
          <OpenCreateGroupModal
            itemText="Start a new group"
            modalComponent={<CreateGroupModalForm />}
          />
        </div>
      ) : (
        <div className="footer-button-container">
          <div className="footer-login-signup-button-container">
            <OpenModalFooterItem
              className="footer-modal-button"
              itemText="Log In"
              // onItemClick={closeMenu}
              modalComponent={<LoginFormModal />}
            />
            <OpenModalFooterItem
              className="footer-modal-button"
              itemText="Sign Up"
              // onItemClick={closeMenu}
              modalComponent={<SignupFormModal />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FooterContainer;
