import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";
import { deleteGroupThunk } from "../../store/groups";
import CreateEventFormModal from "../CreateEventFormModal";
import EditGroupFormModal from "../EditGroupFormModal";
import OpenCreateEventModal from "./OpenCreateEventModal";
import OpenEditGroupFormModal from "./OpenEditGroupModal";
import './GroupShow.css'

const GroupShow = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const group = useSelector((state) => state.groups.singleGroup);
  const history = useHistory();

  useEffect(() => {
    dispatch(getGroupThunk(groupId)).then(() => setIsLoaded(true));
  }, [dispatch, groupId]);

  const handleGroupDelete = (e, groupId) => {
    e.preventDefault();
    dispatch(deleteGroupThunk(groupId));
    history.push("/groups");
  };

  return (
    <div>
      {isLoaded && (
        <div>
          <img
            src={
              group.GroupImages.length > 0 ? `${group.GroupImages[0].url}` : ""
            }
            alt={`${group.name}'s Preview'`}
          ></img>
          <li>Id: {group.id}</li>
          <li>Name: {group.name}</li>
          <li>Description: {group.about}</li>
          <li>
            Organizer: {group.Organizer.firstName} {group.Organizer.lastName}
          </li>
          <li>
            Location: {group.city}, {group.state}
          </li>
          <li>{group.type}</li>
          <li>Members: {group.numMembers}</li>
          <li>{group.private ? "Private" : "Public"}</li>
          <button onClick={(e) => handleGroupDelete(e, group.id)}>
            Delete Group
          </button>
          <div>
            <OpenEditGroupFormModal
              itemText="Edit Group"
              modalComponent={<EditGroupFormModal group={group} />}
            />
          </div>
          <div>
            <OpenCreateEventModal
              itemText="Create an Event"
              modalComponent={<CreateEventFormModal group={group} />}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupShow;
