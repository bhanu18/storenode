const { google } = require('googleapis');
const url = require('url');

let youtubeTokn = "";

/**
 * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
 * from the client_secret.json file. To get these credentials for your application, visit
 * https://console.cloud.google.com/apis/credentials.
 */
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URL
);

// Access scopes for read-only Drive activity.
const scopes = [
  'https://www.googleapis.com/auth/youtube'
];

// Generate a url that asks permissions for the Drive activity scope
const authorizationUrl = oauth2Client.generateAuthUrl({
  // 'online' (default) or 'offline' (gets refresh_token)
  access_type: 'offline',
  /** Pass in the scopes array defined above.
    * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
  scope: scopes,
  // Enable incremental authorization. Recommended as a best practice.
  include_granted_scopes: true
});

module.exports = {
  getapi: (req, res) => {
    res.redirect(authorizationUrl);
  },

  redir: async (req, res) => {

    try {

      // Receive the callback from Google's OAuth 2.0 server.
      // Handle the OAuth 2.0 server response
      let q = url.parse(req.url, true).query;

      // Get access and refresh tokens (if access_type is offline)
      let tokens = await oauth2Client.getToken(q.code);

      oauth2Client.setCredentials(tokens);

      const youtube = await google.youtube('v3');

      const response = youtube.channels.list({
        auth: oauth2Client,
        pageSize: 10,
      });

      console.log(response.data);

      res.send('/view');

    } catch (error) {

      console.log("Error:", error);

    }
  },

  view: (req, res) => {

    res.send('from google');

  }
}