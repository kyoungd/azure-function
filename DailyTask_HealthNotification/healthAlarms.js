const emailMessagesByCode = require('./emailMessageByCode.json');

const sendNotification = (contacts, smsMessage, emailmessage) => {
  this.smsMessage = smsMessage;
  this.emailmessage = emailmessage;
  if (this.smsMessage) {
    contacts.map(contact => {
      if (contact.isNotify) {
        console.log(contact.phone);
        console.log(contact.email);
        console.log(this.smsMessage);
        console.log(this.emailmessage)
      }
    }, this);
  }
}

function healthAlarms (contacts, analysisObject) {
  let smsMessage = "";
  let emailMessage = "";
  const mainKeys = Object.keys(analysisObject);
  for (let idx = 0; idx < mainKeys.length; ++idx) {
    const key = mainKeys[idx];
    const alertObject = analysisObject[key];
    for (let ix = 0; ix < alertObject.length; ++ix) {
      let obj = alertObject[ix];
      const firstKey = Object.keys(obj)[0];
      const analysis = obj[firstKey];
      if (analysis.errorCount > analysis.errorAllowed) {
        smsMessage += smsMessage === "" ? analysis.key : ", " + analysis.key;
        emailMessage += (emailMessage === "" ? "" : ", ") + emailMessagesByCode[key][0][firstKey];
      }
    }
  }
  sendNotification(contacts, smsMessage, emailMessage);
}

module.exports = healthAlarms;
