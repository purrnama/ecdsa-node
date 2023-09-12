import { useEffect, useState } from "react";
import server from "./server";
function Transfer({ address, setBalance }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [signature, setSignature] = useState("");
  const [txHash, setTxHash] = useState("");

  const setValue = (setter) => async (evt) => {
    setter(evt.target.value);
  };

  useEffect(() => {
    async function getData() {
      if (address && sendAmount && recipient) {
        const message = address + "_sends_" + sendAmount + "_to_" + recipient;
        const {
          data: { messageHash },
        } = await server.get(`txhash/${message.toString()}`);
        setTxHash(messageHash);
      } else {
        setTxHash("");
      }
    }
    getData();
  }, [address, sendAmount, recipient]);

  async function transfer(evt) {
    evt.preventDefault();

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        sender: address,
        amount: parseInt(sendAmount),
        recipient,
        signature,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

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
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>
      <div>
        Transaction Hash:{" "}
        {Boolean(address && sendAmount && recipient) && txHash}
      </div>

      <label>
        Signature
        <input
          placeholder="Sign the transaction hash and enter the signature here to confirm"
          value={signature}
          onChange={setValue(setSignature)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
