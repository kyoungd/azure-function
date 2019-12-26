const healthAnalysis = require("./healthAnalysis");

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");

  try {
    const dataset = await healthAnalysis();
    context.res = {
      status: 200 /* Defaults to 200 */,
      body: JSON.stringify(dataset)
    };
  } catch (e) {
    context.res = {
      status: 400,
      body: JSON.stringify(e, null, 4)
    };
  }
};
