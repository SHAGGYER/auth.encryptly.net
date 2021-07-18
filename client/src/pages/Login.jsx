import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import AppContext from "../AppContext";
import Checkmark from "../components/Checkmark";
import {
  AuthContainer,
  Error,
  ForgotPasswordLink,
  ForgotPasswordWrapper,
  Form,
  Grid,
  InfoButton,
  SubmitButton,
  Subtitle,
  UserTitle,
  Wrapper,
  AuthButtonsContainer,
  AuthButton,
} from "../components/Layout";
import TextField from "../components/TextField";
import HttpClient from "../services/HttpClient";

function Login({ location }) {
  const { t } = useTranslation(["auth", "errors"]);
  const { user, setUser, redirect, app } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (authorized) {
      setTimeout(() => {
        authorize();
      }, 2000);
    }
  }, [authorized]);

  const onSubmit = async (event) => {
    event.preventDefault();

    setError({});

    const data = {
      user: {
        email,
        password,
      },
    };

    try {
      setLoading(true);
      const response = await HttpClient().post("/api/auth/login", data);
      console.log(response.data);
      localStorage.setItem("token", response.data.token);
      if (app) {
        console.log("here");
        authorize();
      } else {
        setAuthorized(true);
      }
    } catch (_error) {
      console.log(_error);
      setLoading(false);
      if (_error.response.status === 400) {
        setError(_error.response.data.errors);
      } else if (_error.response.status === 403) {
        setError({ general: _error.response.data.error });
      }
    }
  };

  const authorize = () => {
    if (app) {
      window.location.href = "/auth/authorize";
    } else {
      window.location.href = "/";
    }
  };

  const redirectToRegister = () => {
    redirect("/auth/register");
  };

  const redirectToForgotPassword = () => {
    redirect("/auth/forgot-password");
  };

  return (
    <Wrapper>
      <AuthContainer>
        {!authorized ? (
          <React.Fragment>
            {user ? (
              <React.Fragment>
                {app && <Subtitle>{app.name}</Subtitle>}
                {error.general && <Error>{t(error.general)}</Error>}

                <UserTitle>
                  {t("auth:welcome_back")},{" "}
                  {user.firstName ? user.firstName : user.email}
                </UserTitle>

                {app ? (
                  <Grid>
                    <SubmitButton
                      disabled={!!error.general}
                      onClick={() => authorize()}
                    >
                      {t("auth:continue")}
                    </SubmitButton>
                    <InfoButton onClick={() => redirect("/")}>
                      {t("auth:my_account")}
                    </InfoButton>
                  </Grid>
                ) : (
                  <InfoButton onClick={() => redirect("/")}>
                    {t("auth:my_account")}
                  </InfoButton>
                )}
              </React.Fragment>
            ) : (
              <React.Fragment>
                <AuthButtonsContainer>
                  <AuthButton active>{t("login")}</AuthButton>
                  <AuthButton onClick={redirectToRegister}>
                    {t("create_account")}
                  </AuthButton>
                </AuthButtonsContainer>
                {app && <Subtitle>{app.name}</Subtitle>}

                {error.general && <Error>{t("errors:" + error.general)}</Error>}
                <Form onSubmit={onSubmit}>
                  <TextField
                    value={email}
                    label="Email"
                    onChange={(e) => setEmail(e.target.value)}
                    error={error.email && t("errors:" + error.email)}
                  />
                  <TextField
                    value={password}
                    label={t("password")}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    error={error.password && t("errors:" + error.password)}
                  />

                  <SubmitButton disabled={loading}>{t("login")}</SubmitButton>

                  <ForgotPasswordWrapper>
                    <ForgotPasswordLink
                      href="#"
                      onClick={redirectToForgotPassword}
                    >
                      {t("auth:forgot_password")}
                    </ForgotPasswordLink>
                  </ForgotPasswordWrapper>
                </Form>
              </React.Fragment>
            )}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Checkmark />
          </React.Fragment>
        )}
      </AuthContainer>
    </Wrapper>
  );
}

export default withRouter(Login);
