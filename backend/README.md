This is essentially just a run-of-the-mill CRUD app for Invoices.


To setup, you only need to run `npm install`, then to run the server you'll do `npm start`.


[Swagger docs are available here after starting the server](http://localhost:5000/api-docs) -- since the invoices are stored in memory, it is a lot easier to test/setup the API this way versus running a bunch of curl commands or some static script every time.


A few "quirks" of the model/API are:

* While the Invoice model has 7 members, only 4 can be updated -- `invoiceNumber`, `status`, and `issueDate` are all handled by the server to hopefully fend off any strange issues with primary keys, marking unpaid invoices as `Paid`, or changing the creation date

* It's not possible to reach the `Rejected` state. In my mind, this could be a state that's reached when the payment is rejected by the bank/etc. 

* You can only make a payment in full. This is done to simplify development in this prototype context. Future expansion could include partial payments, with an update to the server logic to only update an invoice to `Paid` if the full payment amount has been reached. Futhermore, the API doesn't even allow you to send an amount, it's a read only field.

* You're not allowed to make a payment in the future. Payments get stamped with a `paymentDate` of when the payment hits the POST route in the server

* You can't delete or otherwise modify a payment. Perhaps that could trigger the `Rejected` state, but in the real world it would involve charge backs or undoing wire transfers, which seems sticky

* As a (loose) corollary to the above, you're not allowed to modify an Invoice if it is in a state other than `Pending`. This includes deletion and is to prevent the case where you create and pay for an invoice, then decide to change the amount on the invoice (which would cause mayhem with the `Paid` status), or you leave a dangling payment.

* There's no unit testing. That might be added in the future if I carve out the time, but it's a known hole

* I spent the time centralizing the Invoice/Payment models, then had to duplicate them in the swagger docs. This obviously opens it up to issues with drift. Would be a neat `todo` to figure out how to get swagger to reference my models