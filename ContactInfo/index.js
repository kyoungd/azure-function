const {
  readDatabase,
  readContainer,
  queryContainer,
  replaceFamilyItem,
  createFamilyItem
} = require("./db");

function getQuery(deviceId) {
  const querySpec = {
    query:
      "SELECT c.deviceId, c.id, c.version, c.contact, c.alert FROM c WHERE c.deviceId = @deviceId",
    parameters: [
      {
        name: "@deviceId",
        value: deviceId
      }
    ]
  };
  return querySpec;
}

async function deviceExists(device) {
  const deviceId = req.query.deviceId;
  const dataset = await queryContainer(getQuery(deviceId));
  return Array.isArray(dataset) && dataset.legnth;
}

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  try {
    await readDatabase();
    await readContainer();
    if (req.method === "GET") {
      const deviceId = req.query.deviceId;
      const dataset = await queryContainer(getQuery(deviceId));
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: dataset
      };
    } else if (req.method === "POST") {
      const device = req.body;
      const isKnownDevice = deviceExists(device);
      if (isKnownDevice) await replaceFamilyItem(device);
      else await createFamilyItem(device);
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: device
      };
    }
  } catch (e) {
    context.res = {
      status: 500 /* INTERNAL ERROR */,
      body: e.message
    };
  }
  // if (req.query.name || (req.body && req.body.name)) {
  //     context.res = {
  //         // status: 200, /* Defaults to 200 */
  //         body: "Hello " + (req.query.name || req.body.name)
  //     };
  // }
  // else {
  //     context.res = {
  //         status: 400,
  //         body: "Please pass a name on the query string or in the request body"
  //     };
  // }
};
