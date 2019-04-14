// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });


const githubContent = require('github-content');


exports.helloPubSub = (event) => {
  const message = event.data;

  var options = {
    owner: 'olkb',
    repo: 'orders',
  };

  var gc = new githubContent(options);

  gc.file('README.md', function(err, file) {
    if (err) return console.log(err);
    console.log(Buffer.from(file.contents, 'base64').toString());
  });

  return;
}
