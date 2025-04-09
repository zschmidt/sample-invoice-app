import React, { useState } from 'react';
import InvoiceTable from './InvoiceTable.jsx'
import CreateModal from './CreateModal.jsx'

export default function App() {
  const [invoices, setInvoices] = useState([]);

  const addInvoice = (newInvoice) => {
    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
  };

    return (
      <>
      <InvoiceTable  invoices={invoices} setInvoices={setInvoices} />
      <CreateModal  addInvoice={addInvoice} />
      </>
    );
};