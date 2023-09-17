'use client'

import React, { useState, useEffect } from 'react'
import TextField from '@mui/material/TextField'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import axios from 'axios'
import Link from 'next/link'

import { WEB_URL, UNEXPECTED_INTERNAL_ERROR } from 'src/constants'
import { formatPhoneNumberWhileTyping } from 'src/util/string'

interface IDonationFormState {
  firstName: string
  lastName: string
  email: string
  notes: string
}

const initialDonationFormState: IDonationFormState = {
  firstName: '',
  lastName: '',
  email: '',
  notes: '',
}

const DonationForm: React.FC = () => {
  const [donationData, setDonationData] = useState<IDonationFormState>(initialDonationFormState)
  const [isSubmitButtonEnabled, setIsSubmitButtonEnabled] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

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
    setErrorMessage('')
    setDonationData({ ...donationData, [name]: value })
  }

  const validateInput = () => {
    let errorText = ''

    const digitsOnlyPhoneNumber = phoneNumber.replace(/\D/g, '') || ''
    const trimmedFirstName = (donationData.firstName || '').trim()
    const trimmedLastName = (donationData.lastName || '').trim()
    const trimmedEmail = (donationData.email || '').trim()
    const trimmedNotes = (donationData.notes || '').trim()

    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

    if (!trimmedFirstName) {
      errorText = 'The first name is required'
    } else if (!trimmedLastName) {
      errorText = 'The last name is required'
    } else if (digitsOnlyPhoneNumber.length !== 10 || digitsOnlyPhoneNumber[0] === '0') {
      errorText = 'The phone number is invalid'
    } else if (!emailPattern.test(trimmedEmail)) {
      errorText = 'The email address is invalid'
    }

    if (errorText) {
      setErrorMessage(errorText)
      return null
    }

    return {
      phoneNumber,
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      email: trimmedEmail,
      notes: trimmedNotes,
    }
  }

  const submitDonationData = async (event: React.FormEvent) => {
    event.preventDefault()

    const validatedInput = validateInput()

    if (!validatedInput) {
      return
    }

    setErrorMessage('')
    setIsLoading(true)

    let response: any = null

    try {
      response = await axios.post(`${WEB_URL}/api/item/donate`, {
        ...validatedInput,
      })
    } catch (error: any) {
      setErrorMessage(UNEXPECTED_INTERNAL_ERROR)
    }

    const responseData = response?.data

    if (responseData?.isSuccess) {
      setIsDataSubmitted(true)
      setDonationData(initialDonationFormState)
      setPhoneNumber('')
    } else {
      setErrorMessage(responseData?.errorMessage || UNEXPECTED_INTERNAL_ERROR)
    }

    setIsLoading(false)
  }

  if (isDataSubmitted) {
    return (
      <div style={{
        fontSize: '20px',
        padding: '30px 0',
        maxWidth: '600px',
      }}>
        <div style={{ padding: '0 30px' }}>
          <div><strong>The information has been successfully submitted!</strong></div>
          <div style={{ padding: '20px 0' }}>Our team will contact you shortly. Thanks again for your donation!</div>
          <div style={{ padding: '40px 0' }}>
            <Link href="/">Back to the library home page</Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      fontSize: '20px',
      padding: '30px 0',
      maxWidth: '600px',
    }}>
      <div style={{ padding: '0 30px' }}>
        Thanks for your donation! Please fill out the form below. Our team will contact you shortly.
      </div>

      <div style={{ padding: '40px 30px'}}>
        <form onSubmit={submitDonationData}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={donationData.firstName}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={donationData.lastName}
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
                value={donationData.email}
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
                value={donationData.notes}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <div style={{ padding: '20px 0' }}>
                <Button size="large" fullWidth type="submit" variant="contained" color="primary" disabled={isLoading || !isSubmitButtonEnabled}>
                  {isLoading ? 'Submitting' : 'Submit'}
                </Button>
              </div>
            </Grid>

            {
              errorMessage ? (
                <Grid item xs={12} style={{ paddingTop: '10px', color: 'red', textAlign: 'center' }}>{errorMessage}</Grid>
              ) : null
            }
          </Grid>
        </form>
      </div>

      <div style={{ padding: '40px 30px' }}>
        <Link href="/">Back to the library home page</Link>
      </div>
    </div>
  )
}

export default DonationForm
