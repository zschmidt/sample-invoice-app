This is essentially just a run-of-the-mill CRUD app for Invoices.


To setup, you only need to run `npm install`, then to run the server you'll do `npm start`.


[Swagger docs are available here after starting the server](http://localhost:5000/api-docs) -- since the invoices are stored in memory, it is a lot easier to test/setup the API this way versus running a bunch of curl commands or some static script every time.


A few "quirks" of the model/API are:

* While the Invoice model has 7 members, only 4 can be updated -- `invoiceNumber`, `status`, and `issueDate` are all handled by the server to hopefully fend off any strange issues with primary keys, marking unpaid invoices as `Paid`, or changing the creation date

* There's no unit testing. That might be added in the future if I carve out the time, but it's a known hole

* I spent the time centralizing the Invoice/Payment models, then had to duplicate them in the swagger docs. This obviously opens it up to issues with drift. Would be a neat `todo` to figure out how to get swagger to reference my models, but that's probably not going to happen