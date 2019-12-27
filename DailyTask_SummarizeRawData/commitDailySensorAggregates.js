//@ts-check
const {
  createFamilyItem,
  replaceFamilyItem,
  queryContainer
} = require("../common/cosmos");
const _ = require("lodash");

const containerId = "daily_telemetry";
const partitionKey = { kind: "Hash", paths: ["/deviceId"] };

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

async function queryContainerDailyAggregate(deviceId) {
  // query to return all children in a family
  const querySpec = {
    query: "SELECT * FROM c WHERE c.deviceId = @deviceId",
    parameters: [
      {
        name: "@deviceId",
        value: deviceId
      }
    ]
  };
  const results = await queryContainer(containerId, querySpec);
  return results;
}

function commitDailySensorAggregates(dailyDataset) {
  const promises = [];
  console.log("query daily aggregate container");
  console.log(JSON.stringify(dailyDataset, null, 4));

  _.forEach(dailyDataset, dataset => {
    // query to return all children in a family
    queryContainerDailyAggregate(dataset.deviceId).then(queryResults => {
      const isNewItem = queryResults == undefined || queryResults.length == 0;
      const item = isNewItem
        ? newDailyTelemetry(dataset.deviceId, dataset)
        : updateDailyTelemetry(queryResults[0], dataset);
      promises.push(
        isNewItem
          ? createFamilyItem(containerId, item)
          : replaceFamilyItem(containerId, item, "deviceId")
      );
    });
  });
  Promise.all(promises)
    .then(() => console.log(`Completed successfully`))
    .catch(error =>
      console.log(`Completed with error ${JSON.stringify(error)}`)
    );
}

module.exports = commitDailySensorAggregates;
