import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import React, { useEffect, useState } from "react";
import SwapAccept from "./SwapAccept";

const AcceptSwapModal = ({
  otherUser,
  modalOpen,
  setModalOpen,
  children,
  origin = "",
}) => {
  return (
    <Dialog open={modalOpen} onOpenChange={setModalOpen}>
      <DialogTrigger className="w-full">{children}</DialogTrigger>
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
