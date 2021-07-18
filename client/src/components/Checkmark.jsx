import React from "react";
import styled, { keyframes } from "styled-components";

const Stroke = keyframes`
  100% {
    stroke-dashoffset: 0;
  }
`;

const CircleFill = keyframes`
    100% {
        fill: #7ac142;
    }
`;

const Scale = keyframes`
  0%, 100% {
    transform: none;
  }
  50% {
    transform: scale3d(1.1, 1.1, 1);
  }
`;

const Fill = keyframes`
  100% {
   box-shadow: inset 0px 0px 0px 30px #7ac142;
  }
`;

const CheckmarkCircle = styled.circle`
  stroke-dasharray: 166;
  stroke-dashoffset: 166;
  stroke-width: 2;
  stroke-miterlimit: 10;
  stroke: #7ac142;
  fill: none;
  animation: ${Stroke} 0.5s cubic-bezier(0.65, 0, 0.45, 1) forwards,
    ${CircleFill} 0.5s cubic-bezier(0.65, 0, 0.45, 1) 0.2s forwards;
`;

const CheckmarkStyle = styled.svg`
  width: 200px;
  height: 200px;
  border-radius: 50%;
  display: block;
  stroke-width: 2;
  stroke: #fff;
  stroke-miterlimit: 10;
  box-shadow: inset 0px 0px 0px #7ac142;
  animation: ${Fill} 2s ease-in-out 1s forwards,
    ${Scale} 0.3s ease-in-out 0.9s both;
`;

const CheckmarkCheck = styled.path`
  transform-origin: 50% 50%;
  stroke-dasharray: 48;
  stroke-dashoffset: 48;
  animation: ${Stroke} 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
`;

export default function Checkmark() {
  return (
    <CheckmarkStyle xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
      <CheckmarkCircle cx="26" cy="26" r="25" fill="none" />
      <CheckmarkCheck fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
    </CheckmarkStyle>
  );
}
