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
	IconButton,
	Modal,
	Box,
	TextField,
	Button
} from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { DatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { Invoice } from 'shared';
import { Delete } from '@mui/icons-material';
import InvoiceService from './InvoiceService.js';

dayjs.extend(utc);

export default function InvoiceTable({ invoices, setInvoices }) {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [amountError, setAmountError] = useState(false);
	const [order, setOrder] = useState('asc'); // 'asc' or 'desc'
	const [orderBy, setOrderBy] = useState('invoiceNumber'); // Column to sort by
	const [page, setPage] = useState(0); // Current page
	const [rowsPerPage, setRowsPerPage] = useState(10); // Rows per page
	const [openModal, setOpenModal] = useState(false);
	const [currentInvoice, setCurrentInvoice] = useState(null);

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
			});
	};

	const handleRowClick = (invoice) => {
		setCurrentInvoice(invoice);
		setOpenModal(true);
	};

	const handleModalClose = () => {
		setOpenModal(false);
		setCurrentInvoice(null);
	};

	const handleSave = async () => {
		InvoiceService.updateInvoice(currentInvoice.invoiceNumber, currentInvoice)
			.then(() => {
				setInvoices((prevInvoices) =>
					prevInvoices.map((invoice) =>
						invoice.invoiceNumber === currentInvoice.invoiceNumber ? currentInvoice : invoice
					)
				);

				handleModalClose();
			})
			.catch((err) => {
				alert("Error updating invoice: ", err);
			});
			
	};

	const handleDateChange = (dayjsObject) => {
		setCurrentInvoice((prev) => ({ ...prev, ['dueDate']: dayjsObject.format('YYYY-MM-DD') }));
	};

	const handleAmountChange = (event) => {
		const { name, value } = event.target;
		if(!Number.parseFloat(value)){
			setAmountError(true);
		} else {
			setAmountError(false);
		}
		//seems gross to still set the value if it's wrong,
		// but the submit button is disabled, and it prevents an error
		// where you can't delete the last number in amount
		setCurrentInvoice((prev) => ({ ...prev, [name]: value }));
	};

	const handleChange = (event) => {
		const { name, value } = event.target;
		setCurrentInvoice((prev) => ({ ...prev, [name]: value }));
	};

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	return (
		<>
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
								<TableRow hover 
									key={invoice.invoiceNumber}
									onClick={() => handleRowClick(invoice)}
									style={{ cursor: 'pointer' }}>
									<TableCell>{invoice.invoiceNumber}</TableCell>
									<TableCell>{invoice.payee}</TableCell>
									<TableCell>{Number.parseFloat(invoice.amount).toFixed(2)}</TableCell>
									<TableCell>{dayjs.utc(invoice.dueDate).format('M/D/YYYY')}</TableCell>
									<TableCell>{invoice.status}</TableCell>
									<TableCell>{dayjs.utc(invoice.issueDate).format('M/D/YYYY')}</TableCell>
									<TableCell>{invoice.description || 'N/A'}</TableCell>
									<TableCell>
										<IconButton
											aria-label="delete"
											color="error"
											onClick={(e) => {
												e.stopPropagation();
												handleDelete(invoice.invoiceNumber);
											}}
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

			<Modal open={openModal} onClose={handleModalClose}>
				<Box
					sx={{
						position: 'absolute',
						top: '50%',
						left: '50%',
						transform: 'translate(-50%, -50%)',
						bgcolor: 'background.paper',
						boxShadow: 24,
						p: 4,
						borderRadius: 2,
						display: 'flex',
						flexDirection: 'column',
						gap: 2,
					}}
				>
					{currentInvoice && (
						<>
							<TextField
								fullWidth
								required
								margin="normal"
								label="Payee"
								name="payee"
								error={!currentInvoice.payee}
								value={currentInvoice.payee}
								onChange={handleChange}
							/>
							<TextField
								fullWidth
								required
								margin="normal"
								label="Amount"
								name="amount"
								error={amountError || !currentInvoice.amount}
								helperText={
									amountError ? "The amount can be numeric only!" : ""
								}
								value={currentInvoice.amount}
								onChange={handleAmountChange}
							/>
							<LocalizationProvider dateAdapter={AdapterDayjs}>
    							<DatePicker
    								label="Due Date"
									name="dueDate"
    								value={dayjs.utc(currentInvoice.dueDate)}
    								onChange={handleDateChange}
    							/>
							</LocalizationProvider>
							<TextField
								fullWidth
								margin="normal"
								label="Description"
								name="description"
								value={currentInvoice.description}
								onChange={handleChange}
								multiline
								rows={3}
							/>
							<Button variant="contained"
								onClick={handleSave}
								disabled={!currentInvoice.payee || amountError || !currentInvoice.amount || !currentInvoice.dueDate}>
                Save
							</Button>
						</>
					)}
				</Box>
			</Modal>
		</>
	);
};