// // // // // var http = require('http'),
// // // // //     fs = require('fs'),
// // // // //     ccav = require('./ccavutil.js'),
// // // // //     qs = require('querystring');

// // // // // exports.postRes = function(request,response){
// // // // //     var ccavEncResponse='',
// // // // // 	ccavResponse='',
// // // // // 	workingKey = 'C07F0C53B127E007D4F09B6D66F0D9CF',	//Put in the 32-Bit key shared by CCAvenues.
// // // // // 	ccavPOST = '';

// // // // //         request.on('data', function (data) {
// // // // // 	    ccavEncResponse += data;
// // // // // 	    ccavPOST =  qs.parse(ccavEncResponse);
// // // // // 	    var encryption = ccavPOST.encResp;
// // // // // 	    ccavResponse = ccav.decrypt(encryption,workingKey);
// // // // //         });

// // // // // 	request.on('end', function () {
// // // // // 	    var pData = '';
// // // // // 	    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
// // // // // 	    pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
// // // // // 	    pData = pData.replace(/&/gi,'</td></tr><tr><td>')
// // // // // 	    pData = pData + '</td></tr></table>'
// // // // //             htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
// // // // //             response.writeHeader(200, {"Content-Type": "text/html"});
// // // // // 	    response.write(htmlcode);
// // // // // 	    response.end();
// // // // // 	});
// // // // // };

// // // // var http = require('http'),
// // // //     fs = require('fs'),
// // // //     ccav = require('./ccavutil.js'),
// // // //     qs = require('querystring');

// // // // exports.postRes = function(request,response){
// // // //     var ccavEncResponse='',
// // // // 	ccavResponse='',
// // // // 	workingKey = 'C07F0C53B127E007D4F09B6D66F0D9CF',	//Put in the 32-Bit key shared by CCAvenues.
// // // // 	ccavPOST = '';

// // // //         request.on('data', function (data) {
// // // // 	    ccavEncResponse += data;
// // // // 	    ccavPOST =  qs.parse(ccavEncResponse);
// // // // 	    var encryption = ccavPOST.encResp;
// // // // 	    ccavResponse = ccav.decrypt(encryption,workingKey);
// // // //         });

// // // // 	request.on('end', function () {
// // // // 	    var pData = '';
// // // // 	    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
// // // // 	    pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
// // // // 	    pData = pData.replace(/&/gi,'</td></tr><tr><td>')
// // // // 	    pData = pData + '</td></tr></table>'
// // // //             htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
// // // //             response.writeHeader(200, {"Content-Type": "text/html"});
// // // // 	    response.write(htmlcode);
// // // // 	    response.end();
// // // // 	});
// // // // };

// // // var http = require('http'),
// // //     fs = require('fs'),
// // //     ccav = require('./ccavutil.js'),
// // //     qs = require('querystring');

// // // exports.postRes = function(request,response){
// // //     var ccavEncResponse='',
// // // 	ccavResponse='',
// // // 	workingKey = 'F7BC685927E4ECE95F4CBBDC0F6EC285',	//Put in the 32-Bit key shared by CCAvenues.
// // // 	ccavPOST = '';

// // //         request.on('data', function (data) {
// // // 	    ccavEncResponse += data;
// // // 	    ccavPOST =  qs.parse(ccavEncResponse);
// // // 	    var encryption = ccavPOST.encResp;
// // // 	    ccavResponse = ccav.decrypt(encryption,workingKey);
// // //         });

// // // 	request.on('end', function () {
// // // 	    var pData = '';
// // // 	    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
// // // 	    pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
// // // 	    pData = pData.replace(/&/gi,'</td></tr><tr><td>')
// // // 	    pData = pData + '</td></tr></table>'
// // //             htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
// // //             response.writeHeader(200, {"Content-Type": "text/html"});
// // // 	    response.write(htmlcode);
// // // 	    response.end();
// // // 	});
// // // };

// // var http = require('http'),
// //     fs = require('fs'),
// //     ccav = require('./ccavutil.js'),
// //     crypto = require('crypto'),
// //     qs = require('querystring');

// // exports.postRes = function(request,response){
// //     var ccavEncResponse='',
// // 	ccavResponse='',
// // 	workingKey = '9CF1028414D14A6FE24E110B0D38B4C4',	//Put in the 32-Bit key shared by CCAvenues.
// // 	ccavPOST = '';

// //     //Generate Md5 hash for the key and then convert in base64 string
// //     var md5 = crypto.createHash('md5').update(workingKey).digest();
// //     var keyBase64 = Buffer.from(md5).toString('base64');

// //     //Initializing Vector and then convert in base64 string
// //     var ivBase64 = Buffer.from([0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d,0x0e, 0x0f]).toString('base64');

// //         request.on('data', function (data) {
// // 	    ccavEncResponse += data;
// // 	    ccavPOST =  qs.parse(ccavEncResponse);
// // 	    var encryption = ccavPOST.encResp;
// // 	    ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
// //         });

