import cors from 'cors';
import express, { json, Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsDoc from 'swagger-jsdoc';
import { Invoice, Payment } from 'shared';

const app = express();
app.use(json());
app.use(cors());

const router = Router();

// Swagger setup
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "Invoice API",
			version: "1.0.0",
			description: "A simple CRUD API for managing invoices",
		},
		servers: [
			{
				url: "http://localhost:5000/",
			},
		],
	},
	apis: ["./server.js"], // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/api', router);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const invoices = [];
const payments = [];

/**
 * @swagger
 * /api/invoices/:
 *   get:
 *     summary: Get all invoices
 *     responses:
 *       200:
 *         description: A list of invoices
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Invoice'
 */
// Get all invoices
router.get('/invoices/', (req, res) => {
	res.json(invoices);
});

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get an invoice by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: The requested invoice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Invalid invoiceNumber format
 *       404:
 *         description: Invoice not found
 */
// Get a single invoice
router.get('/invoices/:id', (req, res) => {
	const { id } = req.params;

	const parsedId = parseInt(id);

	if(!parsedId) {
		return res.status(400).json({ message: "Invalid invoiceNumber" });
	}

	const invoice = invoices.find((inv) => inv.invoiceNumber === parsedId);

	if (!invoice) {
		return res.status(404).json({ message: "Invoice not found" });
	}

	res.json(invoice);
});

/**
 * @swagger
 * /api/invoices/:
 *   post:
 *     summary: Create a new invoice
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       201:
 *         description: Invoice created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Missing any of {payee, amount, dueDate}
 */
// Make a new invoice
router.post('/invoices/', (req, res) => {
	const { payee, amount, dueDate, description } = req.body;

	if(!payee) {
		return res.status(400).json({ message: "Required field 'payee' not found" });
	}

	if(!amount || !Number.parseFloat(amount)) {
		return res.status(400).json({ message: "Required field 'amount' not found or is not a number" });
	}

	if(!dueDate || !Date.parse(dueDate)) {
		return res.status(400).json({ message: "Required field 'dueDate' not found or in an incorrect format (must be ISO 8601 i.e. '2025-04-01')" });
	}

	//Eww! Sequential primary key!
	const invoiceNumber = invoices.length ? invoices[invoices.length - 1].invoiceNumber + 1 : 1;

	const newInvoice = new Invoice(
		invoiceNumber,
		payee,
		Number.parseFloat(amount),
		new Date(dueDate),
		'Pending',
		new Date(),
		description);
	invoices.push(newInvoice); // Add to in-memory storage (specifically to the back, to not break my flimsy sequential ID)
	res.status(201).json(newInvoice);
});

/**
 * @swagger
 * /api/invoices/{id}:
 *   put:
 *     summary: Updates an invoice by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The invoice ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Invoice'
 *     responses:
 *       200:
 *         description: The updated invoice
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Invoice'
 *       400:
 *         description: Invalid field update or attempt to update a non Pending invoice
 *       404:
 *         description: Invoice not found
 */
// Update an invoice
router.put('/invoices/:id', (req, res) => {

	const { id } = req.params;

	const parsedId = parseInt(id);

	if(!parsedId) {
		return res.status(400).json({ message: "Invalid invoiceNumber" });
	}

	const index = invoices.findIndex((inv) => inv.invoiceNumber === parsedId);

	if (!index) {
		return res.status(404).json({ message: "Invoice not found" });
	}

	if(invoices[index].status !== 'Pending') {
		return res.status(400).json({ message: "Cannot modify a Paid or Rejected invoice!" });
	}

	const { payee, amount, dueDate, description } = req.body;

	if(!payee && !amount && !dueDate && !description) {
		return res.status(400).json({ message: "No valid field is being updated!" });
	}

	if(amount && !Number.parseFloat(amount)) {
		return res.status(400).json({ message: "Field 'amount' is not a number" });
	}

	if(dueDate && !Date.parse(dueDate)) {
		return res.status(400).json({ message: "Field 'dueDate' is in an incorrect format (must be ISO 8601 i.e. '2025-04-01')" });
	}

	const oldInvoice = invoices[index];

	const updatedInvoice = new Invoice(
		oldInvoice.invoiceNumber,
		payee || oldInvoice.payee,
		amount ? Number.parseFloat(amount) : oldInvoice.amount,
		dueDate ? new Date(dueDate) : oldInvoice.dueDate,
		oldInvoice.status,
		oldInvoice.issueDate,
		description || oldInvoice.description);

	invoices.splice(index, 1, updatedInvoice);
	res.json(updatedInvoice);
});


