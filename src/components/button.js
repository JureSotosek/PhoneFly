import styled from 'styled-components'

const Button = styled.div`
  width: 45%;
  height: 16vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${({ disabled, color }) => (disabled ? '#F6F6F6' : color)};
  color: ${({ disabled, fontColor }) => (disabled ? '#C3C3C3' : fontColor)};
  font-size: 7vw;
  font-family: 'Capriola';
`

export default Button
