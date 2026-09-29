# Module 3: Review and Ratings Feedback

The reviews page for the Self-Pic Photo Studio, using the studio's own design. It works on its own, with no other pages needed.

- Write a review with a name, email, branch, package, 1 to 5 stars and a comment.
- The average rating and star breakdown are calculated from the saved reviews.
- Filter by branch and by rating.
- One review per booking reference (format `SP-123456`). The reference is optional.
- Reviews are saved in the browser as `selfPicReviews`.
- Opening `reviews.html?branch=...&package=...&ref=...` (the link the receipt page uses) opens the form with those fields filled in.

| Requirement | Answer |
|---|---|
| Data structure / algorithm | Array + Set of booking references + counter array; running sum |
| Time | O(1) per submission, O(n) to filter and list |
| Space | O(n) |

## Files

```
reviews.html             the reviews page (index.html redirects to it)
css/style.css, modules.css
images/logo.png
js/review.js             logic (no DOM code)
js/pages/review-page.js  connects the logic to the page
js/links.js              stops links to missing pages from leading to a 404
tests/review.test.js
```

## Run

```bash
npx serve .
# or
python -m http.server 8000
```

Run the tests with `npm test` (Node.js 18 or newer).

## Joining the full site

Put these files in the same folder as `home.html`, `packages.html`, `booking.html` and `receipt.html`. The header links start working automatically.
