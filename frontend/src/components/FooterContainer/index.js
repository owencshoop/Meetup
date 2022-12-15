import OpenCreateGroupModal from "./OpenCreateGroupModal";
import CreateGroupModalForm from "../CreateGroupFormModal";
import './FooterContainer.css'

const FooterContainer = () => {
  return (
    <div className="footer-container">
      <OpenCreateGroupModal
        itemText="Start a new group"
        modalComponent={<CreateGroupModalForm />}
      />
    </div>
  );
};

export default FooterContainer
