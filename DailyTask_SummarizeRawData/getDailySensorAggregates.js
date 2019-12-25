//@ts-check
const { queryContainer } = require("./cosmos");
const url = require("url");
const _ = require("lodash");

const containerId = "normal_reading";
const partitionKey = { kind: "Hash", paths: ["/compositeKey"] };

function todayMinus(daysBefore) {
  var d = new Date(); // Today!
  d.setDate(d.getDate() - daysBefore); // Yesterday!
  return d;
}

function dailyReadingAggregate(readings, eventDate) {
  const scores = _.groupBy(readings, reading => reading.deviceId);
  const eventDateOnly = dateStringOnly(eventDate);
  const scoreGroup = _.map(scores, (user, index) => {
    return {
      deviceId: user[0].deviceId,
      eventDateOnly,
      count: user.length,
      temperature: _.reduce(
        user,
        (tp, item, index, user) => tp + item.temperature,
        0
      ),
      humidity: _.reduce(
        user,
        (hm, item, index, user) => hm + item.humidity,
        0
      ),
      heartrate: _.reduce(
        user,
        (hr, item, index, user) => hr + item.heartrate,
        0
      ),
      systolic: _.reduce(
        user,
        (sy, item, index, user) => sy + item.systolic,
        0
      ),
      diastolic: _.reduce(
        user,
        (di, item, index, user) => di + item.diastolic,
        0
      ),
      bloodoxygen: _.reduce(
        user,
        (bo, item, index, user) => bo + item.bloodoxygen,
        0
      )
    };
  });
  return scoreGroup;
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

async function queryContainerDailyData(oneDate) {
  // query to return all children in a family
  const querySpec = {
    query: "SELECT * FROM r WHERE STARTSWITH(r.compositeKey, @dateString)",
    parameters: [
      {
        name: "@dateString",
        value: dateStringOnly(oneDate)
      }
    ]
  };

  const results = await queryContainer(containerId, querySpec);
  return results;
}

async function getDailySensorAggregates() {
  const oneDate = todayMinus(0);
  const dataset = await queryContainerDailyData(oneDate);
  return dailyReadingAggregate(dataset, oneDate);
}

module.exports = getDailySensorAggregates;
