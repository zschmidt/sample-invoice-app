export type InvoiceStatus = "Paid" | "Pending" | "Rejected";
export declare class Invoice {
    invoiceNumber: number;
    payee: string;
    amount: number;
    dueDate: Date;
    status: InvoiceStatus;
    issueDate: Date;
    description?: string;
    constructor(invoiceNumber: number, payee: string, amount: number, dueDate: Date, status: InvoiceStatus, issueDate: Date, description?: string);
}
export type PaymentMethod = "Cash" | "Credit" | "ACH" | "Wire";
export declare class Payment {
    paymentMethod: PaymentMethod;
    amount: number;
    paymentDate: Date;
    invoiceNumber: string;
    constructor(paymentMethod: PaymentMethod, amount: number, paymentDate: Date, invoiceNumber: string);
}
