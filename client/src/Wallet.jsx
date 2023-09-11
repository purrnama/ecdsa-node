import server from "./server";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const signature = evt.target.value;
    if (signature) {
      const {
        data: { address, balance },
      } = await server.get(`balance/${signature.toString()}`);
      setAddress(address);
      setBalance(balance);
    } else {
      setAddress("");
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Connect wallet
        <input
          placeholder="Enter a signature generated from your private key to connect"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      <div>Address: {address}</div>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
