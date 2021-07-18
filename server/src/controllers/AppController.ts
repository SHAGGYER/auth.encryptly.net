import App from "models/App";
import User from "models/User";
import { ValidationService } from "services/ValidationService";
import { v4 } from "uuid";

export const generateApp = async (req, res) => {
  const errors = await ValidationService.run(
    {
      name: [[(val) => !val, "Name is required"]],
      redirectUrl: [[(val) => !val, "Redirect URL is required"]],
      url: [[(val) => !val, "URL is required"]],
      fields: [
        [(val) => !val, "Fields are required"],
        [
          (val) => {
            if (!val) return true;
            const _fields = val.split(",");
            return _fields.includes("password");
          },
          "Fields may not contain a password",
        ],
      ],
    },
    req.body
  );

  if (Object.keys(errors).length) {
    return res.status(400).send({ errors });
  }

  const clientId = v4();
  const clientSecret = v4();

  const app = new App({
    ...req.body,
    clientId,
    clientSecret,
  });

  await app.save();

  return res.send({ app });
};

export const getMyApps = async (_req, res) => {
  const user = await User.findById(res.locals.userId)
    .populate({
      path: "authorizedApps",
      model: "App",
    })
    .exec();
  if (!user) {
    return res.status(400).send({ error: "Bruger ikke fundet" });
  }

  return res.send({ apps: user.authorizedApps });
};

export const removeApp = async (req, res) => {
  const user = await User.findById(res.locals.userId).exec();
  if (!user) {
    return res.status(400).send({ error: "Bruger ikke fundet" });
  }

  const index = user.authorizedApps.findIndex(
    (appId) => appId.toString() === req.params.id
  );
  user.authorizedApps.splice(index, 1);
  user.markModified("authorizedApps");
  await user.save();

  res.sendStatus(204);
};
