const { secp256k1 }= require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils"); 

const privateKey = toHex(secp256k1.utils.randomPrivateKey());
const publicKey = toHex(secp256k1.getPublicKey(privateKey));

console.log("Private Key is: ", privateKey)
console.log("Public Key is: ", publicKey)

// function to convert public key to address
function generateAddress(public_key){
    var address = public_key.slice(-20)
    return address
  }

console.log("Address is: ", generateAddress(publicKey)); 