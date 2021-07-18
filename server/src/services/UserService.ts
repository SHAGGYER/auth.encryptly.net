import { injectable } from "inversify";
import jwt from "jsonwebtoken"
import "reflect-metadata"

@injectable()
export class UserService {
  public async login(user) {
    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET!
    );

    user.password = undefined;

    return { token, user };
  }
};
