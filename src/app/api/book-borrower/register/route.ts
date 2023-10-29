import { NextRequest, NextResponse } from 'next/server'

import { getTextInSelectedLanguage } from 'src/constants/language'
import { getDb } from 'src/db/models'
import sendTextMessage from 'src/util/sms'

function generateTextMessage(preferredLanguage: string, passcode: string, isForRenew: boolean) {
  if (isForRenew) {
    return getTextInSelectedLanguage('sms - your renew passcode is', preferredLanguage, [['{{passcode}}', passcode]])
  } else {
    return getTextInSelectedLanguage('sms - your checkout passcode is', preferredLanguage, [['{{passcode}}', passcode]])
  }
}

export async function POST(request: NextRequest) {
  const { firstName, lastName, phoneNumber, preferredLanguage, isForRenew } = await request.json()
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
      await sendTextMessage(phoneNumberWithUsCountryCode, generateTextMessage(preferredLanguage, checkoutPasscode, isForRenew))
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
          SELECT * FROM register_book_borrower(:firstName, :lastName, :phoneNumber, :checkoutPasscode, :preferredLanguage);
        `,
        {
          type: db.QueryTypes.SELECT,
          replacements: {
            firstName,
            lastName,
            checkoutPasscode,
            preferredLanguage,
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
