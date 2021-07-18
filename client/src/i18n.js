import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import da_auth from "./translations/da/auth.json";
import da_account from "./translations/da/account.json";
import da_errors from "./translations/da/errors.json";

import en_auth from "./translations/en/auth.json";
import en_account from "./translations/en/account.json";
import en_errors from "./translations/en/errors.json";

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    da: {
      auth: da_auth,
      account: da_account,
      errors: da_errors,
    },
    en: {
      auth: en_auth,
      account: en_account,
      errors: en_errors,
    },
  },
});
