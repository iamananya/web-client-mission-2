import React from "react";
import { Typography, Paper } from "@mui/material";

export default function TxList({ txs }) {
  if (txs.length === 0) return null;

  return (
    <>
      {txs.map((item) => (
        <Paper key={item} elevation={3} className="mt-5 p-2">
          <Typography variant="body1">{item.hash}</Typography>
        </Paper>
      ))}
    </>
  );
}
