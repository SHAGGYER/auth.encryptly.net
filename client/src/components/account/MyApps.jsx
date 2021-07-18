import React, { useContext, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Loader from "react-loader-spinner";
import { AppsWrapper, App, Title, Wrapper } from "../Layout";
import { UserService } from "../../services/UserService";
import styled from "styled-components";
import { useTranslation } from "react-i18next";
import AppContext from "../../AppContext";

const Link = styled.p`
  text-decoration: underline;
  cursor: pointer;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const LoginLink = styled(Link)`
  color: var(--blue);
`;

const RevokeAccessLink = styled(Link)`
  color: var(--red);
`;

const NoAppsFound = styled.p`
  text-align: left;
`;

const Apps = () => {
  const { t } = useTranslation("account");
  const { setApp, setSavedClientId, redirect } = useContext(AppContext);
  const [error, setError] = useState("");
  const [apps, setApps] = useState([]);
  const [initiated, setInitiated] = useState(false);

  useEffect(async () => {
    getApps();
  }, []);

  const getApps = async () => {
    const response = await UserService.getMyApps();
    setInitiated(true);
    if (response.error) {
      return setError(response.error);
    }

    setApps(response.apps);
  };

  const redirectToApp = (app) => {
    setApp(app);
    setSavedClientId(app.clientId);
    redirect("/auth/login");
  };

  const removeApp = async (app, index) => {
    await UserService.removeApp(app._id);
    const _apps = [...apps];
    _apps.splice(index, 1);
    setApps(_apps);
  };

  return (
    <React.Fragment>
      {!initiated ? (
        <Wrapper>
          <Loader
            type="Grid"
            color="var(--blue)"
            height={100}
            width={100}
            timeout={3000}
          />
        </Wrapper>
      ) : (
        <React.Fragment>
          <Title>{t("my_apps")}</Title>
          {error && <Error>{error}</Error>}
          {!!apps.length ? (
            <AppsWrapper>
              {apps.map((app, index) => (
                <App key={index}>
                  <h3>{app.name}</h3>
                  <div>
                    <LoginLink onClick={() => redirectToApp(app)}>
                      {t("login")}
                    </LoginLink>
                    <RevokeAccessLink onClick={() => removeApp(app, index)}>
                      {t("remove_app")}
                    </RevokeAccessLink>
                  </div>
                </App>
              ))}
            </AppsWrapper>
          ) : (
            <NoAppsFound>{t("no_apps")}</NoAppsFound>
          )}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default withRouter(Apps);
