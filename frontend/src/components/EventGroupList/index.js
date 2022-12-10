import { useSelector } from "react-redux";

const EventGroupList = ({eventgroup}) => {
  const groups = useSelector((state) => Object.values(state.groups.allGroups));
  const groupList = Array.from(groups);
  let content
  if (eventgroup === 'groups') {
    content = groupList.map((group) => {
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
      })
  } else {
    content = <div>Events page is under construction</div>
  }


  return (
    <div>
        {content}
    </div>
  );
};

export default EventGroupList;

// id, organizerId, name, about, city, state, type, private
