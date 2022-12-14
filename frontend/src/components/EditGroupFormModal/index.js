import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { editGroupThunk, getGroupThunk } from "../../store/groups";
import "./EditGroupFormModal.css";

function EditGroupFormModal({ group }) {
  const dispatch = useDispatch();
  const [name, setName] = useState(group.name);
  const [about, setAbout] = useState(group.about);
  const [type, setType] = useState(group.type);
  const [_private, setPrivate] = useState(group.private);
  const [city, setCity] = useState(group.city);
  const [state, setState] = useState(group.state);
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);
    return dispatch(
      editGroupThunk(
        {
          name,
          about,
          type,
          private: _private,
          city,
          state,
        },
        group.id
      )
    )
      .then((group) => dispatch(getGroupThunk(group.id)))
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
        <h1 className="modal-form-title">Create A Group</h1>
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
          <label htmlFor="name" className="form-input-item-label">
            Name:
          </label>
          <input
            className="form-input-item"
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
          <label htmlFor="about" className="form-input-item-label">
            About:
          </label>
          <input
            className="form-input-item"
            id="about"
            type="text"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            required
          />
          <label htmlFor="type" className="form-input-item-label">
            Type:
          </label>
          <select
            className="form-input-item"
            name="type"
            onChange={(e) => setType(e.target.value)}
            value={type}
          >
            <option value="In person" className="form-input-item">
              In person
            </option>
            <option value="Online" className="form-input-item">
              Online
            </option>
          </select>
          <label htmlFor="city" className="form-input-item-label">
            City:
          </label>
          <input
            className="form-input-item"
            id="city"
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
            required
          />
          <label htmlFor="state" className="form-input-item-label">
            State:
          </label>
          <input
            className="form-input-item"
            id="state"
            type="text"
            onChange={(e) => setState(e.target.value)}
            value={state}
            required
          />
          <div className="form-input-item-checkbox-container">
            <div className="form-input-item-label-checkbox">Private?</div>
            <input
              className="form-input-item-checkbox"
              type="checkbox"
              id="private"
              name="private"
              value={_private}
              checked={_private ? "checked" : ""}
              onChange={(e) => {
                setPrivate(_private === false);
              }}
            ></input>
          </div>
          <button type="submit" className="form-button">Update Group</button>
        </form>
      </div>
    </div>
  );
}

export default EditGroupFormModal;
