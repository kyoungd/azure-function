/* ------------------------------------------------------------
  Classs: Health Analysis

  This class takes the alert and patient data and run simple
  alert routine on it.  It is designed to be generic and flexible
  enough to handle additional alert routines inclduing future ML
  routines.  Sample data follows.
  temperature: [
    {
      temperature_range: {
        key: "temperature",       -- name of the parameter in the dataset
        limit1: 96,               -- lower limit (or first alert parameter)
        limit2: 105,              -- higher limit (or second alert parameter)
        method: "checkRange",     -- name of the method that checks the alert
        duration: 4,              -- How many times the error must occur before notification
        errorCount: 0,            -- calculated.  how many alert were detected?
        isMethodExist: false,     -- calculated.  Does this metho exists?  If not, ignore.
      },
    },
  ],
  alert - alert setting that is unique to each patient
  dataset - patient data for last 3 days (default)

  alert check - this[method](dataset_value, limit1, limit2);

  I am using for-loop instead of .foreach or .map.
  There is scoping issue with anonymous method and class or module variables
  It was the only way to get around that problem.

  How to call this class.
  const ha = new HealthAnalysis(alert, datasets);
  ha.methodExistCheck(ha.analysisObject);
  ha.methodAlertCheck(ha.analysisObject, ha.datasets);
  ---
  ha.analysisObject will have the final result (errorCount);
------------------------------------------------------------ */
class HealthAnalysis {
  constructor(alert, datasets) {
    this.analysisObject = JSON.parse(JSON.stringify(alert));
    this.datasets = datasets;
  }

  /* -----------------------------------------------------------------------
  This is one of the method to check alerts.  Addtional methods can be added later.
  ----------------------------------------------------------------------- */
  checkRange(value, limit1, limit2) {
    return value < limit1 || value > limit2 ? 1 : 0;
  }

  /* -----------------------------------------------------------------------
  Calculating the isMethodExists variable in the alert
  ----------------------------------------------------------------------- */
  methodExistCheck(analysisObject) {
    const mainKeys = Object.keys(analysisObject);
    for (let idx = 0; idx < mainKeys.length; ++idx) {
      const key = mainKeys[idx];
      const alertObject = analysisObject[key];
      for (let ix = 0; ix < alertObject.length; ++ix) {
        let obj = alertObject[ix];
        const firstKey = Object.keys(obj)[0];
        const analysis = obj[firstKey];
        const fn = analysis.method;
        // function exists
        analysis.isMethodExist = fn in this && typeof this[fn] === "function";
      }
    }
  }

  /* -----------------------------------------------------------------------
  Calculating the errorCount for a single dataset.
  ----------------------------------------------------------------------- */
  methodAlertCheckItem(mainKeys, analysisObject, dataset) {
    for (let idx = 0; idx < mainKeys.length; ++idx) {
      const key = mainKeys[idx];
      if (dataset[key] !== "undefined" && dataset[key]) {
        const alertObject = analysisObject[key];
        for (let ix = 0; ix < alertObject.length; ++ix) {
          let obj = alertObject[ix];
          const firstKey = Object.keys(obj)[0];
          const analysis = obj[firstKey];
          const value = dataset[key][obj[firstKey].key];
          analysis.errorCount += !analysis.isMethodExist
            ? 0
            : this[analysis.method](value, analysis.limit1, analysis.limit2);
        }
      }
    }
  }

  /* -----------------------------------------------------------------------
  Calculating the errorCount for the entire dataset.
  ----------------------------------------------------------------------- */
  methodAlertCheck(analysisObject, datasets) {
    const mainKeys = Object.keys(analysisObject);
    for (var idx = 0; idx < datasets.length; ++idx) {
      this.methodAlertCheckItem(mainKeys, analysisObject, datasets[idx]);
    }
  }
}

/* -----------------------------------------------------------------------
const ha = new HealthAnalysis(alert, datasets);
ha.methodExistCheck(ha.analysisObject);
ha.methodAlertCheck(ha.analysisObject, ha.datasets);
console.log(JSON.stringify(ha.analysisObject, null, 4));
----------------------------------------------------------------------- */

module.exports = HealthAnalysis;
