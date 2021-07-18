import { ValidationService } from "../services/ValidationService";
import User, { IUser } from "../models/User";
import App from "../models/App";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { MailService } from "../services/MailService";
import path from "path";
import fs from "fs";
import { UserService } from "../services/UserService";
import random from "random-number-generator";
import { myContainer } from "rootDir/inversify.config";
import { TYPES } from "rootDir/types.inversify";

export const init = async (_req, res) => {
  let user: IUser | null = null;

  const userId = res.locals.userId;
  if (userId) {
    user = await User.findById(userId);
  }

  return res.send({ user });
};

export const register = async (req, res) => {
  const errors = await ValidationService.run(
    {
      firstName: [
        [(val) => !val.trim(), "FIELD_REQUIRED"],
        [
          (val) => val.length < 2 || val.length > 15,
          "FIRST_NAME_MIN_MAX_LENGTH",
        ],
      ],
      lastName: [
        [(val) => !val.trim(), "FIELD_REQUIRED"],
        [
          (val) => val.length < 2 || val.length > 20,
          "LAST_NAME_MIN_MAX_LENGTH",
        ],
      ],
      displayName: [
        [(val) => !val.trim(), "FIELD_REQUIRED"],
        [
          (val) => {
            return val.length < 3 || val.length > 10;
          },
          "DISPLAY_NAME_MIN_MAX_LENGTH",
        ],
        [
          async (val) => {
            const user = await User.findOne({
              displayName: val.trim().toLowerCase(),
            });
            return !!user;
          },
          "DISPLAY_NAME_NOT_UNIQUE",
        ],
      ],
      email: [
        [(val) => !val.trim(), "FIELD_REQUIRED"],
        [(val) => !validator.isEmail(val.trim()), "EMAIL_INCORRECT_FORMAT"],
        [
          async (val) => {
            const user = await User.findOne({ email: val.trim() });
            return !!user;
          },
          "EMAIL_NOT_UNIQUE",
        ],
      ],
      password: [
        [(val) => !val.trim(), "FIELD_REQUIRED"],
        [(val) => val.length < 6, "PASSWORD_MIN_LENGTH"],
      ],
    },
    req.body.user
  );

  if (Object.keys(errors).length) {
    return res.status(400).send({ errors });
  }

  const { email, firstName, lastName, password, displayName } = req.body.user;

  const user = new User({
    email: email.trim(),
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    password,
    displayName: displayName.trim(),
  });
  await user.save();

  res.sendStatus(201);
};

export const login = async (req, res) => {
  const errors = await ValidationService.run(
    {
      email: [
        [(val) => !val.trim(), "FIELD_REQUIRED"],
        [(val) => !validator.isEmail(val.trim()), "EMAIL_INCORRECT_FORMAT"],
      ],
      password: [[(val) => !val.trim(), "FIELD_REQUIRED"]],
    },
    req.body.user
  );

  if (Object.keys(errors).length) {
    return res.status(400).send({ errors });
  }

  const { email, password } = req.body.user;

  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (!user) {
    return res.status(403).send({ error: "INVALID_CREDENTIALS" });
  }

  const equals = await bcrypt.compare(password, user.password);
  if (!equals) {
    return res.status(403).send({ error: "INVALID_CREDENTIALS" });
  }

  const userService = myContainer.get<UserService>(TYPES.UserService);
  const result = await userService.login(user);
  res.send(result);
};

export const getUser = async (req, res) => {
  try {
    const { id } = <any>jwt.verify(req.cookies.token, process.env.JWT_SECRET!);
    if (!id) {
      return res.sendStatus(204);
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.sendStatus(204);
    }

    return res.send({ user });
  } catch (error) {
    res.sendStatus(204);
  }
};

