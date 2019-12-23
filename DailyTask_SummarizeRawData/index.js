const getDailySensorAggregates = require('./getDailySensorAggregates');
const commitDailySensorAggregates = require('./commitDailySensorAggregates');

module.exports = async function(context, req) {
  context.log("JavaScript HTTP trigger function processed a request.");
  
  getDailySensorAggregates()
  .then(dataset => {
    commitDailySensorAggregates(dataset);
    context.res = {
      status: 200,  /* Defaults to 200 */
      body: ""
    }
  })
  .error(e) {
    context.res = {
      status: 400,  /* Defaults to 200 */
      body: e.message
    }
  }

};
