import styled from 'styled-components';

const Button = styled.button`
  background: ${props=>props.theme.background};
  font-size: 1em;
  margin: ${props=>props.theme.main};
  padding: ${props=>props.theme.padding};
  border-radius: 3px;
  color: ${props=>props.theme.main};
  border: 1px solid ${props=>props.theme.main};
  height: ${props=>props.theme.height};
  align-self: ${props=>props.theme.alignSelf};
`;

Button.defaultProps = {
  theme: {
    main: 'darkorange',
    background: 'white',
    margin: '5px',
    padding: '5px',
    height: '70%',
    alignSelf: 'center',
  }
};

export default Button;