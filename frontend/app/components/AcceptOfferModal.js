import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import SwapAccept from "./SwapAccept";

const AcceptSwapModal = ({ otherUser, children, origin = "" }) => {
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent
        style={{
          minWidth: "40vw",
          padding: "50px",
          overflowY: "scroll",
        }}
      >
        <SwapAccept otherUser={otherUser}></SwapAccept>
      </DialogContent>
    </Dialog>
  );
};

export default AcceptSwapModal;
