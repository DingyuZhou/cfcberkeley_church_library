'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@mui/material'

import useTisl from 'src/hooks/useTisl'

interface IProps {
  onClick: () => Promise<void>
}

const CountdownButton = ({ onClick }: IProps) => {
  const [countdown, setCountdown] = useState(30)
  const [isButtonEnabled, setIsButtonEnabled] = useState(false)
  const [buttonClickCount, setButtonClickCount] = useState(0)
  const { getUiTisl } = useTisl()

  useEffect(() => {
    setCountdown(30)
    setIsButtonEnabled(false)

    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        if (prevCountdown <= 1) {
          setIsButtonEnabled(true)
          clearInterval(timer)
        }
        return prevCountdown - 1
      })
    }, 1000)

    return () => {
      clearInterval(timer)
    }
  }, [buttonClickCount])

  const handleClick = async () => {
    setIsButtonEnabled(false)
    await onClick()
    setButtonClickCount(buttonClickCount + 1)
  }

  return (
    <Button
      fullWidth
      disabled={!isButtonEnabled}
      variant="outlined"
      size="large"
      onClick={handleClick}
    >{
      countdown <= 0 ? getUiTisl('Resend') : `${getUiTisl('Resend')} (${countdown})`
    }</Button>
  )
}

export default CountdownButton
