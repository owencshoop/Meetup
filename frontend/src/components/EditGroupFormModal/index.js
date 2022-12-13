import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { editGroupThunk } from "../../store/groups";

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
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(Object.values(data.errors));
      });
  };

  return (
    <div style={{ border: "3px solid yellow" }}>
      <h1>Create A Group</h1>
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
          About:
          <input
            id="about"
            type="text"
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            required
          />
        </label>
        <select
          name="type"
          onChange={(e) => setType(e.target.value)}
          value={type}
        >
          <option value="In person">In person</option>
          <option value="Online">Online</option>
        </select>
        <label htmlFor="private">
          Private?
          <input
            type="checkbox"
            id="private"
            name="private"
            value={_private}
            checked={_private ? "checked" : ""}
            onChange={(e) => {
              setPrivate(_private === false);
            }}
          />
        </label>
        <label htmlFor="city">
          City:
          <input
            id="city"
            type="text"
            onChange={(e) => setCity(e.target.value)}
            value={city}
            required
          />
        </label>
        <label htmlFor="state">
          State:
          <input
            id="state"
            type="text"
            onChange={(e) => setState(e.target.value)}
            value={state}
            required
          />
        </label>
        <button type="submit">Update Group</button>
      </form>
    </div>
  );
}

export default EditGroupFormModal;
