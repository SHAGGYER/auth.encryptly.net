import React, { useContext, useEffect, useState } from "react";
import HttpClient from "../services/HttpClient";
import { withRouter } from "react-router-dom";
import Loader from "react-loader-spinner";
import Checkmark from "../components/Checkmark";
import {
  Wrapper,
  Container,
  SubmitButton,
  Card,
  Title,
  Subtitle,
  UserTitle,
  Error,
} from "../components/Layout";
import AppContext from "../AppContext";
import { useTranslation } from "react-i18next";

const FIELDS = {
  firstName: "first_name",
  lastName: "last_name",
  displayName: "display_name",
  email: "email",
};

const Authorize = ({ location }) => {
  const { t } = useTranslation("auth");
  const { user, redirect, app, savedClientId, savedRedirectUrl, windowOpener } =
    useContext(AppContext);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);
  const [token, setToken] = useState(null);
  const [initiated, setInitiated] = useState(false);

  useEffect(() => {
    if (authorized) {
      setTimeout(() => {
        redirectToApp();
      }, 2000);
    }
  }, [authorized, token, app]);

  useEffect(() => {
    if (!savedClientId) {
      redirect("/");
    } else {
      checkIsAuthorized();
    }
  }, []);

  const checkIsAuthorized = async () => {
    if (!user.firstName || !user.lastName) {
      return redirect("/auth/updateName");
    }

    const { data } = await HttpClient().get(
      "/api/auth/isAuthorized?clientId=" + savedClientId
    );
    if (data.authorized) {
      authorize();
    } else {
      setInitiated(true);
    }
  };

  const authorize = async () => {
    try {
      setLoading(true);
      const { data } = await HttpClient().post(
        "/api/auth/authorize?client_id=" + savedClientId,
        {}
      );
      if (data.authorized) {
        setAuthorized(true);
        setToken(data.token);
        setInitiated(true);
      }
    } catch (_error) {
      setLoading(false);
      console.log(_error);
      if (_error.response.status === 400) {
        setError(_error.response.data.error);
      }
    }
  };

  const redirectToApp = () => {
    localStorage.removeItem("clientId");
    localStorage.removeItem("redirectUrl");

    let redirectUrl = savedRedirectUrl
      ? "&redirectUrl=" + savedRedirectUrl
      : "";

    if (windowOpener) {
      windowOpener.postMessage({token}, "*", );
      return;
    }
    window.location.href = app.redirectUrl + "?token=" + token + redirectUrl;
  };

  return (
    <Wrapper>
      <Container>
        {!initiated ? (
          <Loader
            type="Grid"
            color="var(--blue)"
            height={100}
            width={100}
            timeout={3000} //3 secs
          />
        ) : initiated && !authorized ? (
          <React.Fragment>
            <Title>{t("authorize")}</Title>
            {app && <Subtitle>{app.name}</Subtitle>}
            {user && (
              <UserTitle>
                {t("welcome_back")}, {user.firstName}
              </UserTitle>
            )}
            {app && (
              <Card>
                <h4>
                  {app.name} {t("requests_fields")}:
                </h4>
                <ul>
                  {app.fields
                    .toString()
                    .split(",")
                    .map((field, index) => (
                      <li key={index}>{t(FIELDS[field])}</li>
                    ))}
                </ul>
              </Card>
            )}
            {error && <Error>{error}</Error>}
            <SubmitButton disabled={loading || error} onClick={authorize}>
              {t("authorize")}
            </SubmitButton>
          </React.Fragment>
        ) : (
          initiated &&
          authorized && (
            <React.Fragment>
              <Checkmark />
            </React.Fragment>
          )
        )}
      </Container>
    </Wrapper>
  );
};

export default withRouter(Authorize);
