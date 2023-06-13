import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

export interface IAlertProps {
  isOpen: boolean
  title: string
  onYes: () => void
  onNo: () => void
  children: any
  isLoading?: boolean
  errorMessage?: string
}

export default function AlertDialog({ isOpen, title, children, onYes, onNo, isLoading, errorMessage }: IAlertProps) {
  return (
    <Dialog
      open={isOpen}
      onClose={onNo}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {children}
        {
          errorMessage ? (
            <div style={{ padding: '30px 0 10px 0', color: 'red', textAlign: 'center' }}>
              {errorMessage}
            </div>
          ) : null
        }
      </DialogContent>
      <DialogActions style={{ paddingBottom: '20px', paddingRight: '25px' }}>
        <Button
          onClick={onNo}
          variant="contained"
          color="secondary"
          style={{
            width: '100px',
            marginRight: '10px',
          }}
          disabled={isLoading === true}
        >
          No
        </Button>
        <Button
          autoFocus
          onClick={onYes}
          variant="contained"
          color="primary"
          style={{ width: '100px' }}
          disabled={isLoading === true}
        >
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  )
}
