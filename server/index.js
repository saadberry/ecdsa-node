const express = require("express");
const hashMessage = require("./scripts/hashMessage")
const { secp256k1 } = require("ethereum-cryptography/secp256k1.js");
const app = express();
const cors = require("cors");
const port = 3042;


app.use(cors());
app.use(express.json());


// function to convert public key to address
function generateAddress(public_key){
  var address = public_key.slice(-20)
  console.log(address)
  return address
}

// getting addresses
// address = generateAddress("0x4E3908F7109f57E4A31c2986a8aab5C3D0b5B592")


const balances = {
  "65cf7bbeefbe0346567c": 100,
  "c58f6695f3479e1f8678": 50,
  "cdede22e8408d147b7dd": 75,
};


app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  // console.log("address is: ",address)
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  //  TODO: get a signature from the client-side application
  // recover the public address from the signature

  // send the signature in the request, find the pubilc address


  const { sender, recipient, amount, hash_msg, signature, publicKey } = req.body;
  // console.log("The signature is: ", hashMessage(message))
  // console.log(sender, recipient, amount, message, signature)
  // const pkey = JSON.parse(publicKey)
  const parsedSignature = JSON.parse(signature, (key, value) => {
    if (typeof value === 'string' && /^\d+$/.test(value)) {
      return BigInt(value);
    }
    return value;
  });
  console.log(sender, recipient, amount, hash_msg, parsedSignature)
  console.log("public key is: ", publicKey)
  // hash_msg = hashMessage(message)
  // console.log(hash_msg)
  // const sig = secp256k1.sign(hash_msg, "4662a360f443b04ec387a08bf27dd8280661ff76bb61330c4c7b77ee39948822")
  isVerified = secp256k1.verify(parsedSignature, hash_msg, publicKey)
  console.log(isVerified)
  if(isVerified){   
    setInitialBalance(sender);
    setInitialBalance(recipient);

    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amount;
      balances[recipient] += amount;
      res.send({ balance: balances[sender] });
    }
  }else{
    res.status(403).send("Invalid Signature!")
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
