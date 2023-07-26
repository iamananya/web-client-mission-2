import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import ErrorMessage from "./ErrorMessage";
import TxList from "./TxList";
import { TextField, Button, Card, CardContent, CardHeader } from "@mui/material";
import Swal from "sweetalert2";

const startPayment = async ({ setError, setTxs, ether, addr, handlePaymentSuccess, handleTransactionPending }) => {
  try {
    if (!window.ethereum) throw new Error("No crypto wallet found. Please install it.");

    await window.ethereum.send("eth_requestAccounts");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    ethers.utils.getAddress(addr);
    const tx = await signer.sendTransaction({
      to: addr,
      value: ethers.utils.parseEther(ether),
    });
    console.log({ ether, addr });
    console.log("tx", tx);
    setTxs([tx]);
    handleTransactionPending(true); // Set isTransactionPending to true to show Swal message
    handlePaymentSuccess();
  } catch (err) {
    setError(err.message);
  }
};

export default function WalletCard({ onSubmit, selectedSeats, showID, handlePaymentSuccess, token_amount }) {
  const [error, setError] = useState();
  const [txs, setTxs] = useState([]);
  const [isTransactionPending, setTransactionPending] = useState(false);

  const handleTransactionPending = (status) => {
    setTransactionPending(status);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.target);
    setError();
    setTransactionPending(true);

    try {
      await startPayment({
        setError,
        setTxs,
        ether: data.get("ether"),
        addr: data.get("addr"),
        handlePaymentSuccess,
        handleTransactionPending,
      });
    } catch (err) {
      setError(err.message);
      setTransactionPending(false); // Set isTransactionPending to false to hide Swal message in case of error
    }
  };

  useEffect(() => {
    if (txs.length > 0) {
      const checkTransactionStatus = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const transactionReceipt = await provider.getTransactionReceipt(txs[0].hash);

        if (transactionReceipt && transactionReceipt.status === 1) {
          // Transaction is successful, perform relevant actions here
          handlePaymentSuccess();
        } else if (transactionReceipt && transactionReceipt.status === 0) {
          // Transaction failed, show error message or handle accordingly
          setError("Transaction failed. Please try again.");
        } else {
          // Transaction is still pending, do nothing
          // You can also add a timeout and show an error message if the transaction is pending for too long
        }

        setTransactionPending(false);
      };

      checkTransactionStatus();
    }
  }, [txs, handlePaymentSuccess]);

  return (
    <form className="m-4" onSubmit={handleSubmit}>
      <Card className="w-full lg:w-1/2 sm:w-auto shadow-lg mx-auto rounded-xl">
        <CardHeader title="Send ETH payment" />
        <CardContent>
          <div className="my-3">
            <TextField
              fullWidth
              variant="outlined"
              name="addr"
              label="Recipient Address"
              placeholder="Recipient Address"
              value="0xB6c7bEC0A366eC338e1B529f7CD551d6C1950bd9"
            />
          </div>
          <div className="my-3">
            <TextField
              fullWidth
              variant="outlined"
              name="ether"
              label="Amount in ETH"
              placeholder="Amount in ETH"
              value={token_amount}
            />
          </div>
        </CardContent>
        <CardContent>
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Pay now
          </Button>
          {isTransactionPending && (
            <p>Pending Confirmation...</p>
          )}
          <ErrorMessage message={error} />
          <TxList txs={txs} />
        </CardContent>
      </Card>
    </form>
  );
}
