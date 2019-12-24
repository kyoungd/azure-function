const CosmosClient = require("@azure/cosmos").CosmosClient;

var config = {};
config.database = {
  id: "sylolivedb"
};
config.container = {
  id: "daily_telemetry"
};

const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/deviceId"] };

// const client = new CosmosClient({ endpoint, key });

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
  // for (var queryResult of results) {
  //   let resultString = JSON.stringify(queryResult);
  //   console.log(`\tQuery returned ${resultString}\n`);
  // }
}

/**
 * Replace the item by ID.
 */
async function replaceFamilyItem(itemBody) {
  console.log(`Replacing item:\n${itemBody.id}\n`);
  const { item } = await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody.deviceId)
    .replace(itemBody);
  return item;
}

/**
 * Delete the item by ID.
 */
async function deleteFamilyItem(itemBody) {
  await client
    .database(databaseId)
    .container(containerId)
    .item(itemBody.id, itemBody.deviceId)
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
  // process.stdin.setRawMode(true)
  // process.stdin.resume()
  // process.stdin.on('data', process.exit.bind(process, 0))
}

module.exports = {
  readDatabase,
  readContainer,
  queryContainer,
  replaceFamilyItem,
  createFamilyItem
};
