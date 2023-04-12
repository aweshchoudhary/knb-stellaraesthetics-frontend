import { Icon } from "@iconify/react";
import { useState } from "react";

const Accordian = ({ children, title }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="w-full">
      <AccordianHeader setIsOpen={setIsOpen} isOpen={isOpen}>
        {title}
      </AccordianHeader>
      {isOpen && <div className="body">{children}</div>}
    </div>
  );
};

export const AccordianHeader = ({ children, setIsOpen, isOpen }) => {
  return (
    <header
      onClick={() => setIsOpen((prev) => !prev)}
      className="w-full cursor-pointer border-y border-collapse p-3 bg-paper flex items-center justify-between"
    >
      <h2>{children}</h2>
      <Icon
        icon={isOpen ? "uil:arrow-up" : "uil:arrow-down"}
        className="text-xl"
      />
    </header>
  );
};

export const AccordianBody = ({ children }) => {
  return <div className="p-5">{children}</div>;
};

export default Accordian;
