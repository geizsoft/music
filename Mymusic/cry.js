const crypto = require('crypto');
function aesEncrypt(data,key){
	const cipher = crypto.createCipher("aes192", key);
	var crypted = cipher.update(data,'utf-8','hex');
	crypted += cipher.final('hex');
	return crypted;
}
function aesDecrypt(encrypted,key){
	const decipher = crypto.createDecipher('aes192',key);
	var decrypted = decipher.update(encrypted,'hex','utf-8');
	decrypted += decipher.final('utf-8');
	return decrypted;
}
var data = "1234";
var data1 = "1234";
var key = 'Password!';
var encrypted = aesEncrypt(data,key);
var da = aesEncrypt(data1,key);
var decrypted = aesDecrypt(encrypted,key);
console.info('Plain text:' + data);
console.info('Encrypted text:' + encrypted);
console.info('Encrypted text:' + da);
console.info(encrypted == da);
console.info('Decrypted text:' + decrypted);