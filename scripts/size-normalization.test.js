"use strict";

const assert = require("assert/strict");

const DEFAULT_SIZE_NOTE = "M";

function normalizeSizeForOptions(supportedSizes, requestedSize) {
  const size = String(requestedSize || DEFAULT_SIZE_NOTE).toUpperCase();

  if (!supportedSizes.length) {
    return size;
  }

  if (supportedSizes.includes(size)) {
    return size;
  }

  if (size === "S") {
    return supportedSizes[0];
  }

  if (size === "L") {
    return supportedSizes[supportedSizes.length - 1];
  }

  if (supportedSizes.includes(DEFAULT_SIZE_NOTE)) {
    return DEFAULT_SIZE_NOTE;
  }

  return supportedSizes[Math.min(1, supportedSizes.length - 1)];
}

const cases = [
  { name: "Phin Sua Da", sizes: ["S", "M"], requested: "S", expected: "S" },
  { name: "Phin Sua Da", sizes: ["S", "M"], requested: "M", expected: "M" },
  { name: "Phin Sua Da", sizes: ["S", "M"], requested: "L", expected: "M" },
  { name: "Cacao Sua Da", sizes: ["S", "M"], requested: "L", expected: "M" },
  { name: "Cafe Muoi", sizes: ["S", "M"], requested: "L", expected: "M" },
  { name: "Cold Brew Truyen Thong", sizes: ["S", "M"], requested: "L", expected: "M" },
  { name: "Oolong Chanh Mat Ong", sizes: ["M", "L"], requested: "S", expected: "M" },
  { name: "Oolong Chanh Mat Ong", sizes: ["M", "L"], requested: "M", expected: "M" },
  { name: "Oolong Chanh Mat Ong", sizes: ["M", "L"], requested: "L", expected: "L" },
  { name: "Tra Sua Tram's", sizes: ["L"], requested: "S", expected: "L" },
  { name: "Tra Sua Tram's", sizes: ["L"], requested: "M", expected: "L" },
  { name: "Tra Sua Tram's", sizes: ["L"], requested: "L", expected: "L" },
  { name: "Hong Tra Dao", sizes: ["M"], requested: "S", expected: "M" },
  { name: "Hong Tra Dao", sizes: ["M"], requested: "L", expected: "M" },
  { name: "Tra Lai Dac Thom", sizes: ["M"], requested: "S", expected: "M" },
  { name: "Tra Oolong Cold Brew Vi Mo Dao", sizes: ["L"], requested: "S", expected: "L" }
];

cases.forEach((testCase) => {
  assert.equal(
    normalizeSizeForOptions(testCase.sizes, testCase.requested),
    testCase.expected,
    `${testCase.name}: requested ${testCase.requested} with sizes ${testCase.sizes.join(",")} should become ${testCase.expected}`
  );
});

console.log(`size-normalization: ${cases.length} cases passed`);
