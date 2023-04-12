const Range = ({ value, setValue, min, max, step, name }) => {
  return (
    <input type="range" name={name} id={name} min={min} max={max} step={step} />
  );
};

export default Range;
