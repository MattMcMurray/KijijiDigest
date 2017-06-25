const kijiji = require('kijiji-scraper');
const dotenv = require('dotenv');
const path = require('path');

dotenv.load({ path: path.join(__dirname, '.env') });
const mailgun = require('mailgun-js')({
																				apiKey: process.env.MAILGUN_API_KEY,
																				domain: process.env.MAILGUN_DOMAIN
																			});

function scrape() {
  return new Promise((resolve, reject) => {
    var queryPrefs = {
      'locationId': '1700192',
      'categoryId': '27',
    }

    var queryParams = {
      'minPrice': 10000,
      'maxPrice': 25000,
      'adType': 'OFFER',
      'keywords': 'toyota + tacoma'
    }

    kijiji.query(queryPrefs, queryParams, (err, ads) => {
      if (err) {
        reject(err);
      } else {
        resolve(ads);
      }
    });
  });
}

function sendEmail() {
	var data = {
		from: 'Mailgun Sandbox <postmaster@sandbox30d583f326384d4e82c46ed75a79ad68.mailgun.org>',
		to: 'Mathieu J McMurray <mathieumcmurray@gmail.com>',
		subject: 'Kijiji Summary',
		text: 'Testing some Mailgun awesomness!'
	};
	return new Promise((resolve, reject) => {
		mailgun.messages().send(data, function (error, body) {
			if (error) {
				reject(error);
			} else {
				resolve(body);
			}
		});
	});
}

scrape()
 .then(ads => {
		return sendEmail()
  })
	.then(body => {
		console.log('Email queud!');
	})
  .catch(err => {
    console.error(err);
  });
