'use client'

import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'

import { formatPhoneNumberWhileTyping } from 'src/util/string'

interface DonationFormState {
  firstName: string
  lastName: string
  email: string
  notes: string
}

const initialDonationFormState: DonationFormState = {
  firstName: '',
  lastName: '',
  email: '',
  notes: '',
}

const DonationForm: React.FC = () => {
  const [DonationData, setDonationData] = useState<DonationFormState>(initialDonationFormState)
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    const timer = setInterval(() => {
      setIsSubmitButtonEnabled(true)
    }, 10000)

    return () => {
      clearInterval(timer)
    }
  }, [])

  const handlePhoneNumberChange = (event: any) => {
    const input = event.target.value
    const formattedNumber = formatPhoneNumberWhileTyping(phoneNumber, input)
    setErrorMessage('')
    setPhoneNumber(formattedNumber)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setDonationData({ ...DonationData, [name]: value })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Donation Data:', DonationData)
    setDonationData(initialDonationFormState)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="First Name"
            name="firstName"
            value={DonationData.firstName}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Last Name"
            name="lastName"
            value={DonationData.lastName}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Phone Number"
            name="phoneNumber"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={DonationData.email}
            onChange={handleInputChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            minRows={6}
            placeholder="The books you wish to donate, or any other information you would like us to know"
            label="Notes for your donation"
            name="notes"
            value={DonationData.notes}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{ padding: '20px 0' }}>
            <Button size="large" fullWidth type="submit" variant="contained" color="primary" disabled={!isSubmitButtonEnabled}>
              Submit
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  )
}

export default DonationForm
