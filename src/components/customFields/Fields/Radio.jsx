const Radio = ({ name, radios }) => {
  return radios.map((item, index) => {
    return (
      <input
        type="radio"
        key={index}
        id={index}
        name={name}
        value={item.name}
      />
    );
  });
};

export default Radio;
