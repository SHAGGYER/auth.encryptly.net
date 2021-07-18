import { createContext, Dispatch, SetStateAction } from "react";
import { IApp } from "./models/IApp";
import { IUser } from "./models/IUser";

interface IAppContext {
  user: IUser | undefined;
  redirect: (path: string) => void;
  logout: () => void;
  app: IApp | undefined;
  setApp: Dispatch<SetStateAction<IApp | undefined>>;
  savedClientId?: string;
  setSavedClientId: Dispatch<SetStateAction<string | undefined>>;
  savedRedirectUrl?: string;
  language?: string;
  setLanguage: Dispatch<SetStateAction<string | undefined>>;
  windowOpener: any;
}
const AppContext = createContext<IAppContext>({
  user: undefined,
  redirect: (path: string) => {},
  logout: () => {},
  app: undefined,
  setApp: () => {},
  savedClientId: undefined,
  setSavedClientId: () => {},
  savedRedirectUrl: undefined,
  language: "da",
  setLanguage: () => {},
  windowOpener: undefined
});

export default AppContext;
