import { Box, Tab, Tabs } from "@mui/material";
import React, { Suspense, useState } from "react";
import AllHistory from "./AllHistoryTab";
import NoteHistoryTab from "../note/NoteHistoryTab";
import ActivityHistoryTab from "../activity/ActivityHistoryTab";
import FileHistoryTab from "../file/FileHistoryTab";
import { Loader } from "@/modules/common";
import EmailHistoryTab from "../email/EmailHistoryTab";

const TabsContainer = ({ activities, notes, files }) => {
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
        {currentTab === 1 && (
          <AllHistory activities={activities} notes={notes} files={files} />
        )}
        {currentTab === 2 && <NoteHistoryTab notes={notes} />}
        {currentTab === 3 && <ActivityHistoryTab activities={activities} />}
        {currentTab === 4 && <FileHistoryTab files={files} />}
        {currentTab === 5 && <EmailHistoryTab />}
      </Suspense>
    </Suspense>
  );
};

export default TabsContainer;
