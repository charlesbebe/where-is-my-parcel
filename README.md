# Where Is My Parcel — v1.0

A first, installable Progressive Web App (PWA) starter for iPhone.

## Included now
- Add and remove parcels
- Save tracking numbers, carrier, nickname and locker/recipient note on this device
- USPS, UPS, FedEx and DHL carrier tracking links
- Dashboard counts and parcel status
- Automatic light/dark appearance (with a manual appearance cycle)
- Notification preference toggles for all five requested events
- Local notification permission and notifications when you manually change a parcel status
- Service worker and offline app-shell caching

## Important current limitation
This first build does **not** fetch carrier scans automatically. It does not yet send remote push notifications when a carrier updates a shipment. Those require a hosted backend and a tracking API account/key. The UI is ready for that next integration. Never put an AfterShip API key in `app.js` or any browser file.

## Put it online from an iPhone
The app must be hosted on HTTPS to install as a PWA and use service workers.

1. Create a GitHub account (if you do not have one) and create a new repository named `where-is-my-parcel`.
2. Upload all files in this folder to the repository's root.
3. In the repository, open **Settings → Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**, select `main` and `/ (root)`, then Save.
5. Wait for GitHub Pages to publish the site. Open the published HTTPS address in Safari.
6. Tap **Share → Add to Home Screen**. Launch it from the new Home Screen icon.
7. In the app, tap **Enable notifications** and allow the iPhone permission prompt.

## How to use
- Enter a tracking number, choose the carrier, and optionally add a nickname or locker note.
- Tap **Track with carrier** to open that carrier's official tracking page.
- Tap **Update status** to record a status manually. If notification permission is granted and that event is enabled, the app displays a local notification.

## Next step: automatic tracking
A server-side integration can use AfterShip Tracking API to register tracking numbers and receive webhook events. API credentials must stay on the server. Web push additionally needs a push subscription endpoint, VAPID keys, a server that stores subscriptions, and webhook-to-push event mapping. iOS web push is available for Home Screen web apps on iOS 16.4+ and requires the user to grant permission from a direct tap.
