# KijijiDigest
A quick and dirty node project to scrape Kijiji for keywords and send the results by email in a quick, easy-to-read digest.

Input some search queries, some mailgun credentials, and you're good to go!

Personally, I will be running this as a cron-job on a raspberry pi and having a digest sent to me everyday at 8am.
## Getting Started

### Installation
```bash
git clone https://github.com/MattMcMurray/KijijiDigest.git
npm install # or yarn
cp .env.example .env # then edit keys as appropriate
```
### .env Config
```bash
MAILGUN_API_KEY=************************************ # self explanatory
MAILGUN_DOMAIN= ***************************************.mailgun.org # this is passed to Mailgun JS
MAILGUN_FROM="Kijiji Summary <postmaster@sandboxsandbox*********************************mailgun.org>" # the FROM field; i.e., the domain from which the email is sent
MAILGUN_TO="John H Doe <johndoe@example.com>" # The address to which the email will be sent
KIJIJI_SEARCHQ="these+are+your+search+terms" # Kijiji search queries; each is separatd by a '+'
KIJIJI_MIN_PRICE=0 # a minimum price threshold
KIJIJI_MAX_PRICE=100000000 # maximum price threshold
KIJIJI_LOC_ID=******* # See the readme here for an explanation https://github.com/mwpenny/kijiji-scraper
KIJIJI_CAT_ID=** # same as above
```
### Running
`node app.js`

## Acknowledgement
Many thanks to GitHub user mwpenny for their [Kijiji Scraper](https://github.com/mwpenny/kijiji-scraper) library which made life a lot easier.
