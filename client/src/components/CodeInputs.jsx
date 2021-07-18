import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";
import { Error, SubmitButton, Subtitle } from "./Layout";
import HttpClient from "../services/HttpClient";
import TextField from "./TextField";
import { useTranslation } from "react-i18next";

const CodeInputStyle = styled.input`
  padding: 5px;
  width: 50px;
  font-size: 30px;
  margin-right: 0.5rem;
  text-align: center;
  height: 50px;
  border: none;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.3);

  @media screen and (max-width: 640px) {
    width: 40px;
    font-size: 15px;
    padding: 3px;
  }
`;

const CodeInputsWrapper = styled.section`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const CodeInputsContainer = styled.div`
  display: flex;
  margin-bottom: 3rem;
  justify-content: center;
`;

export default function ({ email, modeSendEmail, onSuccess }) {
  const { t } = useTranslation(["auth", "errors"]);
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const input6Ref = useRef(null);

  const [readyToValidate, setReadyToValidate] = useState(false);

  const [input1, setInput1] = useState("");
  const [input2, setInput2] = useState("");
  const [input3, setInput3] = useState("");
  const [input4, setInput4] = useState("");
  const [input5, setInput5] = useState("");
  const [input6, setInput6] = useState("");

  const [error, setError] = useState({});

  const [userEmail, setUserEmail] = useState(email);

  useEffect(() => {
    if (readyToValidate) {
      const token = input1 + input2 + input3 + input4 + input5 + input6;
      checkToken(token);
    }
  }, [readyToValidate]);

  const onChange = (setInput, value, ref) => {
    setInput(value);

    if (ref) {
      ref.current.focus();
    } else {
      setReadyToValidate(true);
    }
  };

  const checkToken = async (token) => {
    setError({});

    if (!userEmail) {
      return setError({});
    }

    try {
      const data = {
        token,
        email: userEmail,
      };

      const response = await HttpClient().post(
        "/api/auth/check-email-verification-token",
        data
      );
      onSuccess(response.data.token);
    } catch (e) {
      if (e.response.status === 400) {
        setError(e.response.data.errors);
      }
      setInput1("");
      setInput2("");
      setInput3("");
      setInput4("");
      setInput5("");
      setInput6("");
      setReadyToValidate(false);
      input1Ref.current.focus();
    }
  };

  return (
    <CodeInputsWrapper>
      <Subtitle>{t("auth:write_code_here")}</Subtitle>

      {error.token && <Error>{t("errors:" + error.token)}</Error>}
      {error.general && <Error>{error.general}</Error>}
      <TextField
        value={userEmail}
        label="Email"
        onChange={(e) => setUserEmail(e.target.value)}
        error={error.email && t("errors:" + error.email)}
      />

      <CodeInputsContainer>
        <CodeInputStyle
          value={input1}
          ref={input1Ref}
          maxLength={1}
          onChange={(e) => onChange(setInput1, e.target.value, input2Ref)}
        />
        <CodeInputStyle
          value={input2}
          ref={input2Ref}
          maxLength={1}
          onChange={(e) => onChange(setInput2, e.target.value, input3Ref)}
        />
        <CodeInputStyle
          value={input3}
          ref={input3Ref}
          maxLength={1}
          onChange={(e) => onChange(setInput3, e.target.value, input4Ref)}
        />
        <CodeInputStyle
          value={input4}
          ref={input4Ref}
          maxLength={1}
          onChange={(e) => onChange(setInput4, e.target.value, input5Ref)}
        />
        <CodeInputStyle
          value={input5}
          ref={input5Ref}
          maxLength={1}
          onChange={(e) => onChange(setInput5, e.target.value, input6Ref)}
        />
        <CodeInputStyle
          value={input6}
          ref={input6Ref}
          maxLength={1}
          onChange={(e) => onChange(setInput6, e.target.value, null)}
        />
      </CodeInputsContainer>

      <p style={{ marginBottom: "1rem" }}>{t("auth:not_received_code")}</p>
      <SubmitButton primary type="button" onClick={modeSendEmail}>
        {t("auth:send_email_again")}
      </SubmitButton>
    </CodeInputsWrapper>
  );
}
