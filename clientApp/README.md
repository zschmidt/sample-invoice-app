# React Invoice App


The frontend requires the server to be running in order to function properly -- you can consult the `backend` readme for info.

There are a multitude of ways to run the frontend, the simplest is probably to just run `npm run dev`.

After running, useage should be straightforward. 

Since the API was written in a way to disallow any actions that end in "bad" states, the frontend didn't need to be especially hardened against bad user input. Nevertheless, I think I've covered most use cases and prevented the user from clicking on anything that would allow garbage to be sent to the API. Most actions that are disallowed are simply manifestations of rules that I've written in to the backend.


### Known shortcomings/deficiencies


There are a few omissions that were cut simply due to a lack of time.

* The table for invoices and payments is exceedingly similar. It would be smarter to write them in a way that would allow the developer to simply tell the component what "shape" the data is and have it display that

* Similarly, the modals throughout the app (to create an invoice or payment, or to update an invoice) could also be written in a generic way in order to be reused

* There's obviously a bit of hand waving with regards to the business rules. The person using this application is the same one making invoices and payments -- maybe they are dealing with the payee over the phone or sitting across the desk, though. More importantly, there's no credit card number/bank account number/etc captured. That would prove interesting for the entity who actually needs to charge the account.