const CountDashboard = ({ title, count }) => {
  return (
    <div className="flex justify-between items-center">
      <h2 className="font-semibold">{title}</h2>
      <p>{count}</p>
    </div>
  );
};

export default CountDashboard;