/**
 * @swagger
 * /api/invoices/{id}:
 *   delete:
 *     summary: Deletes an invoice by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The invoice ID
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *       400:
 *         description: Invalid invoiceNumber format
 *       404:
 *         description: Invoice not found
 */
// Delete an invoice
router.delete('/invoices/:id', (req, res) => {

	const { id } = req.params;

	const parsedId = parseInt(id);

	if(!parsedId) {
		return res.status(400).json({ message: "Invalid invoiceNumber" });
	}

	const index = invoices.findIndex((inv) => inv.invoiceNumber === parsedId);

	if (index === -1) {
		return res.status(404).json({ message: "Invoice not found" });
	}

	invoices.splice(index, 1);
	return res.status(200).json({ message: "Invoice deleted successfully" });
});

/**
 * @swagger
 * /api/payments/:
 *   get:
 *     summary: Get all payments
 *     responses:
 *       200:
 *         description: A list of payments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 */
// Get all payments
router.get('/payments/', (req, res) => {
	res.json(payments);
});

/**
 * @swagger
 * /api/payments/:
 *   post:
 *     summary: Create a new payment
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Payment'
 *     responses:
 *       201:
 *         description: Payment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Payment'
 *       400:
 *         description: Tried to pay for an invalid invoice
 */
// Make a new payment
router.post('/payments/', (req, res) => {

	const { invoiceNumber, paymentMethod } = req.body;

	// Validate input
	if (!invoiceNumber || !parseInt(invoiceNumber) || !paymentMethod) {
		return res.status(400).json({ error: 'Invalid request payload' });
	}

	if (paymentMethod != 'Cash' &&
        paymentMethod != 'Credit' &&
        paymentMethod != 'ACH' &&
        paymentMethod != 'Wire') {
		return res.status(400).json({ error: 'Invalid payment method' });
	}

	// Find the invoice
	const invoiceIndex = invoices.findIndex((inv) => inv.invoiceNumber === parseInt(invoiceNumber));

	if (invoiceIndex === -1) {
		return res.status(400).json({ error: 'Invoice not found' });
	}

	const invoice = invoices[invoiceIndex];

	// Validate invoice status and amount
	if (invoice.status !== 'Pending') {
		return res.status(400).json({ error: 'Invoice is not in a payable state' });
	}

	// Create the payment
	const newPayment = new Payment(
		paymentMethod,
		invoice.amount,
		new Date(),
		invoiceNumber
	);

	payments.push(newPayment);

	//TODO: Maybe this is where the payment could fail and we move to the `Rejected` state
	const updatedInvoice = { ...invoice, status: 'Paid' };

	invoices.splice(invoiceIndex, 1, updatedInvoice);

	res.status(201).json(newPayment);
});


/*This could introduce drift, but making this _also_ read from the
*  shared model is a battle that I don't want to fight today....
*/
/**
 * @swagger
 * components:
 *   schemas:
 *     Invoice:
 *       type: object
 *       required:
 *         - payee
 *         - amount
 *         - dueDate
 *       properties:
 *         invoiceNumber:
 *           type: number
 *           description: System generated unique identifier for the invoice
 *           example: 1
 *           readOnly: true
 *         payee:
 *           type: string
 *           description: Recipient of the invoice
 *           example: 'Jane Doe'
 *         amount:
 *           type: number
 *           description: Invoice amount
 *           example: 10.50
 *         dueDate:
 *           type: string
 *           format: date
 *           description: Payment due date
 *           example: 2025-05-01
 *         status:
 *           type: string
 *           enum: 
 *              - Paid
 *              - Pending
 *              - Rejected
 *           description: Current status of the invoice (set to Pending upon creation)
 *           readOnly: true
 *         issueDate:
 *           type: string
 *           format: date
 *           description: System generated date the invoice was issued
 *           example: 2025-04-01
 *           readOnly: true
 *         description:
 *           type: string
 *           description: Optional information about the invoice
 *           example: 'For building an invoice API'
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       required:
 *         - paymentMethod
 *         - invoiceNumber
 *       properties:
 *         paymentMethod:
 *           type: string
 *           description: Method of payment
 *           enum:
 *             - Cash
 *             - Credit
 *             - ACH
 *             - Wire
 *         amount:
 *           type: number
 *           description: Payment amount
 *           format: float
 *           readOnly: true
 *         paymentDate:
 *           type: string
 *           format: date
 *           description: Date of payment
 *           readOnly: true
 *         invoiceNumber:
 *           type: number
 *           description: The associated invoice's unique identifier
 */
