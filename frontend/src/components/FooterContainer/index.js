import OpenCreateGroupModal from "./OpenCreateGroupModal";
import CreateGroupModalForm from "../CreateGroupFormModal";

const FooterContainer = () => {
  return (
    <div style={{border:'5px solid magenta', display:'flex', justifyContent:'center', margin:'10px auto'}}>
      <OpenCreateGroupModal
        itemText="Create a Group"
        modalComponent={<CreateGroupModalForm />}
      />
    </div>
  );
};

export default FooterContainer
