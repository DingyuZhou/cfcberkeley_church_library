import React, { useState, useEffect } from 'react'
import { Grid, TextField, Button } from '@mui/material'
import axios from 'axios'

import { WEB_URL, UNEXPECTED_INTERNAL_ERROR } from 'src/constants'
import { formatPhoneNumberWhileTyping } from 'src/util/string'

import CountdownButton from './CountdownButton'

let generatedPasscode = ''

interface IProps {
  itemId?: string
  onBookBorrowed: (dueAt: string) => void
  isForRenew: boolean
}

function BookBorrowForm({ itemId, onBookBorrowed, isForRenew }: IProps) {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [checkoutPasscode, setCheckoutPasscode] = useState('')
  const [hasSentCheckoutPasscode, setHasSentCheckoutPasscode] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [borrowerUuid, setBorrowerUuid] = useState('')
  const [borrowerOneTimePassword, setBorrowerOneTimePassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isGetPasscodeButtonEnabled, setIsGetPasscodeButtonEnabled] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsGetPasscodeButtonEnabled(true)
    }, 5000)

    return () => {
      clearInterval(timer)
    }
  }, [])

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
      errorText = `The ${isForRenew ? 'renew' : 'checkout'} passcode is invalid`
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
    setCheckoutPasscode('')

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
    if (event) {
      if (event.preventDefault) {
        event.preventDefault()
      }
      if (event.stopPropagation) {
        event.stopPropagation()
      }
    }

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
          isForRenew,
          oneTimePassword: borrowerOneTimePassword,
        })

        if (checkoutResponse?.data?.isSuccess) {
          onBookBorrowed(checkoutResponse?.data?.dueAt)
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

  const handlePhoneNumberChange = (event: any) => {
    const input = event.target.value
    const formattedNumber = formatPhoneNumberWhileTyping(phoneNumber, input)
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
                    label={ isForRenew ? 'Renew Passcode' : 'Checkout Passcode' }
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
          {
            hasSentCheckoutPasscode ? (
              <div style={{ width: '100%', textAlign: 'center', padding: '0 0 30px 0', fontSize: '20px' }}>
                The { isForRenew ? 'renew' : 'checkout' } passcode has just sent you via SMS. It may take a few minutes for it to arrive. Thanks for your patience!
              </div>
            ) : null
          }
          <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading || !isGetPasscodeButtonEnabled}>
            {
              hasSentCheckoutPasscode
                ? (isForRenew ? 'Renew' : 'Checkout')
                : (isForRenew ? 'Get a renew passcode' : 'Get a checkout passcode')
            }
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