import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getEventThunk } from "../../store/events";
import { deleteEventThunk } from "../../store/events";
import { getGroupThunk } from "../../store/groups";
import "./EventShow.css";

const EventShow = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const event = useSelector((state) => state.events.singleEvent);
  const groupId = event.Group?.id;
  const group = useSelector((state) => state.groups.singleGroup);
  const history = useHistory();

  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  const startDate = new Date(event.startDate)
  const startDay = startDate.toLocaleDateString(undefined, options)
  const startTime = startDate.toLocaleTimeString('en-Us')
  const endDate = new Date(event.endDate)
  const endDay = endDate.toLocaleDateString(undefined, options)
  const endTime = endDate.toLocaleTimeString('en-US')

  useEffect(() => {
    dispatch(getEventThunk(eventId));
  }, [dispatch, eventId]);

  useEffect(() => {
    if (groupId) dispatch(getGroupThunk(groupId)).then(() => setIsLoaded(true));
  }, [dispatch, groupId]);

  const handleEventDelete = (e, eventId) => {
    e.preventDefault();
    dispatch(deleteEventThunk(eventId)).then(history.push("/events"));
  };

  return (
    <div>
      {isLoaded && (
        <div className="event-show-container">
          <div className="event-show-header-container">
            <div className="event-show-title">{event.name}</div>
            <div className="event-show-header-organizer">
              Hosted By
              <p id="event-show-organizer">
                {group.Organizer.firstName}{" "}
                {group.Organizer.lastName[0].toUpperCase()}.
              </p>
            </div>
          </div>
          <div className="event-show-body-container">
            <div className="event-show-body-left-container">
              <div className="event-show-image-container">
                <img
                  className="event-show-image"
                  src={`${event.EventImages[0]?.url}`}
                  alt={`${event.name} Preview'`}
                ></img>
              </div>
              <div className="event-show-description">
                <h2>Details</h2>
                <div className="event-show-description-item">
                  {event.description}
                </div>
                <div className="event-show-description-item">
                  Type: {event.type}
                </div>
                <div className="event-show-description-item">
                  Price: ${event.price}.00
                </div>
                <div className="event-show-description-item">
                  Capacity: {event.capacity}
                </div>
                <div className="event-show-description-item">
                  Attending: {event.numAttending}
                </div>
              </div>
            </div>
            <div className="event-show-body-right-container">
              <div className="event-show-group-container">
                <div className="event-show-group-image-container">
                  <img
                    className="event-show-group-image"
                    src={`${group?.GroupImages[0].url}`}
                    alt={`${group?.name}'s Preview`}
                  ></img>
                </div>
                <div className="event-show-group-info-container">
                  <div className="event-show-group-title">
                    {event.Group?.name}
                  </div>
                  <div className="event-show-group-type">
                    {event.Group?.private ? "Private" : "Public"} group
                  </div>
                </div>
              </div>
              <div className="event-show-date-location-container">
                <div className="event-show-date">
                  <div className="event-show-date-logo">
                    <i
                      class="fa-solid fa-clock"
                      style={{ color: "#757575" }}
                    ></i>
                  </div>
                  <div>
                    {startDay} at {startTime} to {endDay} at {endTime}
                  </div>
                </div>
                <div className="event-show-address">
                  <div className="event-show-address-logo">
                    <i
                      class="fa-solid fa-location-dot"
                      style={{ color: "#757575" }}
                    ></i>
                  </div>
                  <div className="event-show-address">
                    {event.Venue?.address} {event.Venue?.city},{" "}
                    {event.Venue?.state}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="delete-event-button">
            <button onClick={(e) => handleEventDelete(e, event.id)}>
              Delete Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventShow;
