import PageHeader from "../components/global/Header";
import ContactTable from "../components/tables/ContactTable";
import AdvanceTable from "../components/tables/AdvanceTable";
const Contacts = () => {
  return (
    <>
      <PageHeader title="Contacts" />
      <section className="w-full">
        {/* <ContactTable /> */}
        <AdvanceTable />
      </section>
    </>
  );
};

export default Contacts;
