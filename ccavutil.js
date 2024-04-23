// // // var crypto = require('crypto');
// // // exports.encrypt = function (plainText, workingKey) {
// // // 	var m = crypto.createHash('md5');
// // //     	m.update(workingKey);
// // //    	var key = m.digest();
// // //       	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';	
// // // 	var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
// // // 	var encoded = cipher.update(plainText,'utf8','hex');
// // // 	encoded += cipher.final('hex');
// // //     	return encoded;
// // // };


// // // exports.decrypt = function (encText, workingKey) {
// // //     	var m = crypto.createHash('md5');
// // //     	m.update(workingKey)
// // //     	var key = m.digest();
// // // 	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';	
// // // 	var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
// // //     	var decoded = decipher.update(encText,'hex','utf8');
// // // 	decoded += decipher.final('utf8');
// // //     	return decoded;
// // // };




// // var crypto = require('crypto');
// // function getAlgorithm(keyBase64) {
// //     var key = Buffer.from(keyBase64, 'base64');
// //     switch (key.length) {
// //         case 16:
// //             return 'aes-128-cbc';
// //         case 32:
// //             return 'aes-256-cbc';

// //     }
// //     throw new Error('Invalid key length: ' + key.length);
// // }

// // exports.encrypt = function(plainText, keyBase64, ivBase64) {

// //     const key = Buffer.from(keyBase64, 'base64');
// //     const iv = Buffer.from(ivBase64, 'base64');

// //     const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
// //     let encrypted = cipher.update(plainText, 'utf8', 'hex')
// //     encrypted += cipher.final('hex');
// //     return encrypted;
// // }

// // exports.decrypt = function(messagebase64, keyBase64, ivBase64) {

// //     const key = Buffer.from(keyBase64, 'base64');
// //     const iv = Buffer.from(ivBase64, 'base64');

// //     const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
// //     let decrypted = decipher.update(messagebase64, 'hex');
// //     decrypted += decipher.final();
// //     return decrypted;
// // }





// var crypto = require('crypto');
// exports.encrypt = function (plainText, workingKey) {
// 	var m = crypto.createHash('md5');
//     	m.update(workingKey);
//    	var key = m.digest('binary');
//       	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';	
// 	var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
// 	var encoded = cipher.update(plainText,'utf8','hex');
// 	encoded += cipher.final('hex');
//     	return encoded;
// };


// exports.decrypt = function (encText, workingKey) {
//     	var m = crypto.createHash('md5');
//     	m.update(workingKey)
//     	var key = m.digest('binary');
// 	var iv = '\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f';	
// 	var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv);
//     	var decoded = decipher.update(encText,'hex','utf8');
// 	decoded += decipher.final('utf8');
//     	return decoded;
// };




var crypto = require('crypto');
function getAlgorithm(keyBase64) {
    var key = Buffer.from(keyBase64, 'base64');
    switch (key.length) {
        case 16:
            return 'aes-128-cbc';
        case 32:
            return 'aes-256-cbc';

    }
    throw new Error('Invalid key length: ' + key.length);
}

exports.encrypt = function(plainText, keyBase64, ivBase64) {

    const key = Buffer.from(keyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    const cipher = crypto.createCipheriv(getAlgorithm(keyBase64), key, iv);
    let encrypted = cipher.update(plainText, 'utf8', 'hex')
    encrypted += cipher.final('hex');
    return encrypted;
}

exports.decrypt = function(messagebase64, keyBase64, ivBase64) {

    const key = Buffer.from(keyBase64, 'base64');
    const iv = Buffer.from(ivBase64, 'base64');

    const decipher = crypto.createDecipheriv(getAlgorithm(keyBase64), key, iv);
    let decrypted = decipher.update(messagebase64, 'hex');
    decrypted += decipher.final();
    return decrypted;
}
