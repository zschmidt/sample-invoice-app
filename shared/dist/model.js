export class Invoice {
    constructor(invoiceNumber, payee, amount, dueDate, status, issueDate, description) {
        this.invoiceNumber = invoiceNumber;
        this.payee = payee;
        this.amount = amount;
        this.dueDate = dueDate;
        this.status = status;
        this.issueDate = issueDate;
        this.description = description;
    }
}
export class Payment {
    constructor(paymentMethod, amount, paymentDate, invoiceNumber) {
        this.paymentMethod = paymentMethod;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.invoiceNumber = invoiceNumber;
    }
}
