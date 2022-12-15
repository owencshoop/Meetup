import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { addEventThunk } from "../../store/events";
import "./CreateEventFormModal.css";

function CreateEventFormModal({ group }) {
  const dispatch = useDispatch();
  const [venueId, setVenueId] = useState();
  const [name, setName] = useState("");
  const [type, setType] = useState("In person");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [url, setUrl] = useState('')
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();
  const history = useHistory();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(
      addEventThunk(
        {
          venueId,
          name,
          type,
          capacity,
          price,
          description,
          startDate,
          endDate,
        },
        group.id,
        url
      )
    )
      .then((data) => history.push(`/events/${data.id}`))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(Object.values(data.errors));
      });
  };

  return (
    <div className="modal-container">
      <div className="close-modal-button-container" onClick={closeModal}>
        <i className="fa-solid fa-x"></i>
      </div>
      <div className="modal-form-container">
        <h1 className="modal-form-title">Create an Event</h1>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label htmlFor="name" className="form-input-item-label">Name:</label>
          <input
            className="form-input-item"
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
          <label htmlFor="about" className="form-input-item-label">Description:</label>
          <input
            className="form-input-item"
            id="about"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
          <label htmlFor="type" className="form-input-item-label">Type:</label>
          <select
            className="form-input-item"
            name="type"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          <label htmlFor="venueId" className="form-input-item-label">Venue:</label>
          <select
            className="form-input-item"
            name="venueId"
            onChange={(e) => setVenueId(e.target.value)}
            value={venueId}
          >
            <option selected disabled className="form-input-item">
              Select a venue
            </option>
            {group.Venues?.map((venue) => {
              return (
                <option value={`${venue.id}`} className="form-input-item">
                  {venue.address}, {venue.city}, {venue.state}
                </option>
              );
            })}
          </select>
          <label htmlFor="city" className="form-input-item-label">Capacity:</label>
          <input
            className="form-input-item"
            id="city"
            type="text"
            onChange={(e) => setCapacity(e.target.value)}
            value={capacity}
            required
          />
          <label htmlFor="state" className="form-input-item-label">Price:</label>
          <input
            className="form-input-item"
            id="state"
            type="text"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            required
          />
          <label htmlFor="url" className="form-input-item-label">Image URL:</label>
          <input
            className="form-input-item"
            id="url"
            type="url"
            onChange={(e) => setUrl(e.target.value)}
            value={url}
            />
          <label htmlFor="startDate" className="form-input-item-label">Start Date:</label>
          <input
            className="form-input-item"
            id="startDate"
            type="datetime-local"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
            required
          />
          <label htmlFor="endDate" className="form-input-item-label">End Date:</label>
          <input
            className="form-input-item"
            id="endDate"
            type="datetime-local"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
            required
          />
          <button type="submit"  className="form-button">Create Event</button>
        </form>
      </div>
    </div>
  );
}

export default CreateEventFormModal;
