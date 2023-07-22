'use client'

import React, { useState } from 'react'
import axios from 'axios'
import { Grid, TextField, Button } from '@mui/material'
import { useRouter } from 'next/navigation'

import { WEB_URL } from 'src/constants'

function SignInForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const router = useRouter()

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value)
  }

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    setIsSubmitting(true)

    try {
      await axios({
        method: 'post',
        url: `${WEB_URL}/api/member/authenticate`,
        data: {
          email,
          password,
        }
      })
      router.replace('/')
      router.refresh()
    } catch (error: any) {
      console.log(error)
      setErrorMessage(
        error?.response?.data?.error?.message || 'The email or password may not be correct'
      )
      setIsSubmitting(false)
    }
  }

  return (
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="center"
      style={{ height: '100vh' }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4} style={{ maxWidth: '400px', paddingBottom: '20vh' }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <h1 style={{ textAlign: 'center' }}>Sign In</h1>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="email"
                label="Email"
                variant="outlined"
                value={email}
                onChange={handleEmailChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                type="password"
                label="Password"
                variant="outlined"
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>
            <Grid item xs={12} style={{ paddingTop: '40px' }}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={isSubmitting}
              >
                Sign In
              </Button>
            </Grid>
            {
              errorMessage ? (
                <Grid item xs={12} style={{ paddingTop: '20px', color: 'red', textAlign: 'center' }}>{errorMessage}</Grid>
              ) : null
            }
          </Grid>
        </form>
      </Grid>
    </Grid>
  )
}

export default SignInForm
