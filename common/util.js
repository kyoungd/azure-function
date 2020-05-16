function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length && obj.length > 0) return false;
  if (obj.length === 0) return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and toValue enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

function dateStringOnly(date) {
  let format = "yyyyMMdd";

  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var day = date.getDate();

  var MM = "";
  if (month >= 10) MM = month.toString();
  else MM = "0" + month.toString();
  format = format.replace("MM", MM);
  format = format.replace("yyyy", year.toString());
  var dd = "";
  if (day >= 10) dd = day.toString();
  else dd = "0" + day.toString();
  format = format.replace("dd", dd);
  return format;
}

module.exports = {
  isEmpty,
  dateStringOnly,
};
