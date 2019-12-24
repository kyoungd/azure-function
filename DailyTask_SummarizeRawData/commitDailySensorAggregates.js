//@ts-check
const {
  readDatabase,
  readContainer,
  createFamilyItem,
  queryContainerDailyAggregate
} = require("./db");
const url = require("url");
const _ = require("lodash");

const dailyAggregates = [
  {
    deviceId: "Web-Clinet-5a",
    eventDateOnly: "20191102",
    temperature: 98.1,
    bpm: 82,
    systolic: 121,
    diastolic: 81,
    bloodoxygen: 98,
    bloodsugar: 92
  },
  {
    deviceId: "Web-Clinet-6a",
    eventDateOnly: "20191102",
    temperature: 98.1,
    bpm: 82,
    systolic: 121,
    diastolic: 81,
    bloodoxygen: 98,
    bloodsugar: 92
  },
  {
    deviceId: "Web-Clinet-7a",
    eventDateOnly: "20191102",
    temperature: 98.1,
    bpm: 82,
    systolic: 121,
    diastolic: 81,
    bloodoxygen: 98,
    bloodsugar: 92
  }
];

function newDailyTelemetry(deviceId, telemetry) {
  const item = {
    deviceId: deviceId,
    id: deviceId,
    version: 1,
    data: [telemetry]
  };
  return item;
}

function updateDailyTelemetry(item, telemetry) {
  var dataSet = _.reject(
    item.data,
    dt => dt.eventDateOnly == telemetry.eventDateOnly
  );
  dataSet.push(telemetry);
  item.data = _.sortBy(dataSet, ["eventDateOnly"], ["dsc"]);
  return item;
}

function commitDailySensorAggregates(dailyDataset) {
  const promises = [];
  readDatabase()
    .then(() => readContainer())
    .then(() => {
      console.log("query daily aggregate container");
      console.log(JSON.stringify(dailyDataset, null, 4));

      _.forEach(dailyDataset, dataset => {
        // query to return all children in a family
        queryContainerDailyAggregate(dataset.deviceId).then(queryResults => {
          const item =
            queryResults == undefined || queryResults.length == 0
              ? newDailyTelemetry(dataset.deviceId, dataset)
              : updateDailyTelemetry(queryResults[0], dataset);
          promises.push(createFamilyItem(item));
        });
      });
      Promise.all(promises)
        .then(() => console.log(`Completed successfully`))
        .catch(error =>
          console.log(`Completed with error ${JSON.stringify(error)}`)
        );
    })
    .catch(error =>
      console.log(`Completed with error ${JSON.stringify(error)}`)
    );
}

module.exports = commitDailySensorAggregates;
