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

//sample signatures for the respective public addresses in balances.
// you can generate new signatures in generate.js
const connectSignatures = [
  "ae741feecc3640fe3c90964c68fad392aa7573054878607e3525b0eef4ce27df0ee53dbbff07a11111f1ce899ee63f4d2d926d15e4bb5da99b3f4f89efa008611",
  "aad717f0d5344eb5162707d0ee7c67503b48e45e76367aef66bfd84da6b750db787290abd0897503f79d00329ffd341cee34e3b3788ba7d566d6d756aee575760",
  "945846ddedff74814edf37c5ada17fb74a92925bc0155ce5b62dd3455f5c3fc96e4c8369f159ffa2d70e751db57071c8d57f1a134ebc2385b4e2ab99e2be4d280",
];

const balances = {
  "0xce199b9b82f9adba3f6eefd92ecd7541f3a677df": 100,
  "0x9c195a017eea6e78c881272ba4c6539c26fd3a12": 50,
  "0xaa8c14d5660c12c488a65c59aba70ede3931483b": 75,
};

app.get("/balance/:signature", (req, res) => {
  const { signature } = req.params;
  const sig = new Uint8Array(Buffer.from(signature.slice(0, -1), "hex"));
  const recoveryBit = signature.slice(-1);
  console.log(sig);
  console.log(recoveryBit);
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
  const { sender, recipient, amount } = req.body;

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
