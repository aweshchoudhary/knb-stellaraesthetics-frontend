import { Icon } from "@iconify/react";
import { Box, Modal, Typography } from "@mui/material";

const Model = ({ children, isOpen, setIsOpen, title }) => {
  return (
    isOpen && (
      <Modal
        open={isOpen}
        onClose={() => setIsOpen(false)}
        className="h-screen flex items-center"
      >
        <div className="bg-bg md:w-[60%] mx-auto max-h-[90%] flex flex-col relative">
          <header className="bg-primary text-white flex items-center justify-between h-[50px] py-3 px-5">
            <Typography fontWeight={"400"}>{title}</Typography>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-gray-500 p-2 rounded-full"
            >
              <Icon icon={"uil:times"} className="text-2xl" />
            </button>
          </header>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </div>
      </Modal>
    )
  );
};

export default Model;
