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
import { Payment, Invoice } from 'shared';
import PaymentService from './PaymentService.js';

dayjs.extend(utc);

export default function PaymentTable({ payments, setPayments }) {
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

	const sortedPayments = [...payments].sort((a, b) => {
		if (orderBy === 'amount' || orderBy === 'invoiceNumber') {
			return order === 'asc' ?
				a[orderBy] > b[orderBy] ?
					1 :
					-1 :
				a[orderBy] < b[orderBy] ?
					1 :
					-1;
		}
		if (orderBy === 'paymentDate') {
			return order === 'asc' ?
				new Date(a[orderBy]) - new Date(b[orderBy]) :
				new Date(b[orderBy]) - new Date(a[orderBy]);
		}
		return order === 'asc' ? a[orderBy].localeCompare(b[orderBy]) : b[orderBy].localeCompare(a[orderBy]);
	});

	const paginatedPayments = sortedPayments.slice(
		page * rowsPerPage,
		page * rowsPerPage + rowsPerPage
	);

	useEffect(() => {
		const fetchPayments = () => {
			PaymentService.getAllPayments()
				.then((data) => {
					setPayments(data);
				})
				.catch((error) => {
					setError(error.message || 'Something went wrong');
				})
				.finally(() => {
					setLoading(false);
				});
		};

		fetchPayments();
	}, [setPayments]);

	if (loading) {
		return <CircularProgress />;
	}

	if (error) {
		return <Typography color="error">{error}</Typography>;
	}

	return (
		<Paper sx={{ width: '100%', overflow: 'hidden' }}>
			<TableContainer sx={{ maxHeight: '30vh' }}>
				<Typography variant="h6" sx={{ p: 2 }}>
          Payment List
				</Typography>
				<Table stickyHeader size="medium">
					<TableHead>
						<TableRow>
							{[
								{ id: 'invoiceNumber', label: 'Invoice Number' },
								{ id: 'amount', label: 'Amount ($)' },
								{ id: 'paymentDate', label: 'Payment Date' },
								{ id: 'paymentMethod', label: 'Payment Method' }
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
						</TableRow>
					</TableHead>
					<TableBody>
						{paginatedPayments.map((payment) => (
							<TableRow hover 
								key={payment.invoiceNumber}>
								<TableCell>{payment.invoiceNumber}</TableCell>
								<TableCell>{Number.parseFloat(payment.amount).toFixed(2)}</TableCell>
								<TableCell>{dayjs.utc(payment.paymentDate).format('M/D/YYYY')}</TableCell>
								<TableCell>{payment.paymentMethod}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={payments.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
};