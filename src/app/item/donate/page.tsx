import DonationForm from './DonationForm'

async function DonatePage() {
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
        <DonationForm />
      </div>
    </div>
  )
}

export default DonatePage
