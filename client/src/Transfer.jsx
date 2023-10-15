import { useState } from "react";
import server from "./server";
import { ethers } from "ethers";
import { hashMessage } from "ethers/lib/utils";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";

// // Connect to MetaMask provider
// const provider = new ethers.providers.Web3Provider(window.ethereum);

function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(""); // Add error state
  const [sig, setSig] = useState(""); 

  const setValue = (setter) => (evt) => setter(evt.target.value);

  const privateKeyDictionary = {
    "65cf7bbeefbe0346567c": "4662a360f443b04ec387a08bf27dd8280661ff76bb61330c4c7b77ee39948822",
    "c58f6695f3479e1f8678": "9e0e447993d00e8474834a7f9cc365f397ced97e41f50e96fda3d36c919c04dd",
    "cdede22e8408d147b7dd": "3d9c08099cdfd8148531d62cb0bb87ad983d188acb98a0909fcda661e6ddc6bd"
  };

  // // Function to sign a message
  // async function signMessage(message) {
  //   try {
  //     // Request access to MetaMask accounts
  //     const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     const signer = provider.getSigner(accounts[0]);

  //     // Sign the message
  //     const signature = await signer.signMessage(message);

  //     // Return the signature
  //     console.log("2222",signature)
  //     setSig(signature)
  //     console.log("333", sig)
  //     return signature;
  //   } catch (error) {
  //     console.error(error);
  //     // Handle errors (e.g., user denied access)
  //   }
  // }

  async function transfer(evt) {
    evt.preventDefault();
    console.log("window.ethereum:", window.ethereum);
    const entry = new FormData(evt.target);

    // console.log(message)
    var hash_msg = hashMessage(message)
    hash_msg = hash_msg.slice(2)
    console.log("message hash is: ", hash_msg)
    const pvt_key = privateKeyDictionary[address]
    console.log("private key is: ", pvt_key)
    if(pvt_key){  
      const publicKey = secp256k1.getPublicKey(pvt_key)
      const signature = secp256k1.sign(hash_msg, pvt_key)
      const signatureString = JSON.stringify({
        r: signature.r.toString(),
        s: signature.s.toString(),
        recovery: signature.recovery.toString()
      });
      console.log("sig2 is: ", signatureString)
      setSig(signatureString)
      console.log("sig is: ", sig)
      
      console.log("public key is: ", JSON.stringify(publicKey));
      
      // Converting to hex string
      const publicKeyHex = Object.values(publicKey)
      .map(byte => byte.toString(16).padStart(2, '0')) // Convert each byte to a hexadecimal string
      .join(''); // Join the hexadecimal strings

      console.log('Public Key in Hex:', publicKeyHex); 
      console.log(address, sendAmount, recipient, hash_msg, sig, publicKey)
      try {
        const {
          data: { balance },
        } = await server.post(`send`, {
          sender: address,
          amount: parseInt(sendAmount),
          recipient,
          hash_msg,
          signature: sig,
          publicKey: publicKeyHex
        });
        setBalance(balance);
      } catch (ex) {
        alert(ex.response.data.message);
      }
    }else{
      alert("Address doesn't exist!")
    }}

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Message
        <input
          placeholder="Write a Message"
          value={message}
          onChange={setValue(setMessage)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      {error && <div className="error">{error}</div>}

      <input type="submit" className="button" value="Sign and Transfer" />
    </form>
  );
}

export default Transfer;
