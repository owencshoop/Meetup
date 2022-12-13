import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { addEventThunk } from "../../store/events";

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
          endDate
        },
        group.id
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
    <div style={{ border: "3px solid yellow" }}>
      <h1>Create an Event</h1>
      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          border: "2px solid red",
          flexDirection: "column",
        }}
      >
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          Name:
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </label>
        <label htmlFor="about">
          Description:
          <input
            id="about"
            type="text"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          />
        </label>
        <label htmlFor="type">
          Type:
          <select
            name="type"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
        </label>
        <label htmlFor="venueId">
          Venue:
          <select
            name="venueId"
            onChange={(e) => setVenueId(e.target.value)}
            value={venueId}
          >
            <option selected disabled>
              Select a venue
            </option>
            {group.Venues?.map((venue) => {
              return (
                <option value={`${venue.id}`}>
                  {venue.address}, {venue.city}, {venue.state}
                </option>
              );
            })}
          </select>
        </label>
        <label htmlFor="city">
          Capacity:
          <input
            id="city"
            type="text"
            onChange={(e) => setCapacity(e.target.value)}
            value={capacity}
            required
          />
        </label>
        <label htmlFor="state">
          Price:
          <input
            id="state"
            type="text"
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            required
          />
        </label>
        <label htmlFor="startDate">
          Start Date:
          <input
            id="startDate"
            type="datetime-local"
            onChange={(e) => setStartDate(e.target.value)}
            value={startDate}
            required
          />
        </label>
        <label htmlFor="endDate">
          End Date:
          <input
            id="endDate"
            type="datetime-local"
            onChange={(e) => setEndDate(e.target.value)}
            value={endDate}
            required
          />
        </label>
        <button type="submit">Create Event</button>
      </form>
    </div>
  );
}

export default CreateEventFormModal;
