import React from "react";
import styled from "styled-components";

const LabelStyle = styled.label`
  text-transform: uppercase;
  font-size: 12px;
  margin-bottom: 0.5rem;
  display: block;
  color: var(--blue);
`;

const TextFieldStyle = styled.input`
  border: none;
  flex-grow: 1;
  padding: 1rem 0;
  outline: none;
`;

const TextFieldWrapper = styled.div`
  padding: 0 1rem;
  border-radius: 7px;
  width: 100%;
  border: 2px solid var(--blue);
  display: flex;
  align-items: center;
`;

const ErrorStyle = styled.span`
  color: var(--red);
  font-size: 12px;
  display: block;
  margin-top: 0.5rem;
`;

const Wrapper = styled.div`
  margin-bottom: 1rem;
  width: 100%;
`;

const PrependIcon = styled.i`
  margin-right: 1rem;
  color: var(--blue);
`;

const AppendIcon = styled.i`
  margin-left: 1rem;
  color: var(--blue);
  cursor: pointer;
`;

export default function TextField({
  label,
  value,
  onChange,
  error,
  prependIcon,
  appendIcon,
  appendIconOnClick,
  type = "text",
  disabled = false,
}: any) {
  return (
    <Wrapper>
      <LabelStyle>{label}</LabelStyle>
      <TextFieldWrapper>
        {prependIcon && <PrependIcon className={prependIcon} />}
        <TextFieldStyle
          value={value}
          disabled={disabled}
          onChange={!disabled ? onChange : () => {}}
          type={type}
        />
        {appendIcon && (
          <AppendIcon className={appendIcon} onClick={appendIconOnClick} />
        )}
      </TextFieldWrapper>
      {error && <ErrorStyle>{error}</ErrorStyle>}
    </Wrapper>
  );
}
