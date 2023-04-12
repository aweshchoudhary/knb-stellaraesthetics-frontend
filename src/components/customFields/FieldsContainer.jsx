import { useState } from "react";
import Model from "../models/Model";

const FieldsContainer = () => {
  const [customField, setCustomField] = useState({});
  return (
    <section>
      {/* <Model></Model> */}
      <button className="btn-filled">add field</button>
    </section>
  );
};

export default FieldsContainer;
