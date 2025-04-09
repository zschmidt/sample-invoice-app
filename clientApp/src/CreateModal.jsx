import React, { useState } from 'react';
import InvoiceTable from './InvoiceTable.jsx'
import InvoiceService from './InvoiceService.js'
import {
    Button,
    Modal,
    Box,
    Typography,
    TextField
} from '@mui/material';
import './CreateModal.css'

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function CreateModal({ addInvoice }) {
    const [open, setOpen] = useState(false);
    const [amountError, setAmountError] = useState(false);
    const [newInvoice, setNewInvoice] = useState({
        payee: '',
        amount: '',
        dueDate: '',
        description: ''
    });

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleChange = (event) => {
      const { name, value } = event.target;
      setNewInvoice({ ...newInvoice, [name]: value });
    };

    const handleAmountChange = (event) => {
      const { name, value } = event.target;
      if(!Number.parseFloat(value)){
        setAmountError(true);
      } else {
        setAmountError(false);
        setNewInvoice({ ...newInvoice, [name]: value });
      }
    };

    const handleSubmit = () => {
      InvoiceService.createInvoice(newInvoice)
        .then((createdInvoice) => {
          console.log("createdInvoice", createdInvoice)
          alert('Invoice created successfully!');
          addInvoice(createdInvoice);
          handleClose();
        })
        .catch((error) => {
          console.error(error);
          alert('Failed to create invoice');
        });
    };


    return (
      <div>
        <Button variant="contained" className="add-button" onClick={handleOpen}>Create New Invoice</Button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={modalStyle}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Create a New Invoice
            </Typography>
            
              <form>
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Payee"
                    name="payee"
                    error={!newInvoice.payee}
                    value={newInvoice.payee}
                    onChange={handleChange}
                  />
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Amount"
                    name="amount"
                    error={amountError || !newInvoice.amount}
                    helperText={
                      amountError ? "The amount can be numeric only!" : ""
                    }
                    value={newInvoice.amount}
                    onChange={handleAmountChange}
                  />
                  <TextField
                    fullWidth
                    required
                    margin="normal"
                    label="Due Date"
                    name="dueDate"
                    type="date"
                    error={!newInvoice.dueDate}
                    value={newInvoice.dueDate}
                    onChange={handleChange}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    margin="normal"
                    label="Description"
                    name="description"
                    value={newInvoice.description}
                    onChange={handleChange}
                    multiline
                    rows={3}
                  />
                  <Box mt={2} textAlign="center">
                    <Button variant="contained" disabled={!newInvoice.dueDate || amountError || !newInvoice.amount || !newInvoice.dueDate} color="primary" onClick={handleSubmit}>
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleClose}
                      sx={{ ml: 2 }}
                    >
                      Cancel
                    </Button>
                  </Box>
              </form>
          </Box>
        </Modal>
      </div>
    );
};