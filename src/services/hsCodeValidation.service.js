const { validateHSCodeAI } = require('../ai/infer/hsCodeAI');

async function verifyHSCode(hsCode) {
  try {
    return await validateHSCodeAI(hsCode);
  } catch (error) {
    console.error('HS Code AI Error:', error.message);
    return false; // default to false on failure
  }
}

module.exports = { verifyHSCode };
