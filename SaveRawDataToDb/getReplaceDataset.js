const { createFamilyItem, queryContainer } = require("../common/cosmos");

function getQuery(deviceId) {
  const querySpec = {
    query: "SELECT * FROM c WHERE c.deviceId = @deviceId",
    parameters: [
      {
        name: "@deviceId",
        value: deviceId,
      },
    ],
  };
  return querySpec;
}

async function getReplaceDataset(dataset, containerId, deviceId, eventDate) {
  try {
    const datasetNew = { eventDate, ...dataset };
    const item = await queryContainer(containerId, getQuery(deviceId));
    const dbItem = item[0];
    dbItem.data.push(datasetNew);
    return dbItem;
  } catch (e) {
    throw new Error(e.message);
  }
}

module.exports = getReplaceDataset;
