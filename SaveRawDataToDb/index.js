const { createFamilyItem, replaceFamilyItem } = require("../common/cosmos");
const { isEmpty } = require("../common/util");
const getProcessedDataset = require("./getProcessedDataset");
const getReplaceDataset = require("./getReplaceDataset");
const params = require("../common/params");

const rawContainerId = params.db.normal_reading.containerId;
const historyContainerId = params.db.daily_telemetry.containerId;

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  if (req.method === "POST") {
    try {
      const dataBlock = req.body;
      const compositeKey = dataBlock.eventDay + "-" + dataBlock.deviceId;

      if (isEmpty(dataBlock) || isEmpty(dataBlock.data.values))
        throw new Error("no data");
      let dataset = {
        ...dataBlock,
        compositeKey,
      };
      const processedDataset = getProcessedDataset(dataset);
      const insertItems = { ...dataset, ...processedDataset };
      await createFamilyItem(rawContainerId, insertItems);
      const replaceDataset = await getReplaceDataset(
        processedDataset,
        historyContainerId,
        dataset.deviceId,
        dataset.eventDate
      );
      await replaceFamilyItem(
        historyContainerId,
        replaceDataset,
        replaceDataset.deviceId
      );
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: "OK",
      };
    } catch (e) {
      context.res = {
        status: 500 /* Defaults to 500 */,
        body: e.message,
      };
    }
  } else
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: "http post only",
    };
};
