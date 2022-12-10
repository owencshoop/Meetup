import { useSelector } from "react-redux";

const EventGroupList = ({ eventGroup }) => {
  const groups = useSelector((state) => Object.values(state.groups.allGroups));
  const groupList = Array.from(groups);
  return (
    <div>
      {groupList.map((group) => {
        return (
          <div key={group.id} style={{border: "5px solid purple"}}>
            {group.name}
            <ul>
                <li>Id: {group.id}</li>
                <li>Organizer: {group.organizerId}</li>
                <li>About: {group.about}</li>
                <li>Location: {group.city}, {group.state}</li>
                <li>Type: {group.type}</li>
                <li>Private: {`${group.private}`}</li>
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default EventGroupList;

// id, organizerId, name, about, city, state, type, private
