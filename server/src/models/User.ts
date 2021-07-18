import mongoose from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends mongoose.Document {
  email: string;
  password: string;
  displayName: string;
  firstName: string;
  lastName: string;
  authorizedApps: Array<string>;
  passwordResetToken?: number;
}

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: String,
    password: String,
    displayName: String,
    firstName: String,
    lastName: String,
    authorizedApps: Array,
    passwordResetToken: Number,
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function (next) {
  const user = this;

  if (!user.isModified("password")) {
    return next();
  }

  user.password = await bcrypt.hash(user.password, 10);
  next();
});

const User = mongoose.model<IUser>("User", UserSchema, "users");
export default User;
