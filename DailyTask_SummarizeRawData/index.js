const getDailySensorAggregates = require("./getDailySensorAggregates");
const commitDailySensorAggregates = require("./commitDailySensorAggregates");

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  try {
    const dataset = await getDailySensorAggregates();
    await commitDailySensorAggregates(dataset);
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: ""
    };
  } catch (e) {
    context.res = {
      status: 500 /* Defaults to 200 */,
      body: e.message
    };
  }
};
