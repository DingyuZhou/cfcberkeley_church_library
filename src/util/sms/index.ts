import AWS from 'aws-sdk'

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
})

const sns = new AWS.SNS()

function sendTextMessageHelper(params: AWS.SNS.PublishInput): Promise<AWS.SNS.PublishResponse> {
  return new Promise((resolve, reject) => {
    sns.publish(params, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

async function sendTextMessage(phoneNumber: string, textMessage: string): Promise<void> {
  const params: AWS.SNS.PublishInput = {
    Message: textMessage,
    PhoneNumber: phoneNumber,
  }

  try {
    const result = await sendTextMessageHelper(params)
    console.log('SMS sent successfully:', result.MessageId)
  } catch (err) {
    console.error('Failed to send SMS:', err)
  }
}

export default sendTextMessage
