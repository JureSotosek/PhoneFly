import * as React from 'react'
const styled = require('styled-components') //Type problems

const Wrapper = styled.div`
  box-sizing: border-box;
  width: 48%;
  height: 16vw;
  padding: 1.5vw;
  border-radius: 4vw;
  box-shadow: 0.3vw 0.3vw 1vw #d6d6d6;

  display: flex;
  flex-direction: row;
  space-between: center;
  align-items: center;

  background-color: white;
  font-size: 7vw;
  font-family: 'Capriola';
`

const HalfWrapper = styled.div`
  flex: 1;
  box-sizing: border-box;
  height: 100%;
  border-radius: 3vw;

  display: flex;
  space-between: center;
  align-items: center;
  justify-content: center;

  background-color: ${({ selected }) => (selected ? 'black' : 'white')};
  color: ${({ selected }) => (selected ? 'white' : 'black')};
`

const UnitsSwitch = ({ units, onChange }) => {
  return (
    <Wrapper onClick={onChange}>
      <HalfWrapper selected={units === 'metric'}>m</HalfWrapper>
      <HalfWrapper selected={units === 'imperial'}>inch</HalfWrapper>
    </Wrapper>
  )
}

export default UnitsSwitch
