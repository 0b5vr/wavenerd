import styled from 'styled-components';

const SVG = styled.svg`
  fill: currentColor;
`;

const Root = styled.div`
  width: 32px;
  height: 32px;
`;

export function HeaderOBSVR() {
  return (
    <Root>
      <SVG width="100%" height="100%" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 3l0 2l6 0l0 -2zM5 11l0 2l6 0l0 -2zM3 5l0 6l2 0l0 -6zM11 5l0 6l2 0l0 -6zM7 7l0 2l2 0l0 -2z" />
      </SVG>
    </Root>
  );
}
