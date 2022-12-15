import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const { closeModal } = useModal();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors([]);
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(Object.values(data.errors));
          }
        });
    }
    return setErrors([
      "Confirm Password field must be the same as the Password field",
    ]);
  };

  return (
    <div className="modal-container">
      <div className="close-modal-button-container" onClick={closeModal}>
        <i className="fa-solid fa-x"></i>
      </div>
      <div className="modal-form-container">
        <h1 className="modal-form-title">Sign Up</h1>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <ul>
            {errors.map((error, idx) => (
              <li key={idx}>{error}</li>
            ))}
          </ul>
          <label className="form-input-item-label">Email</label>
          <input
            className="form-input-item"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label className="form-input-item-label">Username</label>
          <input
            className="form-input-item"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <label className="form-input-item-label">First Name</label>
          <input
            className="form-input-item"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <label className="form-input-item-label">Last Name</label>
          <input
            className="form-input-item"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <label className="form-input-item-label">Password</label>
          <input
            className="form-input-item"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="form-input-item-label">Confirm Password</label>
          <input
            className="form-input-item"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="form-button">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignupFormModal;
