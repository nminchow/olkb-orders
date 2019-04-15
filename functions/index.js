// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const githubContent = require('github-content');
const sgMail = require('@sendgrid/mail');
const Octokit = require('@octokit/rest')
const octokit = new Octokit()

function initClient() {
  if (!process.env.SG_KEY) {
    const error = new Error(
      'SendGrid API key not provided. Make sure you have a "SG_KEY" environment variable set.'
    );
    error.code = 401;
    throw error;
  }

  sgMail.setApiKey(process.env.SG_KEY);
}


// exports.helloPubSub = (event) => {
//   const message = event.data;

//   var options = {
//     owner: 'olkb',
//     repo: 'orders',
//   };

//   var gc = new githubContent(options);

//   gc.file('README.md', function(err, file) {
//     if (err) return console.log(err);
//     console.log(Buffer.from(file.contents, 'base64').toString());
//   });

//   return;
// }

exports.queryOrders = async function queryOrders() {
  const cutoff = new Date(new Date() - 60 * 1000 * 5).toISOString();

  var options = {
    owner: 'olkb',
    repo: 'orders',
    since: cutoff,
  };

  const result = await octokit.repos.listCommits(options);

  if (result.data.length == 0) return;

  var gc = new githubContent(options);

  gc.file('README.md', function(err, file) {
    if (err) return console.log(err);
    const raw = Buffer.from(file.contents, 'base64').toString();
    const sections = raw.split(/\n\s*\n/);
    const orders = sections[sections.length - 1].split(/\n/).reduce(function(a, c) {
      let [num, body] = c.split('. ');
      if(!body) return a;
      let [,normalized] = /([\w\-]*?)[\n\r\s]/.exec(body);
      a[normalized] = num.trim();
      return a;
    }, {});

    initClient();

    // Make the request to SendGrid's API
    console.log('sending email');

    const msg = {
      to: 'noelminchow@gmail.com',
      from: 'olkb-orders@minc.how',
      subject: 'OLKB Order Number Updated',
      text: `The OLKB order status has been updated. \n Current position for order 100007074 is ${orders['100007074']}`,
    };
    sgMail.send(msg);
  });
}
