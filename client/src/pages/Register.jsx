import React, { useState, useEffect, useContext } from "react";
import TextField from "../components/TextField";
import HttpClient from "../services/HttpClient";
import { useTranslation } from "react-i18next";
import { withRouter } from "react-router-dom";
import {
  Wrapper,
  AuthContainer,
  Form,
  SubmitButton,
  Grid,
  Error,
  Subtitle,
  AuthButtonsContainer,
  AuthButton,
} from "../components/Layout";
import AppContext from "../AppContext";

function Register({ location }) {
  const { t } = useTranslation(["auth", "errors"]);
  const { app, redirect } = useContext(AppContext);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({});
  const [passwordIcon, setPasswordIcon] = useState("fas fa-eye");
  const [passwordType, setPasswordType] = useState("password");
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setPasswordIcon("fas fa-eye-slash");
    } else {
      setPasswordType("password");
      setPasswordIcon("fas fa-eye");
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setError({});
    const _error = {};

    if (Object.keys(_error).length) return setError(_error);

    const data = {
      user: {
        firstName,
        lastName,
        displayName,
        email,
        password,
      },
    };

    try {
      setLoading(true);
      await HttpClient().post("/api/auth/register", data);
      redirectToLogin();
    } catch (_error) {
      setLoading(false);
      if (_error.response.status === 400) {
        setError(_error.response.data.errors);
      }
    }
  };

  const redirectToLogin = () => {
    redirect("/auth/login");
  };

  return (
    <Wrapper>
      <AuthContainer>
        <AuthButtonsContainer>
          <AuthButton onClick={redirectToLogin}>{t("login")}</AuthButton>
          <AuthButton active>{t("create_account")}</AuthButton>
        </AuthButtonsContainer>
        {app && <Subtitle>{app.name}</Subtitle>}

        {error.general && <Error>{t("errors:" + error.general)}</Error>}
        <Form onSubmit={onSubmit}>
          <Grid>
            <TextField
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              error={error.firstName && t("errors:" + error.firstName)}
              label={t("auth:first_name")}
            />
            <TextField
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={error.lastName && t("errors:" + error.lastName)}
              label={t("auth:last_name")}
            />
          </Grid>
          <TextField
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            error={error.displayName && t("errors:" + error.displayName)}
            label={t("auth:display_name")}
            prependIcon="fas fa-user"
          />
          <TextField
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={error.email && t("errors:" + error.email)}
            label="Email"
            prependIcon="fas fa-envelope"
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={error.password && t("errors:" + error.password)}
            type={passwordType}
            label={t("auth:password")}
            prependIcon="fas fa-key"
            appendIcon={passwordIcon}
            appendIconOnClick={togglePasswordVisibility}
          />

          <SubmitButton disabled={loading || error.general}>
            {t("auth:create_account")}
          </SubmitButton>
        </Form>
      </AuthContainer>
    </Wrapper>
  );
}

export default withRouter(Register);
