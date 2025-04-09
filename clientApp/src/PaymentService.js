const BASE_URL = 'http://localhost:5000/api/payments';

const PaymentService = {
	// Fetch all payments
	async getAllPayments() {
		const response = await fetch(BASE_URL);
		if (!response.ok) {
			throw new Error(`Failed to fetch payments: ${response.statusText}`);
		}
		return await response.json();
	},

	// Create a new payment
	async createPayment(payment) {
		const response = await fetch(BASE_URL, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payment),
		});
		if (!response.ok) {
			throw new Error(`Failed to create payment: ${response.statusText}`);
		}
		return await response.json();
	}
};

export default PaymentService;
