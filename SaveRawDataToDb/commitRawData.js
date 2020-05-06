//@ts-check
const {
    createFamilyItem,
    replaceFamilyItem,
    queryContainer
  } = require("../common/cosmos");
  const _ = require("lodash");
  
  const containerId = "normal_reading";
  const partitionKey = { kind: "Hash", paths: ["/compositeKey"] };
  
  async function commitRawData(data) {
    const promises = [];
    console.log("commitRawData()... ");
    console.log(JSON.stringify(data, null, 4));

    let dataset = {...data, "compositeKey": data.eventDay + "-" + data.deviceId};
    await createFamilyItem(containerId, dataset);
  }
  
  module.exports = commitRawData;
  