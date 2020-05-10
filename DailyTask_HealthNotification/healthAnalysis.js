//@ts-check
const CosmosClient = require("@azure/cosmos").CosmosClient;
const url = require("url");
const _ = require("lodash");

var config = {};
// config.endpoint = 'https://sylolive-database.documents.azure.com:443/'
// config.key = 'uKgjrosDt4pSAwUp2T88QYGDDflpiTWIhdjYZaUBzEf7xMLkf2vLH7W6FitmlE6LKJ5EWirivVuExV1WFA2pNg=='
config.database = {
  id: "sylolivedb",
};
config.container = {
  id: "normal_reading",
};

const endpoint = config.endpoint;
const key = config.key;

const databaseId = config.database.id;
const containerId = config.container.id;
const partitionKey = { kind: "Hash", paths: ["/compositeKey"] };

// const client = new CosmosClient({ endpoint, key })
const connectionString = process.env["sylolive-database_DOCUMENTDB"];
const client = new CosmosClient(connectionString);
const analyzeSampleDaySize = parseInt(process.env["AnalyzeSampleDaySize"], 10);

/**
 * Create the database if it does not exist
 */
async function createDatabase() {
  const { database } = await client.databases.createIfNotExists({
    id: databaseId,
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

function dateStringOnly(date) {
  let format = "yyyyMMdd";

  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var day = date.getDate();

  var MM = "";
  if (month >= 10) MM = month.toString();
  else MM = "0" + month.toString();
  format = format.replace("MM", MM);
  format = format.replace("yyyy", year.toString());
  var dd = "";
  if (day >= 10) dd = day.toString();
  else dd = "0" + day.toString();
  format = format.replace("dd", dd);
  return format;
}

function todayMinus(daysBefore) {
  var d = new Date(); // Today!
  d.setDate(d.getDate() - daysBefore); // Yesterday!
  return d;
}

const queryString = `SELECT *
FROM (
    SELECT p.id, p.contact, p.alert,
        ARRAY(select c.eventDateOnly, c.count, c.temperature, c.bpm, c.systolic, c.diastolic, c.bloodoxygen, c.bloodsugar 
                from c in p.data 
                where c.eventDateOnly >= @sartDate AND c.eventDateOnly <= @endDate) sumdata
    FROM p
) x
WHERE ARRAY_LENGTH(x.sumdata) > 0
`;

/**
 * Query the container using SQL
 */
async function queryContainer(selectQuery, startDate, endDate) {
  console.log(`Querying container:\n${config.container.id}`);

  // query to return all children in a family
  const querySpec = {
    query: selectQuery,
    parameters: [
      {
        name: "@startDate",
        value: dateStringOnly(startDate),
      },
      {
        name: "@endDate",
        value: dateStringOnly(endDate),
      },
    ],
  };

  const { resources: results } = await client
    .database(databaseId)
    .container(containerId)
    .items.query(querySpec)
    .fetchAll();
  // for (var queryResult of results) {
  //   let resultString = JSON.stringify(queryResult)
  //   console.log(`\tQuery returned ${resultString}\n`)
  // }
  //   var resultString = JSON.stringify(results, null, 4);
  //   console.log(resultString);
  return results;
}

const testDataset = [
  {
    id: "Web-Client-1",
    contact: [
      {
        name: "Young K",
        email: "kyoungd@yahoo.com",
        isEmail: true,
      },
      {
        name: "Gum K",
        email: "kyoungd@aol.com",
        isEmail: true,
      },
    ],
    alert: {
      teperature_max: 105,
      temperature_min: 97,
      temperature_change: 5,
      heartrate_max: 120,
      heaetrate_min: 50,
      heartrate_change: 20,
      systolic_max: 150,
      systolic_min: 80,
      syslolic_change: 50,
      diastolic_max: 100,
      diastolic_min: 50,
      diastolic_change: 40,
      bloodoxygen_max: 100,
      bloodoxygen_min: 94,
      bloodoxygen_change: 5,
      bloodsugar_max: 0,
      bloodsugar_min: 0,
      bloodsugar_change: 0,
    },
    sumdata: [
      {
        eventDateOnly: "20191112",
        count: 19,
        temperature: 491.705169124205,
        systolic: 2164.0690425288008,
        diastolic: 1499.0690425288008,
        bloodoxygen: 1955.0690425288008,
      },
      {
        eventDateOnly: "20191113",
        count: 31,
        temperature: 824.8505617228809,
        systolic: 3551.974292846276,
        diastolic: 2466.974292846277,
        bloodoxygen: 3210.974292846276,
      },
      {
        eventDateOnly: "20191114",
        count: 8,
        temperature: 203.58572588586676,
        systolic: 932.2048100044924,
        diastolic: 652.2048100044924,
        bloodoxygen: 844.2048100044924,
      },
    ],
  },
  {
    id: "Web-Client-2",
    contact: [
      {
        name: "Young K",
        email: "kyoungd@yahoo.com",
        isEmail: true,
      },
      {
        name: "Gum K",
        email: "kyoungd@aol.com",
        isEmail: true,
      },
    ],
    alert: {
      teperature_max: 105,
      temperature_min: 97,
      temperature_change: 5,
      heartrate_max: 120,
      heaetrate_min: 50,
      heartrate_change: 20,
      systolic_max: 150,
      systolic_min: 80,
      syslolic_change: 50,
      diastolic_max: 100,
      diastolic_min: 50,
      diastolic_change: 40,
      bloodoxygen_max: 100,
      bloodoxygen_min: 94,
      bloodoxygen_change: 5,
      bloodsugar_max: 0,
      bloodsugar_min: 0,
      bloodsugar_change: 0,
    },
    sumdata: [
      {
        eventDateOnly: "20191112",
        count: 27,
        temperature: 718.5500604044414,
        systolic: 3062.0874884488917,
        diastolic: 2117.0874884488917,
        bloodoxygen: 2765.0874884488917,
      },
      {
        eventDateOnly: "20191113",
        count: 31,
        temperature: 751.2778483968144,
        systolic: 3586.785614396826,
        diastolic: 2501.785614396826,
        bloodoxygen: 3245.785614396826,
      },
      {
        eventDateOnly: "20191114",
        count: 13,
        temperature: 330.7476058342947,
        systolic: 1512.0679222856872,
        diastolic: 1057.0679222856875,
        bloodoxygen: 1369.0679222856872,
      },
    ],
  },
];

function setNotification(dataset) {
  let notificationList = [];
  dataset.forEach((data) => {
    const sumdata = data.sumdata;
    const alert = data.alert;
    const contact = data.contact;
    // ignore if not 3 days straight.
    if (sumdata.length != analyzeSampleDaySize) return;
    const mySumdata = _.sortBy(sumdata, (o) => o.eventDateOnly);
    const maxResult = setMaxNotification(mySumdata, alert);
    if (maxResult != "OK")
      notificationList.push({
        StatusCode: 500,
        Message: maxResult,
        Contacts: contact,
      });
    const minResult = setMMinNotification(mySumdata, alert);
    if (minResult != "OK")
      notificationList.push({
        StatusCode: 500,
        Message: minResult,
        Contacts: contact,
      });
    const changeResult = setChangeNotification(mySumdata, alert);
    if (changeResult != "OK")
      notificationList.push({
        StatusCode: 500,
        Message: changeResult,
        Contacts: contact,
      });
  });
  return notificationList;
}

function setMaxNotification(sumdata, alert) {
  const keys = Object.keys(alert);
  const mappedKeys = keys.filter((key) => key.includes("_max"));
  sumdata.forEach((onedata) => {
    mappedKeys.forEach((key) => {
      const keyless = key.replace("_max", "");
      if (alert[key] != 0 && alert[key] > onedata[keyless]) return key;
    });
  });
  return "OK";
}

function setMMinNotification(sumdata, alert) {
  const keys = Object.keys(alert);
  const mappedKeys = keys.filter((key) => key.includes("_min"));
  sumdata.forEach((onedata) => {
    mappedKeys.forEach((key) => {
      const keyless = key.replace("_min", "");
      if (alert[key] != 0 && alert[key] < onedata[keyless]) return key;
    });
  });
  return "OK";
}

function setChangeNotification(sumdata, alert) {
  const keys = Object.keys(alert);
  const mappedKeys = keys.filter((key) => key.includes("_change"));
  let returnCodes = {};
  mappedKeys.forEach((key) => {
    const keyless = key.replace("_change", "");
    sumdata.forEach((item, index) => {
      const dataone = item;
      const dataminus =
        sumdata[index - 1] === undefined ? item : sumdata[index - 1];
      const itemChange = dataone[keyless] - dataminus[keyless];
      if (itemChange > alert[key] || itemChange < alert[key])
        returnCodes.push(key);
    });
  });
  const compressedCode = returnCodes.reduce((total, item) => {
    total = total + (total.length > 0 ? ", " : "") + item;
  }, "");
  return compressedCode;
}

async function healthAnalysis() {
  try {
    const dataset = await queryContainer(
      queryString,
      todayMinus(0),
      todayMinus(-2)
    );
    return setNotification(dataset);
  } catch (error) {
    return [];
  }
}

module.exports = healthAnalysis;
