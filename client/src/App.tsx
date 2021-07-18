import React, { useEffect, useState } from "react";
import {
  Route,
  Switch,
  Redirect,
  useHistory,
  withRouter,
} from "react-router-dom";
import { useTranslation } from "react-i18next";
import queryString from "query-string";
import Authorize from "./pages/Authorize";
import ForgotPassword from "./pages/ForgotPassword";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UpdateName from "./pages/UpdateName";
import AppContext from "./AppContext";
import HttpClient from "./services/HttpClient";
import Loader from "react-loader-spinner";
import { Wrapper, Container } from "./components/Layout";
import Account from "./pages/Account";
import { UserService } from "./services/UserService";
import { IApp } from "./models/IApp";
import { IUser } from "./models/IUser";

function App({ location }) {
  const { i18n } = useTranslation();
  const {
    clientId,
    redirectUrl,
  }: {
    clientId?: string;
    redirectUrl?: string;
  } = queryString.parse(location.search);
  const history = useHistory();
  const [user, setUser] = useState<IUser | undefined>(undefined);
  const [initiated, setInitiated] = useState(false);
  const [app, setApp] = useState<IApp | undefined>(undefined);
  const [savedClientId, setSavedClientId] = useState<string | undefined>(
    clientId || localStorage.getItem("clientId") || undefined
  );
  const [savedRedirectUrl] = useState<string | undefined>(
    redirectUrl || localStorage.getItem("redirectUrl")?.toString()
  );
  const [language, setLanguage] = useState<string | undefined>(
    localStorage.getItem("language") || "en"
  );
  const [windowOpener] = useState(window.opener ?? null);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (savedRedirectUrl) {
      const localRedirectUrl = localStorage.getItem("redirectUrl");
      if (!localRedirectUrl) {
        localStorage.setItem("redirectUrl", savedRedirectUrl);
      }
    }
  }, [savedRedirectUrl]);

  useEffect(() => {
    if (savedClientId) {
      getApp();
    }
  }, [savedClientId]);

  useEffect(() => {
    if (language) {
      changeLanguage(language);
    }
  }, [language]);

  const init = async () => {
    const { data } = await HttpClient().get("/api/auth/init");
    setUser(data.user);
    changeLanguage(language);
    setInitiated(true);
  };

  const getApp = async () => {
    const response = await UserService.getApp(savedClientId!);
    if (!response) return;
    if (typeof response !== "string") {
      localStorage.setItem("clientId", response.clientId);
      setApp(response);
    } else {
      //TODO: Display error
    }
  };

  const redirect = (path) => {
    history.push(path);
  };

  const logout = async () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("language", lang);
  };

  return !initiated ? (
    <Wrapper>
      <Container>
        <Loader
          type="Grid"
          color="var(--blue)"
          height={100}
          width={100}
          timeout={3000}
        />
      </Container>
    </Wrapper>
  ) : (
    <AppContext.Provider
      value={{
        user,
        app,
        setApp,
        savedClientId,
        setSavedClientId,
        redirect,
        logout,
        language,
        setLanguage,
        savedRedirectUrl,
        windowOpener
      }}
    >
      <Switch>
        <Route path="/" exact>
          {user ? <Account /> : <Redirect to="/auth/login" />}
        </Route>

        <Route path="/auth/register">
          {!user ? <Register /> : <Redirect to="/auth/login" />}
        </Route>

        <Route path="/auth/login">
          <Login />
        </Route>

        <Route path="/auth/authorize">
          {user ? <Authorize /> : <Redirect to="/auth/login" />}
        </Route>

        <Route path="/auth/updateName">
          {user ? <UpdateName /> : <Redirect to="/auth/login" />}
        </Route>

        <Route path="/auth/forgot-password">
          <ForgotPassword />
        </Route>

        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </AppContext.Provider>
  );
}

export default withRouter(App);