// // 	request.on('end', function () {
// // 	    var pData = '';
// // 	    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
// // 	    pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
// // 	    pData = pData.replace(/&/gi,'</td></tr><tr><td>')
// // 	    pData = pData + '</td></tr></table>'
// //             htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
// //             response.writeHeader(200, {"Content-Type": "text/html"});
// // 	    response.write(htmlcode);
// // 	    response.end();
// // 	});
// // };

// var http = require('http'),
//     fs = require('fs'),
//     ccav = require('./ccavutil.js'),
//     qs = require('querystring');

// exports.postRes = function(request,response){
//     var ccavEncResponse='',
// 	ccavResponse='',
// 	workingKey = 'D9638AE3CA84CDF66EBEE6AC6A603866',	//Put in the 32-Bit key shared by CCAvenues.
// 	ccavPOST = '';

//         request.on('data', function (data) {
// 	    ccavEncResponse += data;
// 	    ccavPOST =  qs.parse(ccavEncResponse);
// 	    var encryption = ccavPOST.encResp;
// 	    ccavResponse = ccav.decrypt(encryption,workingKey);
//         });

// 	request.on('end', function () {
// 	    var pData = '';
// 	    pData = '<table border=1 cellspacing=2 cellpadding=2><tr><td>'
// 	    pData = pData + ccavResponse.replace(/=/gi,'</td><td>')
// 	    pData = pData.replace(/&/gi,'</td></tr><tr><td>')
// 	    pData = pData + '</td></tr></table>'
//             htmlcode = '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>'+ pData +'</center><br></body></html>';
//             response.writeHeader(200, {"Content-Type": "text/html"});
// 	    response.write(htmlcode);
// 	    response.end();
// 	});
// };

// var http = require("http"),
//     fs = require("fs"),
//     ccav = require("./ccavutil.js"),
//     qs = require("querystring");
// (crypto = require("crypto")),
//     (exports.postRes = function (request, response, callback) {
//         var ccavEncResponse = "",
//             ccavResponse = "",
//             workingKey = "AA0CA6A8A257DA417DA327FF79EE2245", //Put in the 32-Bit key shared by CCAvenues.
//             ccavPOST = "";
//         //Generate Md5 hash for the key and then convert in base64 string
//         var md5 = crypto.createHash("md5").update(workingKey).digest();
//         var keyBase64 = Buffer.from(md5).toString("base64");

//         //Initializing Vector and then convert in base64 string
//         var ivBase64 = Buffer.from([
//             0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b,
//             0x0c, 0x0d, 0x0e, 0x0f,
//         ]).toString("base64");

//         request.on("data", function (data) {
//             ccavEncResponse += data;
//             ccavPOST = qs.parse(ccavEncResponse);
//             // console.log("encryption")
//             // console.log("encryption", ccavPOST.encResp)
//             var encryption = ccavPOST.encResp;
//             ccavResponse = ccav.decrypt(encryption, keyBase64, ivBase64);
//         });

//         request.on("end", function () {
//             // var pData = "";
//             // pData = "<table border=1 cellspacing=2 cellpadding=2><tr><td>";
//             // pData = pData + ccavResponse.replace(/=/gi, "</td><td>");
//             // pData = pData.replace(/&/gi, "</td></tr><tr><td>");
//             // pData = pData + "</td></tr></table>";
//             // htmlcode =
//             //   '<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>Response Handler</title></head><body><center><font size="4" color="blue"><b>Response Page</b></font><br>' +
//             //   pData +
//             //   "</center><br></body></html>";
//             // response.writeHeader(200, { "Content-Type": "text/html" });
//             // // console.log("htmlcode in end", htmlcode);
//             // response.write(htmlcode);
//             // response.end();
//             callback(null, ccavResponse);
//         });
//     });

const qs = require('querystring');
const nodeCCAvenue = require('node-ccavenue');

exports.postReq = function (request, response) {
    let body = '',
        accessCode = process.env.ACCESSCODE,
        encRequest = '',
        formbody = '',
        objectForEncryption = {}

    const ccav = new nodeCCAvenue.Configure({
        merchant_id: process.env.MERCHANTID,
        working_key: process.env.WORKINGKEY,
    });

    request.on('data', function (data) {
        body += data;
        objectForEncryption = qs.parse(body)
        encRequest = ccav.getEncryptedOrder(objectForEncryption);
        formbody = '<form id="nonseamless" method="post" name="redirect" action="https://secure.ccavenue.com/transaction/transaction.do?command=initiateTransaction"/> <input type="hidden" id="encRequest" name="encRequest" value="' + encRequest + '"><input type="hidden" name="access_code" id="access_code" value="' + accessCode + '"><script language="javascript">document.redirect.submit();</script></form>';
    });

    request.on('end', function () {
        response.writeHeader(200, { "Content-Type": "text/html" });
        response.write(formbody);
        response.end();
    });
    return;
};
