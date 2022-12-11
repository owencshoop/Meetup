import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getEventThunk } from "../../store/events";

const EventShow = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const { eventId } = useParams();
  const event = useSelector((state) => state.events.singleEvent);
  useEffect(() => {
    dispatch(getEventThunk(eventId)).then(() => setIsLoaded(true));
  }, [dispatch, eventId]);
  return (
    <div>
      {isLoaded && (
        <div>
          <img
            src={event.EventImages ? `${event.EventImages[0].url}` : ""}
            alt={`${event.name} Preview'`}
          ></img>
          <li>Event Id: {event.id}</li>
          <li>Name: {event.name}</li>
          <li>Description: {event.description}</li>
          <li>Attending: {event.numAttending}</li>
          <li>Capacity: {event.capacity}</li>
          <li>Price: {event.price}</li>
          <li>Time: {event.startDate} - {event.EndDate}</li>
          <li>
            Venue Address: {event.Venue.address} {event.Venue.city},{" "}
            {event.Venue.state}
          </li>
          <li>Type: {event.type}</li>
          <li>{event.private ? "Private" : "Public"}</li>
          <ul>
            Group:
            <li>Name: {event.Group.name}</li>
            <li>{event.Group.private ? "Private" : "Public"}</li>
            <li>
              Location: {event.Group.city}, {event.Group.state}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default EventShow;
