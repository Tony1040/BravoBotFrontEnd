const intent = require("../intents/intent");

// CheckMethod
exports.checkMethod = (req, res) => {
  switch (req.body.queryResult.intent.displayName) {
    case "findAll":
      console.log("findAll");
      intent.findAllHandler(req.body.queryResult, res);
      break;
    case "saveStatus":
      console.log("saveStatus");
      intent.saveStatusHandler(req.body.queryResult, res);
      break;
    case "updateStatus":
      console.log("updateStatus");
      intent.updateStatusHandler(req.body.queryResult, res);
      break;
    case "deleteStatus":
      console.log("deleteStatus");
      intent.deleteStatusHandler(req.body.queryResult, res);
      break;
    case "login":
      console.log("Login");
      intent.login(req.body.queryResult, res);
      break;
    case "CreateTimesheet":
      console.log("Create timesheet for current week");
      intent.createTimesheetHandler(req.body.queryResult, res);
      break;
    default:
      console.log("No intent found");
      break;
  }
};