export const authorize = async (req, res) => {
  if (!req.query.client_id) {
    return res.status(400).send({ error: "No client_id provided" });
  }

  try {
    const id = res.locals.userId;
    if (!id) {
      return res.status(400).send({ error: "No id found" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(400).send({ error: "Not user found" });
    }

    const app = await App.findOne({ clientId: req.query.client_id }).select(
      "-clientSecret"
    );
    if (!app) {
      return res.status(400).send({ error: "App not found" });
    }

    if (!user.authorizedApps.includes(app._id)) {
      user.authorizedApps.push(app._id);
      await user.save();
    }

    return res.send({ authorized: true, token: res.locals.token, app });
  } catch (error) {
    return res.status(400).send({ error: "Error decoding token" });
  }
};

export const isAuthorized = async (req, res) => {
  if (!req.query.clientId) {
    return res.status(400).send({ error: "No client_id provided" });
  }

  try {
    const id = res.locals.userId;
    if (!id) {
      return res.status(400).send({ error: "No id found" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).send({ error: "Not user found" });
    }

    const app = await App.findOne({ clientId: req.query.clientId }).select(
      "-clientSecret"
    );
    if (!app) {
      return res.status(400).send({ error: "App not found" });
    }

    if (!user.authorizedApps.includes(app._id)) {
      return res.send({ authorized: false });
    }

    return res.send({
      authorized: true,
      token: res.locals.token,
    });
  } catch (error) {
    return res.status(400).send({ error: "Not authorized" });
  }
};

export const account = async (req, res) => {
  if (!req.query.token) {
    return res.status(400).send({ error: "No token provided" });
  }

  if (!req.query.client_id) {
    return res.status(400).send({ error: "No client_id provided" });
  }

  if (!req.query.client_secret) {
    return res.status(400).send({ error: "No client_secret provided" });
  }

  try {
    const { id } = <any>jwt.verify(req.query.token, process.env.JWT_SECRET!);
    if (!id) {
      return res.status(400).send({ error: "Not authorized" });
    }

    const user = await User.findById(id).select("-password");
    if (!user) {
      return res.status(400).send({ error: "Not authorized" });
    }

    const app = await App.findOne({
      clientId: req.query.client_id,
    });
    if (!app) {
      return res.status(400).send({ error: "App not found" });
    }

    if (app.clientSecret !== req.query.client_secret) {
      return res.status(400).send({ error: "Wrong client_secret" });
    }

    if (!user.authorizedApps.includes(app._id)) {
      return res.send({ error: "App not authorized" });
    }

    const parsedUser: IUser = {} as IUser;
    parsedUser._id = user._id;
    app.fields.split(",").forEach((field) => {
      parsedUser[field] = user[field];
    });

    return res.send({
      authorized: true,
      user: parsedUser,
    });
  } catch (error) {
    return res.status(400).send({ error: error.message });
  }
};

export const getAppData = async (req, res) => {
  if (!req.query.clientId) {
    return res.status(400).send({ error: "Ingen clientId modtaget" });
  }

  const app = await App.findOne({ clientId: req.query.clientId }).select(
    "-clientSecret"
  );
  if (!app) {
    return res.status(400).send({ error: "App ikke fundet" });
  }

  return res.send({
    app,
  });
};

export const updateName = async (req, res) => {
  const user = await User.findById(res.locals.userId);
  if (!user) {
    return res.status(500).send({ error: "User not found" });
  }

  const errors = await ValidationService.run(
    {
      firstName: [
        [(val) => !val.trim(), "First Name is required"],
        [
          (val) => val.length < 2 || val.length > 15,
          "First Name must be between 2 and 15 characters long",
        ],
      ],
      lastName: [
        [(val) => !val.trim(), "Last Name is required"],
        [
          (val) => val.length < 2 || val.length > 20,
          "Last Name must be between 2 and 20 characters long",
        ],
      ],
    },
    req.body
  );

  if (Object.keys(errors).length) {
    return res.status(400).send({ errors });
  }

  const { firstName, lastName } = req.body;
  user.firstName = firstName;
  user.lastName = lastName;
  await user.save();

  return res.sendStatus(204);
};

export const sendPasswordResetEmail = async (req, res) => {
  let user: IUser | null = null;
  const errors = await ValidationService.run(
    {
      email: [
        [(val) => !val.trim(), "FIELD_REQUIRED"],
        [(val) => !validator.isEmail(val.trim()), "EMAIL_INCORRECT_FORMAT"],
        [
          async (val) => {
            if (!val) return true;
            user = await User.findOne({
              email: val.trim().toLowerCase(),
            });
            return !user;
          },
          "EMAIL_NOT_FOUND",
        ],
      ],
    },
    req.body
  );

  if (Object.keys(errors).length) {
    return res.status(400).send({ errors });
  }

  const token = random(999999, 100000);
  user!.passwordResetToken = token;
  await user!.save();

  try {
    const file = fs.readFileSync(
      path.join(__dirname, "../..", "email/ForgotPassword.html")
    );
    const html = file
      .toString()
      .replace("{{CODE}}", token)
      .replace("{{USER}}", user!.firstName ? user!.firstName : user!.email);

    const mailService = myContainer.get<MailService>(TYPES.MailService);
    await mailService.sendMail({
      to: req.body.email,
      subject: "Password Reset",
      html,
      appName: req.body.appName
    });

    res.sendStatus(200);
  } catch (e) {
    res.status(500).send(e.message);
  }
};

export const checkVerificationToken = async (req, res) => {
  let user: IUser | null = null;
  const errors = await ValidationService.run(
    {
      email: [
        [(val) => !val.trim(), "FIELD_REQUIRED"],
        [(val) => !validator.isEmail(val.trim()), "EMAIL_INCORRECT_FORMAT"],
      ],
      token: [
        [
          async (val) => {
            user = await User.findOne({
              passwordResetToken: parseInt(val),
              email: req.body.email.trim().toLowerCase(),
            });
            return !user;
          },
          "WRONG_CODE",
        ],
      ],
    },
    req.body
  );

  if (Object.keys(errors).length) {
    return res.status(400).send({ errors });
  }

  const userService = myContainer.get<UserService>(TYPES.UserService);
  const { token } = await userService.login(user);

  res.send({ token });
};

export const resetPassword = async (req, res) => {
  const user = await User.findById(res.locals.userId);
  if (!user) {
    return res.sendStatus(404);
  }
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  await user.save();
  res.sendStatus(200);
};

export const logout = (_req, res) => {
  res.cookie("token", null);
  return res.sendStatus(204);
};
