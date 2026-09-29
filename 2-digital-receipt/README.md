# Module 2: Digital Receipt and Barcode

The official reservation receipt for the Self-Pic Photo Studio, using the studio's own design. It works on its own, with no other pages needed.

- **Receipt generator form** on the page: choose a package, branch, date, time, and extras, then generate the receipt. The form checks names, email, Philippine mobile number, booking window (Sep 1, 2026 to Sep 1, 2027), opening hours, and that the session ends before 7:00 PM.
- **Pricing:** package price plus extra time (P100 per 10 mins), extra persons (P50), extra backdrops (P100 each) and spotlight (P200). Payment is 50% downpayment or full payment.
- **Barcode:** a real, scannable Code 39 barcode of the reference number (for example `SP-894210`).
- Print or save as PDF with the browser's print option.
- The receipt is saved in the browser as `selfPicLatestBooking`. If your booking page saves a reservation under the same key, the receipt shows that one instead.

| Requirement | Answer |
|---|---|
| Data structure / algorithm | Hash Maps (package catalog, Code 39 table) + Array of line items; Code 39 encoding |
| Time | O(k + L) |
| Space | O(k + L) |

k = line items, L = length of the reference code.

## Files

```
receipt.html                the receipt page (index.html redirects to it)
css/style.css, modules.css  the studio's styles + small additions
images/logo.png
js/receipt.js               logic: catalog, booking validation and pricing, Code 39 (no DOM code)
js/pages/receipt-page.js    connects the logic to the page
js/links.js                 stops links to missing pages from leading to a 404
tests/receipt.test.js
```

## Run

```bash
npx serve .
# or
python -m http.server 8000
```

Run the tests with `npm test` (Node.js 18 or newer).

## Joining the full site

Put these files in the same folder as `booking.html`, `reviews.html` and `home.html`. The header links and the **Write a Review** button start working automatically, and the **Write a Review** button passes the branch, package and reference to the review module.
