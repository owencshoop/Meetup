import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getGroupThunk } from "../../store/groups";

const GroupShow = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const group = useSelector((state) => state.groups.singleGroup);
  useEffect(() => {
    dispatch(getGroupThunk(groupId)).then(()=> setIsLoaded(true));
  }, [dispatch, groupId]);
  return (
    <div>
      {isLoaded && (
        <div>
          <img
            src={group.GroupImages ? `${group.GroupImages[0].url}` : ""}
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
        </div>
      )}
    </div>
  );
};

export default GroupShow;
