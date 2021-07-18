import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "../../AppContext";
import { Title } from "../Layout";
import TextField from "../TextField";

export default function Profile() {
  const { t } = useTranslation(["account", "auth"]);
  const { user } = useContext(AppContext);

  return (
    <React.Fragment>
      <Title>{t("account:profile")}</Title>
      <div>
        <TextField
          disabled
          value={user.firstName}
          label={t("auth:first_name")}
        />
        <TextField disabled value={user.lastName} label={t("auth:last_name")} />
        <TextField
          disabled
          value={user.displayName}
          label={t("auth:display_name")}
          prependIcon="fas fa-user"
        />
        <TextField
          disabled
          value={user.email}
          label="Email"
          prependIcon="far fa-envelope"
        />
      </div>
    </React.Fragment>
  );
}
