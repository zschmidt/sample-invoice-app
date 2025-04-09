import React, { useState } from 'react';
import PaymentService from './PaymentService.js';
import {
	Button,
	Modal,
	Box,
	Typography,
	TextField,
	InputLabel,
	Select,
	MenuItem
} from '@mui/material';
import './CreateModal.css';

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

export default function CreatePaymentModal({ invoices, addPayment, updateInvoice}) {
	const [open, setOpen] = useState(false);
	const [selectedInvoice, setSelectedInvoice] = useState("");
	const [newPayment, setNewPayment] = useState({
		paymentMethod: '',
		invoiceNumber: ''
	});

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	const handlePaymentMethod = (method) => {
		setNewPayment({ ...newPayment, ['paymentMethod']: method });
	};

	const handleSelectedInvoice = (invoice) => {
		//I'm sure there's a better way to manage this, but I want the selected invoice to persist as well...
		setNewPayment({ ...newPayment, ['invoiceNumber']: invoice.invoiceNumber });
	};

	const handleSubmit = () => {
		PaymentService.createPayment(newPayment)
			.then((createdPayment) => {
				updateInvoice({ ...selectedInvoice, status: "Paid" });
				addPayment(createdPayment);
				setNewPayment({
					paymentMethod: '',
					invoiceNumber: ''
				});
				handleClose();
			})
			.catch(() => {
				alert('Failed to create payment');
			});
	};

	return (
		<div>
			<Button variant="contained" className="add-button" onClick={handleOpen}>Make a Payment</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={modalStyle}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
              Make a Payment
					</Typography>
            
					<form>
						<InputLabel id="invoice-label">Select An Invoice</InputLabel>
				          <Select
				            labelId="invoice-label"
				            value={selectedInvoice}
				            onChange={(e) => {
				            	setSelectedInvoice(e.target.value);
				            	handleSelectedInvoice(e.target.value);
				            }}
				            sx={{ width: "300px" }}
				          >
				            {invoices
				              .filter((inv) => inv.status === "Pending")
				              .map((inv) => (
				                <MenuItem key={inv.invoiceNumber} value={inv}>
				                  {`Invoice #${inv.invoiceNumber} - ${inv.payee} - $${inv.amount.toFixed(2)}`}
				                </MenuItem>
				              ))}
				          </Select>

				          <InputLabel id="payment-method-label">Payment Method</InputLabel>
				          <Select
				            labelId="payment-method-label"
				            value={newPayment.paymentMethod}
				            onChange={(e) => handlePaymentMethod(e.target.value)}
				            sx={{ width: "300px" }} // Adjust width of the dropdown selector
				          >
				            {["Cash", "Credit", "ACH", "Wire"].map((method) => (
				              <MenuItem key={method} value={method}>
				                {method}
				              </MenuItem>
				            ))}
				          </Select>
						
						<Box mt={2} textAlign="center">
							<Button variant="contained" disabled={!selectedInvoice || !newPayment.paymentMethod} color="primary" onClick={handleSubmit}>
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