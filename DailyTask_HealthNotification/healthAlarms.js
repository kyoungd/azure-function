const _ = require("lodash");

function healthAlarms(contact, analysisObject) {
  let message = "";
  const mainKeys = Object.keys(analysisObject);
  for (let idx = 0; idx < mainKeys.length; ++idx) {
    const key = mainKeys[idx];
    const alertObject = analysisObject[key];
    for (let ix = 0; ix < alertObject.length; ++ix) {
      let obj = alertObject[ix];
      if (obj.errorCount > obj.errorAllowed) {
        smsMessage += key + "." + obj.key;
        emailMessage += emailMessageByCode[key][obj.key];
      }
    }
  }
}
