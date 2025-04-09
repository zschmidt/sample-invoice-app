const BASE_URL = 'http://localhost:5000/api/invoices';

const InvoiceService = {
	// Fetch all invoices
	async getAllInvoices() {
		const response = await fetch(BASE_URL);
		if (!response.ok) {
			throw new Error(`Failed to fetch invoices: ${response.statusText}`);
		}
		return await response.json();
	},

	// Fetch a single invoice by ID
	async getInvoiceById(id) {
		const response = await fetch(`${BASE_URL}/${id}`);
		if (!response.ok) {
			throw new Error(`Failed to fetch invoice with ID ${id}: ${response.statusText}`);
		}
		return await response.json();
	},

	// Create a new invoice
	async createInvoice(invoice) {
		const response = await fetch(BASE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(invoice),
		});
		if (!response.ok) {
			throw new Error(`Failed to create invoice: ${response.statusText}`);
		}
		return await response.json();
	},

	// Update an existing invoice
	async updateInvoice(id, updatedInvoice) {
		const response = await fetch(`${BASE_URL}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(updatedInvoice),
		});
		if (!response.ok) {
			throw new Error(`Failed to update invoice with ID ${id}: ${response.statusText}`);
		}
		return await response.json();
	},

	// Delete an invoice
	async deleteInvoice(id) {
		const response = await fetch(`${BASE_URL}/${id}`, {
			method: 'DELETE',
		});
		if (!response.ok) {
			throw new Error(`Failed to delete invoice with ID ${id}: ${response.statusText}`);
		}
		return await response.json();
	},
};

export default InvoiceService;
