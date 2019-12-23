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
  id: "normal_reading"
};

const endpoint = config.endpoint;
const key = config.key;

const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/compositeKey"] };

// const client = new CosmosClient({ endpoint, key })
const connectionString = process.env["sylolive-database_DOCUMENTDB"];
const client = new CosmosClient(connectionString);

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
async function queryContainer(oneDate) {
  console.log(`Querying container:\n${config.container.id}`);

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

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();
  // for (var queryResult of results) {
  //   let resultString = JSON.stringify(queryResult)
  //   console.log(`\tQuery returned ${resultString}\n`)
  // }
  //   var resultString = JSON.stringify(results, null, 4);
  //   console.log(resultString);
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
    const dataset = await queryContainer(todayMinus(0));
    return dailyReadingAggregate(dataset);
  } catch (error) {
    return [];
  }
}

module.exports = getDailySensorAggregates;
