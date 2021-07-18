import { Container } from "inversify";

import { TYPES } from "./types.inversify";
import { UserService } from "services/UserService";
import { MailService } from "./services/MailService";

const myContainer = new Container();
myContainer.bind<UserService>(TYPES.UserService).to(UserService);
myContainer.bind<MailService>(TYPES.MailService).to(MailService);

export { myContainer };
