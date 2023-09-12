const secp = require("@noble/secp256k1");
const { toHex, hexToBytes } = require("ethereum-cryptography/utils");

const messageHash = process.argv[2];
const privateKey = process.argv[3];
(async () => {
  if (!messageHash || !privateKey) {
    console.log(
      "Invalid command: Enter your transaction hash and your private key as arguments."
    );
    return;
  }
  const [signature, recoveryBit] = await secp.sign(messageHash, privateKey, {
    recovered: true,
    der: false,
  });
  console.log("signature: " + toHex(signature) + recoveryBit);
})();
