import { useDispatch, useSelector } from "react-redux";
import { deleteGroupThunk } from "../../store/groups";

const EventGroupList = ({ eventgroup }) => {
  const groups = useSelector((state) => Object.values(state.groups.allGroups));
  const groupList = Array.from(groups);
  const events = useSelector((state) => Object.values(state.events.allEvents));
  const eventList = Array.from(events);

  const dispatch = useDispatch()

  const handleDelete = (e, groupId) => {
    e.preventDefault()
    dispatch(deleteGroupThunk(groupId))
  }

  let content;
  if (eventgroup === "groups") {
    content = groupList.map((group) => {
      return (
        <div key={group.id} style={{ border: "5px solid purple", margin:'5px auto', boxSizing:'border-box'}}>
          <ul>
            <img
              src={`${group.previewImage}`}
              alt={`${group.name}'s Preview`}
            ></img>
            <li>UpdatedAt: {group.updatedAt}</li>
            <li>CreatedAt: {group.createdAt}</li>
            <li>Name: {group.name}</li>
            <li>
              Location: {group.city}, {group.state}
            </li>
            <li>About: {group.about}</li>
            <li>numMembers: {group.numMembers}</li>
            <li>Private: {group.private ? "Private" : "Public"}</li>
             {/* <li>Share: </li> // TODO - Share icon in bottom right corner*/}
          </ul>
          <button onClick={(e) => handleDelete(e, group.id)}>Delete Group</button>
        </div>
      );
    });
  } else if (eventgroup === "events") {
    content = eventList.map((event) => {
      return (
        <div key={event.id} style={{ border: "5px solid purple", margin:'5px auto',}}>
          <ul>
            <img
              src={`${event.previewImage}`}
              alt={`${event.name}'s Preview`}
            ></img>
            <li>{event.type === "Online" ? "Online Event" : null}</li>
            <li>Date: {event.startDate}</li>
            <li>Name: {event.name}</li>
            <li>Group: {event.Group.name}</li>
            <li>Location: {event.Group.city}, {event.Group.state}</li>
            {/* <li>Group updated/created at</li>  // TODO - need for 'New Group' addition on newer groups and will have to update api docs and backend */}
            <li>numAttending: {event.numAttending}</li>
            {/* <li>Share: </li> // TODO - Share icon in bottom right corner
            <li>Favorite/Unfavorite </li> // TODO - favorite/unfavorite star in bottom right */}
          </ul>
        </div>
      );
    });
  }

  return <div>{content}</div>;
};

export default EventGroupList;

// id, organizerId, name, about, city, state, type, private
