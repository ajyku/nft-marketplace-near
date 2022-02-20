import React from 'react'
import Button from '@mui/material/Button';

export default function CustomButton(props) {
  return (
    <Button
      disableElevation
      {...props}
      sx={{
        textTransform: "none",
        fontSize: 18,
        fontWeight: 700,
        padding: "8px 20px",
        borderRadius: 3,
        ...props.sx
      }}
    >{props.children}</Button>
  )
}
