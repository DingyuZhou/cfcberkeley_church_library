import { NextRequest, NextResponse } from 'next/server'

import { getDb } from 'src/db/models'
import sendTextMessage from 'src/util/sms'

function generateTextMessage(checkoutPasscode: string) {
  return `Your 6-digit checkout passcode to borrow a book from CFC Berkeley Church library is: ${checkoutPasscode}`
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, phoneNumber } = await request.json()
  let isSuccess = true
  let errorMessage = ''

  // Generate a random passcode
  const checkoutPasscode = Math.floor(100000 + Math.random() * 900000).toString()

  const digitsOnlyPhoneNumber = (phoneNumber || '').replace(/\D/g, '') || ''
  if (
    !firstName
    || !lastName
    || !digitsOnlyPhoneNumber
    || digitsOnlyPhoneNumber.length !== 10
  ) {
    isSuccess = false
    errorMessage = 'Invalid inputs'
  }

  const phoneNumberWithUsCountryCode = `+1${digitsOnlyPhoneNumber}`

  if (isSuccess) {
    try {
      await sendTextMessage(phoneNumberWithUsCountryCode, generateTextMessage(checkoutPasscode))
    } catch (error: any) {
      isSuccess = false
      errorMessage = error?.message || ''
    }
  }

  const { db } = getDb()
  let registerResponse: any = null

  if (isSuccess) {
    try {
      registerResponse = await db.query(
        `
          SELECT * FROM register_book_borrower(:firstName, :lastName, :phoneNumber, :checkoutPasscode);
        `,
        {
          type: db.QueryTypes.SELECT,
          replacements: {
            firstName,
            lastName,
            checkoutPasscode,
            phoneNumber: phoneNumberWithUsCountryCode,
          },
        },
      )
    } catch (error: any) {
      isSuccess = false
      errorMessage = error?.message || ''
    }
  }

  const responseData = registerResponse?.[0]

  return NextResponse.json({
    isSuccess,
    errorMessage,
    borrowerUuid: responseData?.['borrower_uuid'] || '',
    oneTimePassword: responseData?.['one_time_password'] || '',
  })
}
