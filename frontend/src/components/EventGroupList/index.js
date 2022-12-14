import { useSelector } from "react-redux";
// import { deleteGroupThunk } from "../../store/groups";
// import { deleteEventThunk } from "../../store/events";
import { Link } from "react-router-dom";
import "./EventGroupList.css";

const EventGroupList = ({ eventgroup }) => {
  const groups = useSelector((state) => Object.values(state.groups.allGroups));
  const groupList = Array.from(groups);
  const events = useSelector((state) => Object.values(state.events.allEvents));
  const eventList = Array.from(events);

  // const dispatch = useDispatch()

  // const handleGroupDelete = (e, groupId) => {
  //   e.preventDefault()
  //   dispatch(deleteGroupThunk(groupId))
  // }

  // const handleEventDelete = (e, eventId) => {
  //   e.preventDefault()
  //   dispatch(deleteEventThunk(eventId))
  // }

  // const handleGroupOnClick =() => {

  // }

  let content;
  if (eventgroup === "groups") {
    content = groupList.map((group) => {
      return (
        <div key={group.id} className="group-list-item">
          <div className="group-list-image-container">
            <img
              className="group-list-image"
              src={`${group.previewImage}`}
              alt={`${group.name}'s Preview`}
            ></img>
          </div>
          <div className="group-list-content-container">
            <div className="group-name-location-container">
              {/* <h2>New Group {group.updatedAt} {group.createdAt}</h2> */}
              <h2 className="group-list-name">
                <Link className="group-list-name" to={`/groups/${group.id}`}>
                  {group.name}
                </Link>
              </h2>
              <h3 className="group-list-location">
                {group.city}, {group.state}
              </h3>
            </div>
            <p class="group-description">{group.about}</p>
            <div className="group-members-private-container">
              <div>
                {group.numMembers} {group.numMembers > 1 ? "members" : "member"}{" "}
                • {group.private ? "Private" : "Public"}
              </div>
              <div>
                <i class="fa-solid fa-arrow-up-from-bracket"></i>
              </div>
            </div>
            {/* <li>Share: </li> // TODO - Share icon in bottom right corner*/}
          </div>
        </div>
      );
    });
  } else if (eventgroup === "events") {
    content = eventList.map((event) => {
      return (
        <div key={event.id} className="event-list-item">
          <div className="event-list-image-container">
            <img
              className="event-list-image"
              src={`${event.previewImage}`}
              alt={`${event.name}'s Preview`}
            ></img>
          </div>
          <div className="event-list-content-container">
            <div className="event-list-content-top">
              <div className="event-list-start-date">{event.startDate}</div>
              <h2 className="event-list-name">
                <Link className="event-list-name" to={`/events/${event.id}`}>
                  {event.name}
                </Link>
              </h2>
              <div className="event-list-group-location">
                {event.Group?.name} · {event.Group?.city}, {event.Group?.state}
              </div>
            </div>
            <div className="event-list-attending-share-container">
              <div className="event-list-num-attending">
                {event.numAttending}{" "}
                {event.numAttending > 1 ? "attendees" : "attendee"}
              </div>
              <div className="event-list-share-favorite-container">
                <i class="fa-solid fa-arrow-up-from-bracket"></i>{" "}
                {/* <i class="fa-regular fa-star"></i> */}
              </div>
            </div>
          </div>
          {/* <li>{event.type === "Online" ? "Online Event" : null}</li> */}
          {/* <li>Group updated/created at</li>  // TODO - need for 'New Group' addition on newer groups and will have to update api docs and backend */}
        </div>
      );
    });
  }

  return <div className={`${eventgroup}-list-container`}>{content}</div>;
};

export default EventGroupList;

// id, organizerId, name, about, city, state, type, private
