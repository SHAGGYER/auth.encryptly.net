import styled from "styled-components";

export const Wrapper = styled.section`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
`;

export const Container = styled.article`
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 100%;
  max-width: ${(props) => (props.width ? props.width : "600px")};
  padding: 2rem;
  box-shadow: 0px 1px 5px 0px rgba(0, 0, 0, 0.2);

  @media screen and (max-width: 640px) {
    width: 100%;
    padding: 1rem;
  }
`;

export const AuthContainer = styled(Container)`
  min-width: 600px;
  @media screen and (max-width: 640px) {
    padding: 3rem 1rem;
    min-width: 100%;
  }
`;

export const Form = styled.form`
  width: 100%;
`;

export const Title = styled.h1`
  font-size: 46px;
  text-align: left;
  margin-bottom: 1rem;

  @media screen and (max-width: 640px) {
    font-size: 32px;
  }
`;

export const Error = styled.div`
  background-color: var(--red);
  border-radius: 7px;
  margin-bottom: 1rem;
  color: white;
  padding: 0.5rem;
  align-self: flex-start;
  width: 100%;
`;

export const Info = styled.div`
  background-color: var(--blue);
  border-radius: 7px;
  margin-bottom: 1rem;
  color: white;
  padding: 0.5rem;
`;

export const Subtitle = styled.h2`
  font-size: 26px;
  text-align: center;
  margin-bottom: 1rem;
  color: var(--blue);
`;

export const UserTitle = styled.h3`
  margin-bottom: 2rem;
  text-align: center;
  font-size: 20px;
`;

export const SubmitButton = styled.button`
  border-radius: 7px;
  background-color: var(--green);
  padding: 1rem;
  outline: none;
  border: none;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }

  @media screen and (max-width: 640px) {
    width: 100%;
  }
`;

export const InfoButton = styled.button`
  border-radius: 7px;
  background-color: var(--blue);
  padding: 1rem;
  outline: none;
  border: none;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;

export const SecondaryButton = styled.button`
  border-radius: 7px;
  background-color: var(--blue);
  padding: 1rem;
  outline: none;
  border: none;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;

export const LogoutButton = styled.button`
  border-radius: 7px;
  background-color: var(--red);
  padding: 1rem;
  outline: none;
  border: none;
  color: white;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
  }
`;

export const AuthButtonsContainer = styled.div`
  align-self: flex-start;
  margin-bottom: 1.5rem;
`;

export const AuthButton = styled.span`
  color: ${(props) => (props.active ? "black" : "#ccc")};
  border-bottom: 1px solid ${(props) => (props.active ? "var(--blue)" : "0")};
  padding-bottom: 0.25rem;
  display: inline-block;
  margin-right: 1rem;
  cursor: pointer;
  font-size: 20px;
`;

export const Grid = styled.div`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: 1fr 1fr;

  @media screen and (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const Divider = styled.div`
  border-bottom: 1px solid #ccc;
  margin: 1rem 0;
`;

export const Link = styled.p`
  color: var(--blue);
  display: inline-block;
  text-decoration: underline;
`;

export const ForgotPasswordWrapper = styled.article`
  margin-top: 1rem;
  display: flex;
  justify-content: flex-start;

  @media screen and (max-width: 640px) {
    justify-content: center;
  }
`;

export const ForgotPasswordLink = styled.a`
  color: var(--blue);
  text-decoration: underline;
  text-align: center;
`;

export const Card = styled.div`
  border: 1px solid #ccc;
  border-radius: 7px;
  padding: 1rem;
  margin-bottom: 1rem;

  & h4 {
    text-decoration: underline;
    font-size: 16px;
    margin-bottom: 1rem;
  }

  & ul {
    padding-left: 1rem;
  }
`;

export const AppsWrapper = styled.article`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;

  @media screen and (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

export const App = styled.div`
  height: 150px;
  padding: 2rem;
  border-radius: 7px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.2);

  & h3 {
    margin-bottom: 1rem;
  }

  & h4 {
    color: var(--blue);
    font-size: 14px;
    margin-bottom: 1rem;
    cursor: pointer;
    text-decoration: underline;
  }

  & h5 {
    color: var(--green);
    text-decoration: underline;
    font-size: 14px;
    cursor: pointer;
  }
`;
