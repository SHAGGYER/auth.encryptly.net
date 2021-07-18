import React, { useState } from "react";
import TextField from "../TextField";
import { Form, SubmitButton, Title } from "../Layout";
import { useTranslation } from "react-i18next";
import cogoToast from "cogo-toast";
import HttpClient from "../../services/HttpClient";

const ResetPassword = ({ userId, onSuccess }) => {
  const { t } = useTranslation("account");
  const [error, setError] = useState({});
  const [password, setPassword] = useState("");
  const [passwordIcon, setPasswordIcon] = useState("fas fa-eye");
  const [passwordType, setPasswordType] = useState("password");

  const onSubmit = async (event) => {
    event.preventDefault();
    setError({});
    let err = {};

    if (!password.trim()) err.password = "FIELD_REQUIRED";

    if (Object.keys(err).length) return setError(err);

    const data = {
      password,
    };

    await HttpClient().post("/api/auth/reset-password", data);
    cogoToast.success(t("change_password_success"));
    onSuccess();
  };

  const togglePasswordVisibility = () => {
    if (passwordType === "password") {
      setPasswordType("text");
      setPasswordIcon("fas fa-eye-slash");
    } else {
      setPasswordType("password");
      setPasswordIcon("fas fa-eye");
    }
  };

  return (
    <React.Fragment>
      <Title>{t("change_password")}</Title>
      <Form onSubmit={onSubmit}>
        <TextField
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={t(error.password)}
          type={passwordType}
          label={t("new_password")}
          prependIcon="fas fa-key"
          appendIcon={passwordIcon}
          appendIconOnClick={togglePasswordVisibility}
        />
        <SubmitButton type="submit">{t("save")}</SubmitButton>
      </Form>
    </React.Fragment>
  );
};

export default ResetPassword;
