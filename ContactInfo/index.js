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

class DailyTelemtry extends DbContext {
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

class CareTaker extends DbContext {
  getQuery(careTakerId) {
    const querySpec = {
      query: "SELECT * FROM c WHERE c.careTakerId = @careTakerId",
      parameters: [
        {
          name: "@careTakerId",
          value: careTakerId
        }
      ]
    };
    return querySpec;
  }
}

async function isDataBlockExists(ctx, pid) {
  const dataset = await queryContainer(ctx.containerId, ctx.getQuery(pid));
  return Array.isArray(dataset) && dataset.legnth;
}

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  try {
    const key = req.body.key;
    const ctx =
      key.container === "telemetry"
        ? new DailyTelemtry("daily_telemetry", "deviceId")
        : new CareTaker("care_taker", "careTakerId");
    if (req.method === "GET") {
      const dataset = await queryContainer(
        ctx.containerId,
        ctx.getQuery(key.pid)
      );
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: dataset
      };
    } else if (req.method === "POST") {
      const dataBlock = req.body.value;
      const isKnownDevice = isDataBlockExists(ctx, key.pid);
      if (isKnownDevice)
        await replaceFamilyItem(ctx.containerId, dataBlock, ctx.mainKey);
      else await createFamilyItem(ctx.containerId, dataBlock);
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: dataBlock
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
