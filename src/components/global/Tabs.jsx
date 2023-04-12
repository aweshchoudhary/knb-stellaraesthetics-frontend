import { Icon } from "@iconify/react";
import { useState } from "react";

const Tabs = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  return (
    <section className="bg-bg">
      <header className="flex border-b">
        {tabs.map((tab, index) => {
          return (
            <button
              onClick={() => setActiveTab(tab)}
              key={index}
              className={`${
                tab.id === activeTab.id
                  ? "border-textColor"
                  : "border-transparent hover:border-textColor"
              } px-4 py-3 border-b-2 transition flex-1 flex items-center gap-2 justify-center capitalize`}
            >
              <Icon icon={tab.icon} />
              <p>{tab.name}</p>
            </button>
          );
        })}
      </header>
      <div>{activeTab.component}</div>
    </section>
  );
};

export default Tabs;
