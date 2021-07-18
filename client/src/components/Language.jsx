import React, { useContext } from "react";
import styled from "styled-components";
import AppContext from "../AppContext";

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 2rem;
`;

const LanguageText = styled.p`
  color: var(--blue);
  text-decoration: ${(props) => (props.active ? "underline" : "none")};
  cursor: pointer;
`;

const Spacer = styled.span`
  display: inline-block;
  margin: 0 0.5rem;
  color: var(--blue);
`;

export default function Language() {
  const { language, setLanguage } = useContext(AppContext);

  const changeLanguage = (lang) => {
    setLanguage(lang);
  };

  return (
    <Wrapper>
      <LanguageText
        active={language === "da"}
        onClick={() => changeLanguage("da")}
      >
        DA
      </LanguageText>
      <Spacer>|</Spacer>
      <LanguageText
        active={language === "en"}
        onClick={() => changeLanguage("en")}
      >
        EN
      </LanguageText>
    </Wrapper>
  );
}
