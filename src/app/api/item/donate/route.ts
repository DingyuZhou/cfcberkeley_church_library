import { NextRequest, NextResponse } from 'next/server'

import sendTextMessage from 'src/util/sms'

export async function POST(request: NextRequest) {
  const { firstName, lastName, phoneNumber, email, notes } = await request.json()
  let isSuccess = true
  let errorMessage = ''

  const digitsOnlyPhoneNumber = (phoneNumber || '').replace(/\D/g, '') || ''
  if (
    !firstName
    || !lastName
  ) {
    isSuccess = false
    errorMessage = 'Invalid first name or last name'
  }

  if (
    !digitsOnlyPhoneNumber
    || digitsOnlyPhoneNumber.length !== 10
  ) {
    isSuccess = false
    errorMessage = 'Invalid phone number'
  }

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  if (!emailPattern.test(email)) {
    isSuccess = false
    errorMessage = 'Invalid email address'
  }

  const textMessage = [
    `New donation comes. Here is donor's information. Please reach out:`,
    `First Name: ${firstName.trim()},`,
    `Last Name: ${lastName.trim()},`,
    `Phone Number: ${phoneNumber},`,
    `Email: ${email},`,
    `Notes: ${notes}`,
  ].join(' ')

  if (isSuccess) {
    try {
      await sendTextMessage(
        process.env.DONATION_MANAGER_PHONE_NUMBER || '',
        textMessage,
      )
    } catch (error: any) {
      isSuccess = false
      errorMessage = error?.message || ''
    }
  }

  return NextResponse.json({
    isSuccess,
    errorMessage,
  })
}
