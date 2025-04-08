export type InvoiceStatus = "Paid" | "Pending" | "Rejected";

export class Invoice {
  invoiceNumber: string; // Unique identifier
  payee: string;         // Recipient of the invoice
  amount: number;        // Invoice amount in USD or a specified currency
  dueDate: Date;         // Payment due date
  status: InvoiceStatus; // Current status of the invoice

  // Additional fields
  issueDate: Date;       // Date when the invoice was issued
  description?: string;  // Optional description of the invoice
  constructor(
    invoiceNumber: string,
    payee: string,
    amount: number,
    dueDate: Date,
    status: InvoiceStatus,
    issueDate: Date,
    description?: string
  ) {
    this.invoiceNumber = invoiceNumber;
    this.payee = payee;
    this.amount = amount;
    this.dueDate = dueDate;
    this.status = status;
    this.issueDate = issueDate;
    this.description = description;
  }
}

export type PaymentMethod = "Cash" | "Credit" | "ACH" | "Wire";

export class Payment {
  paymentMethod: PaymentMethod; // Method of payment
  amount: number;               // Payment amount
  paymentDate: Date;            // Date of payment
  invoiceNumber: string;        // The associated invoice's unique identifier
  constructor(
    paymentMethod: PaymentMethod,
    amount: number,
    paymentDate: Date,
    invoiceNumber: string
  ) {
    this.paymentMethod = paymentMethod;
    this.amount = amount;
    this.paymentDate = paymentDate;
    this.invoiceNumber = invoiceNumber;
  }
}