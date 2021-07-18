import React, { useContext, useEffect, useState } from "react";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import HttpClient from "../services/HttpClient";
import { useTranslation } from "react-i18next";
import {
  Wrapper,
  AuthContainer,
  Form,
  SubmitButton,
  Title,
  Error,
  Info,
  Grid,
  SecondaryButton,
} from "../components/Layout";
import TextField from "../components/TextField";
import CodeInputs from "../components/CodeInputs";
import Checkmark from "../components/Checkmark";
import { UserService } from "../services/UserService";
import AppContext from "../AppContext";

const MODE = {
  SEND: 1,
  ENTER_CODE: 2,
  CHANGE_PASSWORD: 3,
};

const ForgotPassword = ({ location }) => {
  const { t } = useTranslation(["auth", "errors"]);
  const { clientId } = queryString.parse(location.search);
  const { redirect, app } = useContext(AppContext);
  const [email, setEmail] = useState("");
  const [error, setError] = useState({});
  const [info, setInfo] = useState("");
  const [mode, setMode] = useState(MODE.SEND);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError({});
    setInfo("");
    const _err = {};

    if (!email)
      return setError({
        email: "Required",
        general: "Der var nogle fejl",
      });

    try {
      const data = {
        email,
        appName: app.name
      };

      setLoading(true);
      await HttpClient().post("/api/auth/send-password-reset-email", data);
      setInfo("Email er sendt. Tjek evt. din spam mappe.");
      setLoading(false);
      setMode(MODE.ENTER_CODE);
    } catch (e) {
      setLoading(false);
      setError(e.response.data.errors);
    }
  };

  const onSuccessfulPasswordChange = (token) => {
    UserService.login(token);
    window.location.href = "/?mode=change-password";
  };

  const redirectToLogin = () => {
    window.location.href = "/auth/login?clientId=" + clientId;
  };

  return (
    <Wrapper>
      <AuthContainer>
        <Title>{t("auth:forgot_password")}</Title>
        <React.Fragment>
          {mode === MODE.SEND && (
            <Form onSubmit={onSubmit}>
              {!!error.general && <Error>{t("errors:" + error.general)}</Error>}
              {info && <Info>{info}</Info>}
              <TextField
                value={email}
                label="Email"
                onChange={(e) => setEmail(e.target.value)}
                error={error.email && t("errors:" + error.email)}
              />

              <Grid>
                <SubmitButton disabled={loading} primary type="submit">
                  {t("auth:send_email")}
                </SubmitButton>
                <SecondaryButton
                  type="button"
                  onClick={() => setMode(MODE.ENTER_CODE)}
                >
                  {t("auth:got_code")}
                </SecondaryButton>
              </Grid>
            </Form>
          )}
          {mode === MODE.ENTER_CODE && (
            <React.Fragment>
              <CodeInputs
                email={email}
                modeSendEmail={() => setMode(MODE.SEND)}
                onSuccess={(token) => onSuccessfulPasswordChange(token)}
              />
            </React.Fragment>
          )}
        </React.Fragment>
      </AuthContainer>
    </Wrapper>
  );
};
export default withRouter(ForgotPassword);
