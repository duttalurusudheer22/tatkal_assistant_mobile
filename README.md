# IRCTC Tatkal Assistant — Mobile PWA starter

This is a responsive, mobile-friendly web app that can be hosted on HTTPS and added to a phone's home screen.

## Run it
For basic testing, open `index.html` in a browser. For installability as a Progressive Web App (PWA), host the folder on an HTTPS static host (for example, GitHub Pages) so the manifest and service worker can run.

## Add to Android home screen
1. Open the hosted HTTPS URL in Chrome on Android.
2. Open the browser menu.
3. Choose **Install app** or **Add to Home screen** if offered.

## Features
- Opens the official IRCTC train-search page in a separate tab.
- Saves journey preparation details locally in this browser.
- Keeps a checklist locally.
- Provides a visible countdown while the app is open.
- Gives a UPI payment checklist.

## Important limitations
- A standalone web app cannot inspect another tab's IRCTC page or inject into it.
- The countdown is not a reliable background push notification. The page needs to remain open for its visible countdown.
- It does not store IRCTC passwords, passenger identity documents, OTPs, UPI PINs, or payment credentials.
- It cannot bypass server queues, CAPTCHA, rate limits, or required booking checks.
- Confirm Tatkal opening times and rules with official IRCTC/Railways sources.
