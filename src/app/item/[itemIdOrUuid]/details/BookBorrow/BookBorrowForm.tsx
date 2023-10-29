'use client'

import React, { useState, useEffect } from 'react'
import { Grid, TextField, Button } from '@mui/material'
import axios from 'axios'

import { WEB_URL, UNEXPECTED_INTERNAL_ERROR } from 'src/constants'
import { formatPhoneNumberWhileTyping } from 'src/util/string'
import useTisl from 'src/hooks/useTisl'

import CountdownButton from './CountdownButton'

interface IProps {
  itemId?: string
  itemTitle?: string
  onBookBorrowed: (dueAt: string) => void
  isForRenew: boolean
}

function BookBorrowForm({ itemId, itemTitle, onBookBorrowed, isForRenew }: IProps) {
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
  const { getUiTisl, selectedLanguage } = useTisl()

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

    const trimmedFirstName = (firstName || '').trim()
    const trimmedLastName = (lastName || '').trim()

    if (!trimmedFirstName) {
      errorText = getUiTisl('First name is required')
    } else if (!trimmedLastName) {
      errorText = getUiTisl('Last name is required')
    } else if (digitsOnlyPhoneNumber.length !== 10 || digitsOnlyPhoneNumber[0] === '0') {
      errorText = getUiTisl('Phone number is invalid')
    } else if (
      shouldValidateCheckoutPasscode
      && hasSentCheckoutPasscode
      && (!checkoutPasscode || checkoutPasscode.length !== 6)
    ) {
      errorText = isForRenew ? getUiTisl('Renew passcode is invalid') : getUiTisl('Checkout passcode is invalid')
    }

    if (errorText) {
      setErrorMessage(errorText)
      return null
    }

    return {
      firstName: trimmedFirstName,
      lastName: trimmedLastName,
      phoneNumber: digitsOnlyPhoneNumber,
    }
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
        isForRenew,
        preferredLanguage: selectedLanguage,
      })
    } catch (error: any) {
      setErrorMessage(getUiTisl(UNEXPECTED_INTERNAL_ERROR))
    }

    const responseData = registerResponse?.data

    if (responseData?.isSuccess) {
      setBorrowerUuid(responseData?.borrowerUuid || '')
      setBorrowerOneTimePassword(responseData?.oneTimePassword || '')
    } else {
      setErrorMessage(getUiTisl(responseData?.errorMessage || UNEXPECTED_INTERNAL_ERROR))
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
          itemTitle,
          borrowerUuid,
          checkoutPasscode,
          isForRenew,
          oneTimePassword: borrowerOneTimePassword,
          preferredLanguage: selectedLanguage,
        })

        if (checkoutResponse?.data?.isSuccess) {
          onBookBorrowed(checkoutResponse?.data?.dueAt)
        } else {
          setErrorMessage(getUiTisl(checkoutResponse?.data?.errorMessage || UNEXPECTED_INTERNAL_ERROR))
          setIsLoading(false)
        }
      } catch (error: any) {
        setErrorMessage(getUiTisl(UNEXPECTED_INTERNAL_ERROR))
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
            fullWidth
            label={`${getUiTisl('First Name')} *`}
            value={firstName}
            onChange={(e) => {
              setErrorMessage('')
              setFirstName(e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={`${getUiTisl('Last Name')} *`}
            value={lastName}
            onChange={(e) => {
              setErrorMessage('')
              setLastName(e.target.value)
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label={`${getUiTisl('US Phone Number')} *`}
            value={phoneNumber}
            onChange={handlePhoneNumberChange}
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{
            fontSize: '14px',
            fontStyle: 'italic',
            color: 'gray',
            textAlign: 'left',
          }}>
            {getUiTisl('* marked fields are required')}
          </div>
        </Grid>

        {
          hasSentCheckoutPasscode ? (
            <Grid item xs={12}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={7}>
                  <TextField
                    required
                    fullWidth
                    label={ isForRenew ? getUiTisl('Renew Passcode') : getUiTisl('Checkout Passcode') }
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
          <Button fullWidth variant="contained" type="submit" size="large" disabled={isLoading || !isGetPasscodeButtonEnabled}>
            {
              hasSentCheckoutPasscode
                ? (isForRenew ? getUiTisl('Renew') : getUiTisl('Checkout'))
                : (isForRenew ? getUiTisl('Get renew passcode') : getUiTisl('Get checkout passcode'))
            }
          </Button>

          {
            hasSentCheckoutPasscode ? (
              <div style={{ width: '100%', textAlign: 'center', padding: '25px 0 0 0', fontSize: '20px' }}>
                {
                  isForRenew ? getUiTisl('Renew passcode has sent') : getUiTisl('Checkout passcode has sent')
                }
              </div>
            ) : null
          }
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