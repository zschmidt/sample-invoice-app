const BASE_URL = 'http://localhost:5000/api/invoices';

const InvoiceService = {
  // Fetch all invoices
  async getAllInvoices() {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch invoices: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Fetch a single invoice by ID
  async getInvoiceById(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch invoice with ID ${id}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Create a new invoice
  async createInvoice(invoice) {
    try {
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(invoice),
      });
      if (!response.ok) {
        console.log("here's response ", response)
        throw new Error(`Failed to create invoice: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      throw error;
    }
  },

  // Update an existing invoice
  async updateInvoice(id, updatedInvoice) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedInvoice),
      });
      if (!response.ok) {
        throw new Error(`Failed to update invoice with ID ${id}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },

  // Delete an invoice
  async deleteInvoice(id) {
    try {
      const response = await fetch(`${BASE_URL}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error(`Failed to delete invoice with ID ${id}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      throw error;
    }
  },
};

export default InvoiceService;
