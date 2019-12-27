//@ts-check
const CosmosClient = require("@azure/cosmos").CosmosClient;

var config = {};
config.database = {
  id: "sylolivedb"
};

const databaseId = config.database.id;
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
async function createContainer(containerId, partitionKey) {
  const { container } = await client
    .database(databaseId)
    .containers.createIfNotExists(
      { id: containerId, partitionKey },
      { offerThroughput: 400 }
    );
  console.log(`Created container:\n${containerId}\n`);
}

/**
 * Read the container definition
 */
async function readContainer(containerId) {
  const { resource: containerDefinition } = await client
    .database(databaseId)
    .container(containerId)
    .read();
  console.log(`Reading container:\n${containerDefinition.id}\n`);
}

/**
 * Create family item if it does not exist
 */
async function createFamilyItem(containerId, itemBody) {
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .items.upsert(itemBody);
  console.log(`Created family item with id:\n${itemBody.id}\n`);
}

/**
 * Replace the item by ID.
 */
async function replaceFamilyItem(containerId, itemBody, mainKey) {
  console.log(`Replacing item:\n${itemBody.id}\n`);
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody[mainKey])
    .replace(itemBody);
  return item;
}

/**
 * Delete the item by ID.
 */
async function deleteFamilyItem(containerId, itemBody, mainKey) {
  await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody[mainKey])
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
async function queryContainer(containerId, querySpec) {
  console.log(`Querying container:\n${containerId}`);

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

module.exports = {
  createDatabase,
  readDatabase,
  createContainer,
  readContainer,
  createFamilyItem,
  replaceFamilyItem,
  deleteFamilyItem,
  cleanup,
  exit,
  queryContainer
};
