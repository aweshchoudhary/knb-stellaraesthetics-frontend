const UserTable = () => {
  return (
    <div className="relative overflow-x-auto">
      <table className="text-left text-textColor border-t border-collapse">
        <thead className="text-white bg-primary text-sm font-medium">
          <tr>
            <th scope="col" className="px-3 py-2 min-w-[200px] border-x">
              Name
            </th>
            <th scope="col" className="px-3 py-2 min-w-[200px] border-x">
              Company
            </th>
            <th scope="col" className="px-3 py-2 min-w-[200px] border-x">
              Email
            </th>
            <th scope="col" className="px-3 py-2 min-w-[200px] border-x">
              Phone
            </th>
            <th scope="col" className="px-3 py-2 min-w-[200px] border-x">
              Whatsapp
            </th>
            <th scope="col" className="px-3 py-2 min-w-[200px] border-x">
              Open Deals
            </th>
            <th scope="col" className="px-3 py-2 min-w-[200px] border-x">
              Next Activity
            </th>
            <th scope="col" className="px-3 py-2 min-w-[200px] border-x">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr className="bg-bg border-b text-sm">
            <th
              scope="row"
              className="px-3 py-2 min-w-[200px] border-x font-medium text-textColor whitespace-nowrap "
            >
              Awesh Choudhary
            </th>
            <td className="px-3 py-2 min-w-[200px] border-x">
              Stellar Aesthetics
            </td>
            <td className="px-3 py-2 min-w-[200px] border-x">
              aweshchoudhary7@gmail.com
            </td>
            <td className="px-3 py-2 min-w-[200px] border-x">+919015077510</td>
            <td className="px-3 py-2 min-w-[200px] border-x">+919015077510</td>
            <td className="px-3 py-2 min-w-[200px] border-x">0</td>
            <td className="px-3 py-2 min-w-[200px] border-x">None</td>
            <td className="px-3 py-2 min-w-[200px] border-x">
              <button className="btn-outlined">Edit</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
export default UserTable;
