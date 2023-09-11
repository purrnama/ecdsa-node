const secp = require("ethereum-cryptography/secp256k1");
const keccak = require("ethereum-cryptography/keccak");
const { toHex } = require("ethereum-cryptography/utils");

const privateKey = secp.secp256k1.utils.randomPrivateKey();
console.log("private key:", toHex(privateKey));

//generate ethereum style public address
const publicKey = keccak
  .keccak256(secp.secp256k1.getPublicKey(privateKey))
  .slice(1)
  .slice(-20);
console.log("public key: " + "0x" + toHex(publicKey));
