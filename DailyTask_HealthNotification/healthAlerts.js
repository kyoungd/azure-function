const _ = require("lodash");
const { dateStringOnly } = require("../common/util");
const { queryContainer } = require("../common/cosmos");
const params = require("../common/params");
const { HealthAnalysis } = require("./healthAnalysis");

const containerId = params.db.daily_telemetry.containerId;
const analyzeSampleDaySize = parseInt(process.env["AnalyzeSampleDaySize"], 10);

function getTodaysDate(dateString) {
  if (dateString === "undefined" || dateString === null)
    return new Date().getDate();
  // Today!
  else return new Date(dateString);
}

function todayMinus(todayDate, daysBefore) {
  d.setDate(todayDate - daysBefore); // Yesterday!
  return d;
}

const queryString = `SELECT x.*
FROM (
    SELECT p.id, p.contact, p.alert, p.status,
        ARRAY(select c.* 
                from c in p.data 
                where c.eventDate >= @startDate AND c.eventDate <= @endDate) dataset
    FROM p
) x
WHERE x.staus.isActive = true and x.status.eventDate >= @startDate and x.status.eventDate <= @endDate AND ARRAY_LENGTH(x.dataset) > 0
`;

function getQuery(startDate, endDate) {
  const querySpec = {
    query: queryString,
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
  return querySpec;
}

let alertList = [];

function setNotification(dataArray) {
  for (var ix = 0; ix < dataArray.length; ++ix) {
    const { alert, data } = dataArray[ix];
    const ha = new HealthAnalysis(alert, data);
    ha.methodExistCheck(ha.analysisObject);
    ha.methodAlertCheck(ha.analysisObject, ha.datasets);
    notifyError(ha.analysisObject);
    alertList.push(ha.analysisObject);
  }
}

async function healthAlerts() {
  try {
    const datasets = await queryContainer(
      containerId,
      getQuery(todayMinus(0), todayMinus(-2))
    );
    return setNotification(datasets);
  } catch (error) {
    return [];
  }
}

module.exports = healthAlerts;
