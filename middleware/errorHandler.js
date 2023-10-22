const {constants} = require('../constants.js');
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode ? res.statusCode : 500;

    switch (statusCode) {
        case constants.VALIDATION_ERROR:
            res.json({ success:false, title: "Validation Failed", message: err.message, stackTrace: err.stack });
            break;
        case constants.NOT_FOUND:
            res.json({ title: "Not Found", message: err.message, stackTrace: err.stack });
        case constants.UNAUTHORIZED:
            res.json({ success:false, title: "Unauthorized", message: err.message, stackTrace: err.stack });
        case constants.FORBIDDEN:
            res.json({ success:false, title: "Forbidden", message: err.message, stackTrace: err.stack });
        case constants.SERVER_ERROR:
            res.json({ success:false, title: "Server Error", message: err.message, stackTrace: err.stack });
        default:
            res.json({ success:false, title: "Server Error Default", message:err.message, stackTrace: err.stack });
           // console.log("No Error, All good !");
            break;
    }


};

export default errorHandler;