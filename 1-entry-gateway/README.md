# Module 1: Entry Landing and Gateway

The first screen of the Self-Pic Photo Studio site, using the studio's own design. It works on its own, with no other pages needed.

- **Book Now**, **Enter Main Website** and the **Staff and Administrator Portal** link are routed through a Hash Map routing table (`js/gateway.js`).
- Shows whether the studio is open (10 AM to 7 PM, Philippine time).
- If the destination page exists (for example `booking.html` next to `index.html`), the visitor goes there. If it does not, the page shows a short notice saying where the visitor was routed instead of a 404.

| Requirement | Answer |
|---|---|
| Data structure / algorithm | Hash Map (`Map`) routing table + opening-hours check |
| Time | O(1) |
| Space | O(r) for r routes |

## Files

```
index.html               the landing page
css/landing.css          the studio's landing styles
images/landing/          background and logo
js/gateway.js            logic (no DOM code)
js/pages/gateway-page.js connects the logic to the page
js/links.js              checks whether a destination page exists
tests/gateway.test.js
```

## Run

The page uses ES modules, so serve the folder over HTTP:

```bash
npx serve .
# or
python -m http.server 8000
```

Run the tests with `npm test` (Node.js 18 or newer).

## Joining the full site

Edit the `routes` table in `js/gateway.js` if your page names differ. Put this folder's files in the same folder as `booking.html`, `home.html` and `admin/` and the links start working automatically.
