module.exports = {
  mongoURI: process.env.MONGO_URI,
  googleAuth: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  },

  secret: process.env.SECRET_OR_KEY,

  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID,
  twilioApiKey: process.env.TWILIO_API_KEY,
  twilioApiSecret: process.env.TWILIO_API_SECRET,
  twilioChatServiceSid: process.env.TWILIO_CHAT_SERVICE_SID
};
