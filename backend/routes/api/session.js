// backend/routes/api/session.js
const express = require("express");

const { setTokenCookie, restoreUser, requireAuth } = require("../../utils/auth");
const { User } = require("../../db/models");

const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

const router = express.Router();

const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Please provide a valid email or username."),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Please provide a password."),
  handleValidationErrors,
];

// Log in
router.post("/", validateLogin, async (req, res, next) => {
  const { credential, password } = req.body;

  const user = await User.login({ credential, password });

  if (!user) {
    const err = new Error("Login failed");
    err.status = 401;
    err.title = "Login failed";
    err.errors = ["The provided credentials were invalid."];
    return next(err);
  }

  const token = await setTokenCookie(res, user);

  const jsonUser = user.toJSON()

  jsonUser.token = ''

  delete jsonUser.username

  return res.json(jsonUser);
});

// Log out
router.delete("/", (_req, res) => {
  res.clearCookie("token");
  return res.json({ message: "success" });
});

// Get Current User '/api/session'
router.get("/", requireAuth, (req, res) => {
  let { user } = req;
  user = user.toJSON()
  delete user.username
  if (user) {
    return res.json(user);
  } else {
    return res.json(user);
  }
});

module.exports = router;
