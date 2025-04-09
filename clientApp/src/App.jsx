import React, { useState } from 'react';
import InvoiceTable from './InvoiceTable.jsx';
import CreateModal from './CreateModal.jsx';
import PaymentTable from './PaymentTable.jsx';
import CreatePaymentModal from './CreatePaymentModal.jsx';

export default function App() {
	const [invoices, setInvoices] = useState([]);
	const [payments, setPayments] = useState([]);

	const addInvoice = (newInvoice) => {
		setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
	};

	const addPayment = (newPayment) => {
		setPayments((prevPayments) => [...prevPayments, newPayment]);
	};

	const updateInvoice = (updatedInvoice) => {
		setInvoices((prevInvoices) =>
		    prevInvoices.map((invoice) =>
		      invoice.invoiceNumber === updatedInvoice.invoiceNumber
		        ? updatedInvoice
		        : invoice
		    )
		  );
	};

	return (
		<>
			<InvoiceTable  invoices={invoices} setInvoices={setInvoices} />
			<CreateModal  addInvoice={addInvoice} />
			<PaymentTable payments={payments} setPayments={setPayments}/>
			<CreatePaymentModal invoices={invoices} addPayment={addPayment} updateInvoice={updateInvoice} />
		</>
	);
};