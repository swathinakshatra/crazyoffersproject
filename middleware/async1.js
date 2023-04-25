const teleg = require("../startup/telegram");
module.exports = function (handler) {
  return async (req, res, next) => {
    try {
      await handler(req, res);
    } catch (ex) {
      console.log("err---->",ex)
      await teleg.alert_Developers(ex.stack);
     next(ex);
    }
  };
};