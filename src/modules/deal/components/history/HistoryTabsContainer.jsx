import { Box, Tab, Tabs } from "@mui/material";
import React, { Suspense, useState } from "react";
import AllHistory from "./tabs/AllHistoryTab";
import NoteHistoryTab from "./tabs/NoteHistoryTab";
import ActivityHistoryTab from "./tabs/ActivityHistoryTab";
import FileHistoryTab from "./tabs/FileHistoryTab";
import { Loader } from "@/modules/common";
import EmailHistoryTab from "./tabs/EmailHistoryTab";

const TabsContainer = ({ dealId }) => {
  const [currentTab, setCurrentTab] = useState(1);

  function handleTabChange(event, newTab) {
    setCurrentTab(newTab);
  }
  return (
    <Suspense>
      <Box className="bg-bg border-b">
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          textColor="primary"
          indicatorColor="primary"
          aria-label="primary tabs example"
        >
          <Tab value={1} label="All" />
          <Tab value={2} label="Note" />
          <Tab value={3} label="Activity" />
          <Tab value={4} label="File" />
          <Tab value={5} label="Email" />
        </Tabs>
      </Box>
      <Suspense
        fallback={
          <section className="p-10">
            <Loader />
          </section>
        }
      >
        <Box>{currentTab === 1 && <AllHistory dealId={dealId} />}</Box>
        <Box>{currentTab === 2 && <NoteHistoryTab dealId={dealId} />}</Box>
        <Box>{currentTab === 3 && <ActivityHistoryTab dealId={dealId} />}</Box>
        <Box>{currentTab === 4 && <FileHistoryTab dealId={dealId} />}</Box>
        <Box>{currentTab === 5 && <EmailHistoryTab dealId={dealId} />}</Box>
      </Suspense>
    </Suspense>
  );
};

export default TabsContainer;
