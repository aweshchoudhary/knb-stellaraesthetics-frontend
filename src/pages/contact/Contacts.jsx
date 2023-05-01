import PageHeader from "../components/global/Header";
import ContactTable from "../components/tables/ContactTable";
const Contacts = () => {
  return (
    <>
      <PageHeader title="Contacts" />
      <section className="w-full">
        <ContactTable />
      </section>
    </>
  );
};

export default Contacts;
