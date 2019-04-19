const githubContent = require('github-content');
const sgMail = require('@sendgrid/mail');
const Octokit = require('@octokit/rest');
const octokit = new Octokit();
const Firestore = require('@google-cloud/firestore');
const firestore = new Firestore();

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
    console.log('sending emails');

    firestore.collection('orders').get().then(snapshot => {
      snapshot.forEach(x => {
        const { email, orderNumber } = x.data();
        console.log(`${email} --- ${orderNumber}`)
        if (orders[orderNumber] == null) return;
        const msg = {
          to: email,
          from: 'olkb-orders@minc.how',
          templateId: 'd-24c58665e0a143ef85398db046445835',
          dynamic_template_data: {
            orderNumber,
            orderPosition: orders[orderNumber]
          },
        };
        sgMail.send(msg);
      });
    });
  });
}
