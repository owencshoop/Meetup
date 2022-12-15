import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { clearGroupState, getGroupThunk } from "../../store/groups";
import { deleteGroupThunk } from "../../store/groups";
import CreateEventFormModal from "../CreateEventFormModal";
import EditGroupFormModal from "../EditGroupFormModal";
import OpenCreateEventModal from "./OpenCreateEventModal";
import OpenEditGroupFormModal from "./OpenEditGroupModal";
import "./GroupShow.css";

const GroupShow = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const dispatch = useDispatch();
  const { groupId } = useParams();
  const group = useSelector((state) => state.groups.singleGroup);
  const history = useHistory();

  useEffect(() => {
    dispatch(getGroupThunk(groupId)).then(() => setIsLoaded(true));

    return (
      () => dispatch(clearGroupState())
    )
  }, [dispatch, groupId]);

  const handleGroupDelete = async (e, groupId) => {
    e.preventDefault();
    const response = await dispatch(deleteGroupThunk(groupId));
    if (response.message === "Successfully deleted"){
      history.push("/groups");
    }else {
      window.alert('Not authorized to delete')
    }
  };

  return (
    <div className="group-show-container">
      {isLoaded ? (
        <>
          <div className="group-show-image-name-container">
            <div className="group-show-image-container">
              <img
                className="group-show-image"
                src={
                  group.GroupImages.length > 0
                    ? `${group.GroupImages[0].url}`
                    : ""
                }
                alt={`${group.name}'s Preview'`}
              ></img>
            </div>
            <div className="group-show-name-container">
              <h1 className="group-show-name">{group.name}</h1>
              <div className="group-show-location-members-organizer">
                <div className="group-show-name-content">
                  <div className="group-show-name-icons">
                    <i className="fa-solid fa-location-dot"></i>
                  </div>
                  <div>
                    {group.city}, {group.state}
                  </div>
                </div>
                <div className="group-show-name-content">
                  <div className="group-show-name-icons">
                    <i className="fa-solid fa-user-group"></i>
                  </div>
                  <div>
                    {group.numMembers}{" "}
                    {group.numMembers > 1 ? "members" : "member"} •{" "}
                    {group.private ? "Private" : "Public"} group{" "}
                  </div>
                </div>
                <div className="group-show-name-content">
                  <div className="group-show-name-icons">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div>
                    Organized by{" "}
                    <span className="group-show-name-organizer">
                      {group.Organizer.firstName} {group.Organizer.lastName}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="group-show-body-container">
            <div className="group-show-about-container">
              <h2 className="group-show-about-title">What we're about</h2>
              <p>{group.about}</p>
            </div>
            <div className="group-show-organizer-member-container">
              <div className="group-show-organizer-container">
                <h3>Organizers</h3>
                <div>
                  {group.Organizer.firstName} {group.Organizer.lastName}
                </div>
              </div>
            </div>
          </div>
          <div className="group-show-button-container">
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
        </>
      ) : <div style={{height:'1000px'}}></div>}
    </div>
  );
};

export default GroupShow;
