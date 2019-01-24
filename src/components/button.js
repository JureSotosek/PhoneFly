import styled from 'styled-components'

const Button = styled.div`
  border: none;

  width: 45%;
  height: 16vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ disabled, color }) =>
    disabled ? 'lightGrey' : color};
  color: ${({ disabled, fontColor }) => (disabled ? 'black' : fontColor)};
  font-size: 7vw;
  font-family: 'Capriola';
`

export default Button
