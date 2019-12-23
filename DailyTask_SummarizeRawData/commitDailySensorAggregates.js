//@ts-check
const CosmosClient = require("@azure/cosmos").CosmosClient;
const url = require("url");
const _ = require("lodash");

var config = {};
// config.endpoint = 'https://sylolive-database.documents.azure.com:443/'
// config.key = 'uKgjrosDt4pSAwUp2T88QYGDDflpiTWIhdjYZaUBzEf7xMLkf2vLH7W6FitmlE6LKJ5EWirivVuExV1WFA2pNg=='
config.database = {
  id: "sylolivedb"
};
config.container = {
  id: "daily_telemetry"
};

const endpoint = config.endpoint;
const key = config.key;

const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/compositeKey"] };

const connectionString = process.env["sylolive-database_DOCUMENTDB"];
const client = new CosmosClient(connectionString);

// const client = new CosmosClient({ endpoint, key })

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

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId
  });
  console.log(`Created database:\n${database.id}\n`);
}

/**
 * Read the database definition
 */
async function readDatabase() {
  const { resource: databaseDefinition } = await client
    .database(databaseId)
    .read();
  console.log(`Reading database:\n${databaseDefinition.id}\n`);
}

/**
 * Create the container if it does not exist
 */
async function createContainer() {
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );
  console.log(`Created container:\n${config.container.id}\n`);
}

/**
 * Read the container definition
 */
async function readContainer() {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read();
  console.log(`Reading container:\n${containerDefinition.id}\n`);
}

/**
 * Create family item if it does not exist
 */
async function createFamilyItem(itemBody) {
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody);
  console.log(`Created family item with id:\n${itemBody.id}\n`);
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

function todayMinus(daysBefore) {
  var d = new Date(); // Today!
  d.setDate(d.getDate() - daysBefore); // Yesterday!
  return d;
}

/**
 * Query the container using SQL
 */
async function queryDailyAggregateContainer(deviceId) {
  console.log(`Querying container:\n${config.container.id}`);

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

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();
  // for (var queryResult of results) {
  //   let resultString = JSON.stringify(queryResult)
  //   console.log(`\tQuery returned ${resultString}\n`)
  // }
  return results;
}

/**
 * Replace the item by ID.
 */
async function replaceFamilyItem(itemBody) {
  console.log(`Replacing item:\n${itemBody.id}\n`);
  // Change property 'grade'
  itemBody.children[0].grade = 6;
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody.Country)
    .replace(itemBody);
}

/**
 * Delete the item by ID.
 */
async function deleteFamilyItem(itemBody) {
  await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody.Country)
    .delete(itemBody);
  console.log(`Deleted item:\n${itemBody.id}\n`);
}

/**
 * Cleanup the database and collection on completion
 */
async function cleanup() {
  await client.database(databaseId).delete();
}

/**
 * Exit the app with a prompt
 * @param {string} message - The message to display
 */
function exit(message) {
  console.log(message);
  console.log("Press any key to exit");
  process.stdin.setRawMode(true);
  process.stdin.resume();
  process.stdin.on("data", process.exit.bind(process, 0));
}

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
        queryDailyAggregateContainer(dataset.deviceId).then(queryResults => {
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
