const results: boolean[] = [];
for (let i = 0; i < 100; i++) {
  results.push(digitWiseSum(randNumString(), randNumString()));
}
console.log(`Correct: ${results.filter((r) => r).length}`);

function digitWiseSum(numStrA: string, numStrB: string) {
  // Format num
  const numAIsNeg = numStrA[0] === "-";
  const numBIsNeg = numStrB[0] === "-";
  const shouldSubtract = numAIsNeg !== numBIsNeg;
  const numAWithoutSign = numAIsNeg ? numStrA.slice(1) : numStrA;
  const numBWithoutSign = numBIsNeg ? numStrB.slice(1) : numStrB;
  const maxLen = Math.max(numAWithoutSign.length, numBWithoutSign.length);
  const aIsGreater = isAGreater(numAWithoutSign, numBWithoutSign);
  const leftUnpadded = aIsGreater ? numAWithoutSign : numBWithoutSign;
  const rightUnpadded = aIsGreater ? numBWithoutSign : numAWithoutSign;
  const left = leftUnpadded.padStart(maxLen, "0");
  const right = rightUnpadded.padStart(maxLen, "0");

  let result = ``;
  let carry = 0;
  let lastSumIsNeg = false;
  for (let i = 0; i < maxLen; i++) {
    const digitStrA = left[maxLen - 1 - i];
    const digitStrB = right[maxLen - 1 - i];
    const digitA = parseInt(digitStrA);
    const digitB = parseInt(digitStrB);
    if (shouldSubtract) {
      let sum = digitA - digitB + carry;
      carry = sum < 0 ? -1 : 0;
      sum = sum < 0 ? sum + 10 : sum;
      result = `${sum}${result}`;
    } else {
      const sum = digitA + digitB + carry;
      carry = Math.abs(sum) >= 10 ? (sum < 0 ? -1 : 1) : 0;
      const sumStr = sum.toString();
      result = `${sumStr[sumStr.length - 1]}${result}`;
    }
  }
  if (carry !== 0) {
    result = `${Math.abs(carry)}${result}`;
  }
  if (
    (numAIsNeg && numBIsNeg) ||
    (shouldSubtract &&
      ((aIsGreater && numAIsNeg) || (!aIsGreater && numBIsNeg)))
  ) {
    result = `-${result}`;
  }

  const correctSum = parseInt(numStrA) + parseInt(numStrB);
  const isCorrect = correctSum === parseInt(result);
  if (!isCorrect) {
    console.log(`Incorrect!: (${numStrA}) + (${numStrB}) != ${result}`);
  }
  return isCorrect;
}

function isAGreater(numStrA: string, numStrB: string) {
  if (numStrA.length > numStrB.length) {
    return true;
  }
  if (numStrA.length < numStrB.length) {
    return false;
  }
  for (let i = 0; i < numStrA.length; i++) {
    const digitA = parseInt(numStrA[i]);
    const digitB = parseInt(numStrB[i]);
    if (digitA > digitB) {
      return true;
    }
    if (digitA < digitB) {
      return false;
    }
  }
  return false;
}

function randNumString() {
  // Randomly start negative half the time
  let result = Math.random() < 0.5 ? "-" : "";
  // Genrate a random length between 1 and 10
  const length = Math.floor(Math.random() * 10) + 1;
  for (let i = 0; i < length; i++) {
    // Generate a random number between 0 and 9
    const num = Math.floor(Math.random() * 10);
    result += num.toString();
  }
  return parseInt(result).toString();
}
