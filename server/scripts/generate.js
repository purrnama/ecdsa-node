const secp = require("@noble/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

const privateKey = secp.utils.randomPrivateKey();
console.log("private key:", toHex(privateKey));

const connectHash = keccak256(utf8ToBytes("connect"));

(async () => {
  const [connectSignature, recoveryBit] = await secp.sign(
    connectHash,
    privateKey,
    {
      recovered: true,
      der: false,
    }
  );
  console.log("connect signature: " + toHex(connectSignature) + recoveryBit);
})();

//generate ethereum style public address
const publicKey = keccak256(secp.getPublicKey(privateKey)).slice(-20);
console.log("public key: " + "0x" + toHex(publicKey));
