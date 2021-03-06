'use strict';

const luhn = (num) => {
	console.log('>Luhn is verifying card number')
	console.log(`>Checking card number: ${num}`);
	num = num.split('').reverse();
	let i = 1;
	console.log(`>Check-digit: ${num[0]}`);
	while (num[i]) {
		if (i%2) {
			let newNum = (Number(num[i])*2).toString();
			if (newNum.length>1)
				newNum = (Number(newNum[0])+Number(newNum[1])).toString();
			num[i]=newNum;
		}
	i++;
	}
	num = num.reduce((a, b) => Number(a)+Number(b));
	console.log(`>Final sum: ${num}`);
	if (num%10) {
		console.log('>Card number is NOT VALID');
		return false;
	}
	else {
		console.log('>Card number is VALID');
		return true;
	}
};

module.exports = luhn;
