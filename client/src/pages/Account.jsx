import React, { useContext, useEffect, useState } from "react";
import queryString from "query-string";
import { withRouter } from "react-router-dom";
import { Wrapper, Container } from "../components/Layout";
import styled from "styled-components";
import AppContext from "../AppContext";
import ChangePassword from "../components/account/ChangePassword";
import MyApps from "../components/account/MyApps";
import { useTranslation } from "react-i18next";
import Profile from "../components/account/Profile";

const AccountWrapper = styled.section`
  display: grid;
  grid-template-columns: 1fr 3fr;
  gap: 1rem;
  width: 100%;

  @media screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
  }
`;

const MenuWrapper = styled.article`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border: 1px solid var(--blue);
  border-radius: 7px;
  background-color: var(--blue);
  align-items: flex-start;
`;

const MenuLink = styled.div`
  font-size: 20px;
  margin-bottom: 1rem;
  cursor: pointer;
  color: white;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ContentWrapper = styled.article``;

const RequestingAppWrapper = styled.article`
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  border: 1px solid #ccc;
  padding: 0.5rem;
`;

const RequestingAppTitle = styled.p`
  color: var(--blue);
  display: block;
  text-align: center;
  cursor: pointer;
  margin-bottom: 0.5rem;
`;

const RequestingAppButtons = styled.div`
  display: flex;
`;

const RequestingAppAuthorizeButton = styled.button`
  background-color: var(--blue);
  padding: 0.3rem 1rem;
  border: none;
  cursor: pointer;
  margin-right: 0.5rem;
`;

const RequestingAppRejectButton = styled.button`
  background-color: var(--red);
  padding: 0.3rem 1rem;
  border: none;
  cursor: pointer;
`;

const MODE = {
  PROFILE: "profile",
  MY_APPS: "my-apps",
  CHANGE_PASSWORD: "change-password",
};

function Account({ location }) {
  const { t } = useTranslation(["account", "auth"]);
  const { mode } = queryString.parse(location.search);
  const { user, redirect, logout, app, setApp } = useContext(AppContext);
  const [tab, setTab] = useState(mode ? mode : MODE.PROFILE);

  useEffect(() => {
    if (!user.firstName || !user.lastName) {
      redirect("/auth/updateName");
    }
  }, []);

  useEffect(() => {
    if (mode) {
      setTab(mode);
    } else {
      setTab(MODE.PROFILE);
    }
  }, [mode]);

  const changeMode = (_mode) => {
    redirect("?mode=" + _mode);
  };

  const onChangePassword = () => {
    changeMode(MODE.PROFILE);
  };

  const rejectAppAuthorization = () => {
    setApp(null);
    localStorage.removeItem("clientId");
  };

  const authorizeApp = () => {
    redirect("/auth/authorize");
  };

  return (
    <Wrapper>
      {app && (
        <RequestingAppWrapper>
          <RequestingAppTitle>
            {app.name}
            <span> {t("account:app_wants_login")}</span>
          </RequestingAppTitle>
          <RequestingAppButtons>
            <RequestingAppAuthorizeButton onClick={authorizeApp}>
              {t("auth:login")}
            </RequestingAppAuthorizeButton>
            <RequestingAppRejectButton onClick={rejectAppAuthorization}>
              {t("account:reject")}
            </RequestingAppRejectButton>
          </RequestingAppButtons>
        </RequestingAppWrapper>
      )}

      <Container width="1000px">
        <AccountWrapper>
          <MenuWrapper>
            <MenuLink onClick={() => changeMode(MODE.PROFILE)}>
              {t("account:profile")}
            </MenuLink>
            <MenuLink onClick={() => changeMode(MODE.MY_APPS)}>
              {t("account:my_apps")}
            </MenuLink>
            <MenuLink onClick={() => changeMode(MODE.CHANGE_PASSWORD)}>
              {t("account:change_password")}
            </MenuLink>
            <MenuLink onClick={logout}>{t("account:logout")}</MenuLink>
          </MenuWrapper>

          {/* Content */}
          <ContentWrapper>
            {tab === MODE.PROFILE && <Profile />}
            {tab === MODE.MY_APPS && <MyApps />}
            {tab === MODE.CHANGE_PASSWORD && (
              <React.Fragment>
                <ChangePassword onSuccess={onChangePassword} />
              </React.Fragment>
            )}
          </ContentWrapper>
        </AccountWrapper>
      </Container>
    </Wrapper>
  );
}

export default withRouter(Account);
