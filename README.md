# olkb-orders 

Simple tooling to help track the status of OLKB.com orders

### Email Notifications

If you would like to recieve an email notification whenever the [list of orders](https://olkb.com/orders/) is updated - [open an issue on this repo](https://github.com/nminchow/olkb-orders/issues/new?assignees=nminchow&labels=email-list-updates&template=email-notification-signup.md&title=Add+Email+Notificaion), or [shoot me a message on reddit](https://www.reddit.com/user/Si1entStill).

## Development
The email logic exists in [functions/index.js](functions/index.js#L20). It is deployed as a [google cloud function](https://cloud.google.com/functions/). It is run by a cron job every 5 minutes and queries for commits in the last 5 minutes. If it finds one, it sends out emails to the list of listeners.

### Setup
You should just need to [deploy this function to google cloud](https://cloud.google.com/functions/docs/deploying/) to get testing. The [cloud function emulator](https://firebase.google.com/docs/functions/local-emulator) should work as well. You will need to provide the `SG_KEY` environment variable to actually send the emails, as well as update the `queryOrders` function with your own sendgrid `templateId`.
___

This project is not affiliated with olkb.com in any way, it is simply provided as a service for convenience.
