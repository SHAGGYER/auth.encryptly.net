import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import HttpClient from "../services/HttpClient";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import Loader from "react-loader-spinner";
import TextField from "../components/TextField";
import {
  Container,
  Wrapper,
  Title,
  SubmitButton,
  UserTitle,
  Form,
} from "../components/Layout";
import AppContext from "../AppContext";

const Authorize = ({ location }) => {
  const { user, redirect, setUser } = useContext(AppContext);
  const { clientId } = queryString.parse(location.search);
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [initiated, setInitiated] = useState(false);

  useEffect(() => {
    if (user.firstName && user.lastName) {
      redirect("/");
    } else {
      setInitiated(true);
    }
  }, []);

  const update = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      await HttpClient().post("/api/auth/updateName", {
        firstName,
        lastName,
      });
      setUser({ ...user, firstName, lastName });

      if (clientId) {
        redirect("/auth/authorize?clientId=" + clientId);
      } else {
        redirect("/");
      }
    } catch (error) {
      setLoading(false);
      if (error.response.status === 400) {
        setError(error.response.data.errors);
      }
    }
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
        ) : (
          <React.Fragment>
            <Title>Update Name</Title>
            <UserTitle>Welcome back, {user.email}</UserTitle>

            <Form onSubmit={update}>
              <TextField
                value={firstName}
                label="First Name"
                onChange={(e) => setFirstName(e.target.value)}
                error={error.firstName}
              />
              <TextField
                value={lastName}
                label="Last Name"
                onChange={(e) => setLastName(e.target.value)}
                error={error.lastName}
              />

              <SubmitButton disabled={loading}>Save</SubmitButton>
            </Form>
          </React.Fragment>
        )}
      </Container>
    </Wrapper>
  );
};

export default withRouter(Authorize);
