const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");

function hashMessage(message) {
    // convert message to bytes for hash algorithm
    const bytes = utf8ToBytes(message);
    // return hashed message
    return keccak256(bytes);
}
module.exports = hashMessage;