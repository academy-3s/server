// const ccav = require('./ccavutil.js');

// exports.handleRequest = function (requestData) {
//     const workingKey = process.env.WORKING_KEY;
//     const accessCode = process.env.ACCESS_CODE;

//     const encRequest = ccav.encrypt(requestData, workingKey);
//     const formbody = `<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="${encRequest}"><input type="hidden" name="access_code" id="access_code" value="${accessCode}"><script language="javascript">document.redirect.submit();</script></form>`;
//     return formbody;
// };
const ccav = require('./ccavutil.js');

exports.handleRequest = function (requestData) {
    const workingKey = process.env.WORKING_KEY;
    const accessCode = process.env.ACCESS_CODE;

    const encRequest = ccav.encrypt(requestData, workingKey);
    const formbody = `<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="${encRequest}"><input type="hidden" name="access_code" id="access_code" value="${accessCode}"><script language="javascript">document.redirect.submit();</script></form>`;
    return formbody;
};
