import styled from 'styled-components';

const Input = styled.input`
  border-radius: ${props=>props.theme.borderRadius};
  padding: ${props=>props.theme.padding};
  border: ${props=>props.theme.border};
  outline: ${props=>props.theme.outline};
  color: ${props=>props.theme.color};
  margin: ${props=>props.theme.margin};
  background: ${props=>props.theme.background};
  font-weight: ${props=>props.theme.fontWeight};
  box-shadow: ${props=>props.theme.boxShadow};
`;

Input.defaultProps = {
  theme: {
    borderRadius: '0.2rem',
    padding: '1rem',
    border: '1px solid darkorange',
    outline: 'none',
    color: '#8f3d88',
    margin: '0.5rem 0',
    background: 'white',
    fontWeight: '300',
    boxShadow: 'inset -0.05rem -0.25rem 0.05rem rgba(252, 254, 231, 0.4), inset 0.05rem 0.05rem 0.05rem rgba(143, 61, 136, 0.4), 0.02rem 0.03rem 0.06rem #fcfee7, -0.02rem -0.03rem 0.02rem rgba(218, 11, 98, 0.1)',
  }
}

export default Input;