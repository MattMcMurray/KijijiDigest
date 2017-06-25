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
      'locationId': process.env.KIJIJI_LOC_ID,
      'categoryId': process.env.KIJIJI_CAT_ID
    }

    var queryParams = {
      'minPrice': process.env.KIJIJI_MIN_PRICE,
      'maxPrice': process.env.KIJIJI_MAX_PRICE,
      'adType': 'OFFER',
      'keywords': process.env.KIJIJI_SEARCHQ
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

function sendEmail(msgBody) {
	var data = {
		from: process.env.MAILGUN_FROM,
		to: process.env.MAILGUN_TO,
		subject: 'Kijiji Summary',
    text: 'HTML Email not supported',
		html: msgBody
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

function compileEmail(ads) {
  var email = '';
  for (var i = 0; i < ads.length; i++) {
    var ad = ads[i];
    const title = ad.title;
    const link = ad.link;
    const desc = ad.description;
    const date = ad.pubDate;
    const price = ad['g-core:price'];
    var img = null;
    try {
      img = ad.innerAd.image;
    } catch (e) {
      // oh well...
      console.error(e);
    }

    // I hate to do this, but I need to finish this project in 20 mins
    // and don't have time to learn a framework D:
    if (title && link && desc && price) {
      email += '<h1>' + title + '</h1>';
      email += '<h3>' + date + '</h3>';
      email += '<h2>Price:</h2>';
      email += '<p>' + price + '</p>';
      email += '<h2>Description:</h2>';
      email += '<p>' + desc + '</p>';
      email += '<a href=' + link + '><strong>Link</strong></a><br>';
      if (img)
        email += '<br><img src=' + img + '>';
      email += '<hr><br>';
      email += `
        <style>
        body { background-color: #2b2a2a; color: #f4f4f4; font-family: sans-serif; }
        a { color: #f4f4f4; }
        </style>
      `
    }
  }

  return email;
}

scrape()
 .then(ads => {
    return compileEmail(ads);
  })
	.then(body => {
		return sendEmail(body);
	})
  .then(result => {
    console.log('Message queued.');
  })
  .catch(err => {
    console.error(err);
  });
