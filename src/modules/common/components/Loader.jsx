const Loader = ({ w, h }) => {
  return (
    <div
      className={`loader ${h ? `h-[${h}px]` : "h-[20px]"} ${
        w ? `w-[${w}px]` : "w-[200px]"
      }`}
    ></div>
  );
};

export default Loader;
