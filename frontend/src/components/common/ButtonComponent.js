import React from 'react'
import { Button } from 'react-bootstrap'

function ButtonComponent(props) {
  return (
    <Button variant="primary" type="submit" className="mt-3 w-100">
    {props.name}
  </Button>
  )
}

export default ButtonComponent