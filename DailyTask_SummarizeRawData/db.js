//@ts-check
const CosmosClient = require("@azure/cosmos").CosmosClient;

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

/**
 * Query the container using SQL
 */
async function queryContainer(querySpec) {
  console.log(`Querying container:\n${config.container.id}`);

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();
  // DEBUG
  // for (var queryResult of results) {
  //   let resultString = JSON.stringify(queryResult)
  //   console.log(`\tQuery returned ${resultString}\n`)
  // }
  return results;
}

/**
 * ------------------------------------------------------------------------------------------------------
 * QUERY DEPENDS ON THE TASK
 * ------------------------------------------------------------------------------------------------------
 */

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

  const results = await queryContainer(querySpec);
  return results;
}

/**
 * Query the container using SQL
 */
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

  const results = await queryContainer(querySpec);
  return results;
}

module.exports = {
  createDatabase,
  readDatabase,
  createContainer,
  readContainer,
  createFamilyItem,
  deleteFamilyItem,
  cleanup,
  exit,
  queryContainerDailyAggregate,
  queryContainerDailyData
};
