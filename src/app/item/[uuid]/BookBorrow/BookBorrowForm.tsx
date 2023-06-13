import React, { useState } from 'react'
import { Grid, TextField, Button } from '@mui/material'
import axios from 'axios'

import { WEB_URL, UNEXPECTED_INTERNAL_ERROR } from 'src/constants'

import CountdownButton from './CountdownButton'

let generatedPasscode = ''

interface IProps {
  itemId?: string
  onBookBorrowed: () => void
}

function BookBorrowForm({ itemId, onBookBorrowed }: IProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [checkoutPasscode, setCheckoutPasscode] = useState('')
  const [hasSentCheckoutPasscode, setHasSentCheckoutPasscode] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [borrowerUuid, setBorrowerUuid] = useState('')
  const [borrowerOneTimePassword, setBorrowerOneTimePassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const validateInput = (shouldValidateCheckoutPasscode: boolean) => {
    const digitsOnlyPhoneNumber = phoneNumber.replace(/\D/g, '') || ''
    let errorText = ''

    if (!firstName) {
      errorText = 'The first name is required'
    } else if (!lastName) {
      errorText = 'The last name is required'
    } else if (digitsOnlyPhoneNumber.length !== 10 || digitsOnlyPhoneNumber[0] === '0') {
      errorText = 'The phone number is invalid'
    } else if (
      shouldValidateCheckoutPasscode
      && hasSentCheckoutPasscode
      && (!checkoutPasscode || checkoutPasscode.length !== 6)
    ) {
      errorText = 'The checkout passcode is invalid'
    }

    if (errorText) {
      setErrorMessage(errorText)
      return null
    }

    return { firstName, lastName, phoneNumber: digitsOnlyPhoneNumber }
  }

  const registerBookBorrower = async () => {
    const validatedInput = validateInput(false)

    if (!validatedInput) {
      return
    }

    setErrorMessage('')
    setIsLoading(true)

    setHasSentCheckoutPasscode(true)
    setBorrowerUuid('')
    setBorrowerOneTimePassword('')

    let registerResponse: any = null

    try {
      registerResponse = await axios.post(`${WEB_URL}/api/book-borrower/register`, {
        ...validatedInput,
        checkoutPasscode: generatedPasscode,
      })
    } catch (error: any) {
      setErrorMessage(UNEXPECTED_INTERNAL_ERROR)
    }

    const responseData = registerResponse?.data

    if (responseData?.isSuccess) {
      setBorrowerUuid(responseData?.borrowerUuid || '')
      setBorrowerOneTimePassword(responseData?.oneTimePassword || '')
    } else {
      setErrorMessage(responseData?.errorMessage || UNEXPECTED_INTERNAL_ERROR)
    }

    setIsLoading(false)
  }

  const handleSubmit = async (event: any) => {
    event.preventDefault()

    const validatedInput = validateInput(hasSentCheckoutPasscode)
    if (!validatedInput) {
      return
    }

    if (hasSentCheckoutPasscode) {
      setIsLoading(true)

      let checkoutResponse: any = null
      try {
        checkoutResponse = await axios.post(`${WEB_URL}/api/item/borrow-checkout`, {
          itemId,
          borrowerUuid,
          checkoutPasscode,
          oneTimePassword: borrowerOneTimePassword,
        })

        if (checkoutResponse?.data?.isSuccess) {
          onBookBorrowed()
        } else {
          setErrorMessage(checkoutResponse?.data?.errorMessage || UNEXPECTED_INTERNAL_ERROR)
          setIsLoading(false)
        }
      } catch (error: any) {
        setErrorMessage(UNEXPECTED_INTERNAL_ERROR)
        setIsLoading(false)
      }
    } else {
      await registerBookBorrower()
    }
  }

  const formatPhoneNumber = (input: string) => {
    // Remove all non-digit characters from the input
    let digitsOnly = input.replace(/\D/g, '')

    if (
      phoneNumber.length > input.length
      && phoneNumber.indexOf(input) === 0
      && digitsOnly === phoneNumber.replace(/\D/g, '')
    ) {
      digitsOnly = digitsOnly.slice(0, -1)
    }

    // Format the phone number
    let formattedNumber = ''

    if (digitsOnly.length >= 1) {
      formattedNumber += `(${digitsOnly.slice(0, 3)}`
    }

    if (digitsOnly.length >= 3) {
      formattedNumber += `) ${digitsOnly.slice(3, 6)}`
    }
    if (digitsOnly.length >= 6) {
      formattedNumber += `-${digitsOnly.slice(6, 10)}`
    }

    return formattedNumber
  }

  const handlePhoneNumberChange = (event: any) => {
    const input = event.target.value
    const formattedNumber = formatPhoneNumber(input)
    setErrorMessage('')
    setPhoneNumber(formattedNumber)
  }

  return (
    <form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="First Name"
            value={firstName}
            onChange={(e) => {
              setErrorMessage('')
              setFirstName(e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="Last Name"
            value={lastName}
            onChange={(e) => {
              setErrorMessage('')
              setLastName(e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            fullWidth
            label="US Phone Number"
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </Grid>
        {
          hasSentCheckoutPasscode ? (
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={7}>
                  <TextField
                    required
                    fullWidth
                    label="Checkout Passcode"
                    value={checkoutPasscode}
                    onChange={(e) => {
                      setErrorMessage('')
                      setCheckoutPasscode(e.target.value)
                    }}
                  />
                </Grid>
                <Grid item xs={5}>
                  <CountdownButton onClick={registerBookBorrower} />
                </Grid>
              </Grid>
            </Grid>
          ) : null
        }
        <Grid item xs={12} style={{ paddingTop: '40px' }}>
          <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading}>
            { hasSentCheckoutPasscode ? 'Checkout' : 'Get a checkout passcode' }
          </Button>
        </Grid>
        {
          errorMessage ? (
            <Grid item xs={12} style={{ paddingTop: '20px', color: 'red', textAlign: 'center' }}>{errorMessage}</Grid>
          ) : null
        }
      </Grid>
    </form>
  )
}

export default BookBorrowForm