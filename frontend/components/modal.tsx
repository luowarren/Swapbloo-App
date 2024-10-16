import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";

// THIS IS JUST EXAMPLE CODE
const Modal = () => {
  return (
    <Dialog>
      <DialogTrigger>
        <div>button</div>
      </DialogTrigger>
      <DialogContent className="min-w-[80vw] h-[80vh] overflow-scroll">
        What's inside the modal when opened!!! !!SUPER IMPORTANT!! MAKE SURE YOU
        IMPORT FROM /components/ui, NOT @radix!!!!!!!!
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
