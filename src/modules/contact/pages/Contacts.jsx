import React, { Suspense } from "react";
import { Header } from "@/modules/common";
import { ContactTable } from "@/modules/contact";
const Contacts = () => {
  return (
    <Suspense>
      <Header title="Contacts" />
      <section className="w-full">
        <ContactTable />
      </section>
    </Suspense>
  );
};

export default Contacts;
