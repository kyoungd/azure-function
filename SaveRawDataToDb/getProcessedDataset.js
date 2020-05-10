const _ = require("lodash");
const params = require("../common/params");
const { isEmpty } = require("../common/util");

const rawContainerId = params.db.normal_reading.containerId;

function getHeartRate(dataset) {
  try {
    const heartbeats = dataset.data.values.filter(
      (item) => item.nameValuePairs.Code === "TYPE_HEART_RATE"
    );
    return isEmpty(heartbeats) ? 0 : heartbeats.length;
  } catch (e) {
    return 0;
  }
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
  try {
    const bps = dataset.data.values.filter(
      (item) => item.nameValuePairs.Code === codeType
    );
    return isEmpty(bps)
      ? emptySet
      : constructSummaryDataSet(bps, _.keys(emptySet));
  } catch (e) {
    return emptySet;
  }
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

function getProcessedDataset(dataset) {
  try {
    const heartRate = getHeartRate(dataset);
    const bloodPressure = getBloodPressure(dataset);
    const bloodOxygen = getBloodOxygen(dataset);
    const acceleration = getAcceleration(dataset);
    const orientation = getOrientation(dataset);
    const temperature = getTemperature(dataset);
    const cough = getCough(dataset);
    return {
      heartRate,
      bloodPressure,
      bloodOxygen,
      acceleration,
      orientation,
      temperature,
      cough,
    };
  } catch (e) {
    return {};
  }
}

module.exports = getProcessedDataset;
