const { createFamilyItem } = require("../common/cosmos");
const _ = require("lodash");
const params = require("../common/params");

const containerId = params.db.normal_reading.containerId;

function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;

  // Assume if it has a length property with a non-zero value
  // that that property is correct.
  if (obj.length && obj.length > 0) return false;
  if (obj.length === 0) return true;

  // Otherwise, does it have any properties of its own?
  // Note that this doesn't handle
  // toString and toValue enumeration bugs in IE < 9
  for (var key in obj) {
    if (hasOwnProperty.call(obj, key)) return false;
  }

  return true;
}

function getHeartRate(dataset) {
  const heartbeats = dataset.filter(
    (item) => item.nameValuePairs.Code === "TYPE_HEART_RATE"
  );
  return isEmpty(heartbeats) ? 0 : heartbeats.length;
}

const constructSummaryDataSet = (data, columns) => {
  let totalSet = {};
  _.each(columns, (column, index) => {
    const itemValue =
      _.reduce(
        data,
        (total, item, index, data) => total + item.nameValuePairs[column],
        0
      ) / data.length;
    totalSet[column] = itemValue;
  });
  return totalSet;
};

function getProcessedData(dataset, codeType, emptySet) {
  const bps = dataset.filter((item) => item.nameValuePairs.Code === codeType);
  return isEmpty(bps)
    ? emptySet
    : constructSummaryDataSet(bps, _.keys(emptySet));
}

function getBloodPressure(dataset) {
  const codeType = "TYPE_BLOOD_PRESSURE";
  const emptySet = {
    systolic: 0,
    diastolic: 0,
    Accuracy: 0,
  };
  return getProcessedData(dataset, codeType, emptySet);
}

function getBloodOxygen(dataset) {
  const codeType = "TYPE_BLOOD_OXYGEN";
  const emptySet = {
    bloodoxygen: 0,
    Accuracy: 0,
  };
  return getProcessedData(dataset, codeType, emptySet);
}

function getAcceleration(dataset) {
  const codeType = "TYPE_ACCELEROMETER";
  const emptySet = {
    x: 0,
    y: 0,
    z: 0,
    Accuracy: 0,
  };
  return getProcessedData(dataset, codeType, emptySet);
}

function getOrientation(dataset) {
  const codeType = "TYPE_ORIENTATION";
  const emptySet = {
    azimuth: 0,
    pitch: 0,
    roll: 0,
    Accuracy: 0,
  };
  return getProcessedData(dataset, codeType, emptySet);
}

function getTemperature(dataset) {
    const codeType = "TYPE_TEMPERATURE";
    const emptySet = {
      temperature: 0,
      Accuracy: 0,
    };
    return getProcessedData(dataset, codeType, emptySet);
}

function getCough(dataset) {
    const codeType = "TYPE_COUGH";
    const emptySet = {
      dryCough: 0,
      wetCough: 0,
      maxCough: 0,
      maxTimes: 0,
      Accuracy: 0,
    };
    return getProcessedData(dataset, codeType, emptySet);
}

module.exports = async function (context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  if (req.method === "POST") {
    try {
      const dataBlock = req.body;

      if (isEmpty(dataBlock) || isEmpty(dataBlock.data.values))
        throw new Error("no data");
      let dataset = {
        ...dataBlock,
        compositeKey: dataBlock.eventDay + "-" + dataBlock.deviceId,
      };
      await createFamilyItem(containerId, dataset);
      context.res = {
        status: 200 /* Defaults to 200 */,
        body: "OK",
      };
    } catch (e) {
      context.res = {
        status: 500 /* Defaults to 200 */,
        body: e.message,
      };
    }
  } else
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: "http post only",
    };
};
