import cors from 'cors';
import express, { json, Router } from 'express';

const app = express();
app.use(json());
app.use(cors());

const router = Router();

app.use('/api/invoices', router);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const invoices = [];

// Get all invoices
router.get('/', (req, res) => {
    // do your code here
    console.log("Get all invoices", invoices);
});

// Delete an invoice
router.delete('/:id', (req, res) => {
    console.log("Delete an invoice", id);
});
