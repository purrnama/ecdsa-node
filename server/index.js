const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const secp = require("@noble/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");
const { Buffer } = require("node:buffer");

app.use(cors());
app.use(express.json());

//sample signatures for the respective public addresses in balances object.
// you can generate new signatures in generate.js
const connectSignatures = [
  "5dcd141bb4d46bdbe26616719c189e48af7558319ad4bbef68e15f2f404105a71b24e491228594dea63762ab9f583fc4fddab80ff132af91b89c1b83b21a82f81",
  "4dc40bffeb9524b09070f20a61228899930a93673195c57d9c16bafffdf116ea1af9dba02916bd27353561e60908bcea12461d40ac93e52ee23a80c9490c26b71",
  "e8cb4e6a79f3aef32b7d2ef3e3d90f2ba4ccbef9b5d2d0e422b8498b7fae19de2744307bed4b2c3fc0448c0e1b1617acca7c22a10b481eda99b3a16514bbb5f81",
];

//sample private keys
const privateKeys = [
  "00cb13699ceaa4b99fd428c63f7bc55b9ee51318da43aacc773b6134828d1107",
  "cfb5a50fe17f30dd97a635c2121dbfcc4bceef59854d3d0db8587af5e933ec86",
  "50c4b3abc520687ccb051e094f17f396d0ef2fcc16c07970dacfaec1cdf6bd18",
];

const balances = {
  "0x0cd2c172b606f539bbe8d7b750ee362227dc067a": 100,
  "0x8761f89031a7a9174fe40577b26327e7c0f9e581": 50,
  "0x2c35d4c850a2e13c599971938dd4d2ba4f4245c2": 75,
};

app.get("/txhash/:message", (req, res) => {
  const { message } = req.params;
  console.log(message);
  const messageHash = toHex(keccak256(utf8ToBytes(message)));
  res.send({ messageHash });
});

app.get("/balance/:signature", (req, res) => {
  const { signature } = req.params;
  const sig = new Uint8Array(Buffer.from(signature.slice(0, -1), "hex"));
  const recoveryBit = signature.slice(-1);
  const publicKey = secp.recoverPublicKey(
    keccak256(utf8ToBytes("connect")),
    sig,
    Number(recoveryBit)
  );
  const address = "0x" + toHex(keccak256(publicKey).slice(-20));
  const balance = balances[address] || 0;
  res.send({ address, balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;
  const sig = new Uint8Array(Buffer.from(signature.slice(0, -1), "hex"));
  const recoveryBit = signature.slice(-1);
  const messageHash = keccak256(
    utf8ToBytes(sender + "_sends_" + amount + "_to_" + recipient)
  );
  const publicKey = secp.recoverPublicKey(
    messageHash,
    sig,
    Number(recoveryBit)
  );
  const verifyHash = secp.verify(sig, messageHash, publicKey);
  const address = "0x" + toHex(keccak256(publicKey).slice(-20));

  if (!verifyHash) {
    res.status(400).send({ message: "Hash not verified!" });
    return;
  }
  if (address !== sender.toString()) {
    res.status(400).send({ message: "address recovered not equal to sender!" });
    console.log("address:", address);
    console.log("sender:", sender.toString());
    return;
  }
  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
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
