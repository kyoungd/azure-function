//@ts-check
const {
  readDatabase,
  readContainer,
  queryContainerDailyData
} = require("./db");
const url = require("url");
const _ = require("lodash");

function todayMinus(daysBefore) {
  var d = new Date(); // Today!
  d.setDate(d.getDate() - daysBefore); // Yesterday!
  return d;
}

function dailyReadingAggregate(readings) {
  const scores = _.groupBy(readings, reading => reading.deviceId);

  const scoreGroup = _.map(scores, (user, index) => {
    return {
      deviceId: user[0].deviceId,
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

async function getDailySensorAggregates() {
  try {
    await readDatabase();
    await readContainer();
    const dataset = await queryContainerDailyData(todayMinus(0));
    return dailyReadingAggregate(dataset);
  } catch (error) {
    return [];
  }
}

module.exports = getDailySensorAggregates;
