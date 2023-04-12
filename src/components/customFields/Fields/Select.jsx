const Select = ({ value, setValue, name, options }) => {
  return (
    <select name={name} id={name}>
      {options.map((item, index) => {
        return <option value={item.value}>{item.name}</option>;
      })}
    </select>
  );
};

export default Select;
