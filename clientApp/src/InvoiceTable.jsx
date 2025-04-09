import React, { useEffect, useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Paper,
	Typography,
	CircularProgress,
	TablePagination,
	TableSortLabel,
	IconButton
} from '@mui/material';
import { Invoice } from 'shared';
import { Delete } from '@mui/icons-material';
import InvoiceService from './InvoiceService.js'

export default function InvoiceTable({ invoices, setInvoices }) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
	const [orderBy, setOrderBy] = useState('invoiceNumber'); // Column to sort by
	const [page, setPage] = useState(0); // Current page
	const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page

	const handleSort = (property) => {
		const isAscending = orderBy === property && order === 'asc';
		setOrder(isAscending ? 'desc' : 'asc');
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const sortedInvoices = [...invoices].sort((a, b) => {
		if (orderBy === 'amount' || orderBy === 'invoiceNumber') {
			return order === 'asc' ?
				a[orderBy] > b[orderBy] ?
					1 :
					-1 :
				a[orderBy] < b[orderBy] ?
					1 :
					-1;
		}
		if (orderBy === 'dueDate' || orderBy === 'issueDate') {
			return order === 'asc' ?
				new Date(a[orderBy]) - new Date(b[orderBy]) :
				new Date(b[orderBy]) - new Date(a[orderBy]);
		}
		return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
	});

	const paginatedInvoices = sortedInvoices.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	// Fetch invoices from the API using fetch
	useEffect(() => {
		const fetchInvoices = () => {
			InvoiceService.getAllInvoices()
				.then((data) => {
					setInvoices(data);
				})
				.catch((error) => {
					setError(error.message || 'Something went wrong');
				})
				.finally(() => {
					setLoading(false);
				});
		};

		fetchInvoices();
	}, [setInvoices]);

	const handleDelete = (invoiceNumber) => {

		InvoiceService.deleteInvoice(invoiceNumber)
			.then(() => {
				setInvoices((prevInvoices) =>
					prevInvoices.filter((invoice) => invoice.invoiceNumber !== invoiceNumber)
				);
			})
			.catch((error) => {
				alert('Error deleting invoice:', error);
			})
	};

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer>
				<Typography variant="h6" sx={{ p: 2 }}>
          Invoice List
				</Typography>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{[
								{ id: 'invoiceNumber', label: 'Invoice Number' },
								{ id: 'payee', label: 'Payee' },
								{ id: 'amount', label: 'Amount ($)' },
								{ id: 'dueDate', label: 'Due Date' },
								{ id: 'status', label: 'Status' },
								{ id: 'issueDate', label: 'Issue Date' },
								{ id: 'description', label: 'Description' },
							].map((column) => (
								<TableCell key={column.id}>
									<TableSortLabel
										active={orderBy === column.id}
										direction={orderBy === column.id ? order : 'asc'}
										onClick={() => handleSort(column.id)}
									>
										{column.label}
									</TableSortLabel>
								</TableCell>
							))}
							<TableCell>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedInvoices.map((invoice) => (
							<TableRow hover key={invoice.invoiceNumber}>
								<TableCell>{invoice.invoiceNumber}</TableCell>
								<TableCell>{invoice.payee}</TableCell>
								<TableCell>{invoice.amount.toFixed(2)}</TableCell>
								<TableCell>{new Date(invoice.dueDate).toLocaleDateString()}</TableCell>
								<TableCell>{invoice.status}</TableCell>
								<TableCell>{new Date(invoice.issueDate).toLocaleDateString()}</TableCell>
								<TableCell>{invoice.description || 'N/A'}</TableCell>
								<TableCell>
									<IconButton
										aria-label="delete"
										color="error"
										onClick={() => handleDelete(invoice.invoiceNumber)}
									>
										<Delete />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={invoices.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};