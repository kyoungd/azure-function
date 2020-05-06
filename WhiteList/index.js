const {
  queryContainer,
  replaceFamilyItem,
  createFamilyItem
} = require("../common/cosmos");

class DbContext {
  constructor(containerId, mainKey) {
    this.containerId = containerId;
    this.mainKey = mainKey;
    this.partitionKey = mainKey;
  }
  get containerId() {
    return this._containerId;
  }
  set containerId(value) {
    this._containerId = value;
  }
  get partitionKey() {
    return this._partitionKey;
  }
  set partitionKey(value) {
    this._partitionKey = { kind: "Hash", paths: ["/" + value] };
  }
  get mainKey() {
    return this._mainKey;
  }
  set mainKey(value) {
    this._mainKey = value;
  }
}

class WhiteList extends DbContext {
  getQuery(deviceId) {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.deviceId = @deviceId",
      parameters: [
        {
          name: "@deviceId",
          value: deviceId
        }
      ]
    };
    return querySpec;
  }
}

async function isDataBlockExists(ctx, pid) {
  const dataset = await queryContainer(ctx.containerId, ctx.getQuery(pid));
  return Array.isArray(dataset) && dataset.length > 0;
}

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  try {
    const ctx = new WhiteList("whitelist", "deviceId");
    if (req.method === "GET") {
      const key = req.headers.key;
      const dataset = await queryContainer(ctx.containerId, ctx.getQuery(key));
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: dataset
      };
    } else if (req.method === "POST") {
      const dataBlock = req.body;
      const key = dataBlock.deviceId;
      if (!key || dataBlock.id != key) {
        throw new Error(
          "EXCEPTION ERROR: Problem with deviceId and id in the Body.JSON data"
        );
      }
      const isKnownDevice = await isDataBlockExists(ctx, key);
      if (isKnownDevice)
        await replaceFamilyItem(ctx.containerId, dataBlock, ctx.mainKey);
      else await createFamilyItem(ctx.containerId, dataBlock);
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: { result: "OK", status: 200 }
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
