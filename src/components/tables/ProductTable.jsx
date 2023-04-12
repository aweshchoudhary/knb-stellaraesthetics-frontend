const ProductTable = () => {
  return (
    <div class="relative overflow-x-auto">
      <table class="w-full text-left text-textColor">
        <thead class="text-textColor bg-paper">
          <tr>
            <th scope="col" class="p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500 focus:ring-2 "
                />
                <label for="checkbox-all-search" class="sr-only">
                  checkbox
                </label>
              </div>
            </th>
            <th scope="col" class="px-6 py-3">
              Product name
            </th>
            <th scope="col" class="px-6 py-3">
              Color
            </th>
            <th scope="col" class="px-6 py-3">
              Category
            </th>
            <th scope="col" class="px-6 py-3">
              Price
            </th>
            <th scope="col" class="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          <tr class="bg-bg border-b">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-table-search-1"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500    focus:ring-2 "
                />
                <label for="checkbox-table-search-1" class="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-textColor whitespace-nowrap "
            >
              Apple MacBook Pro 17"
            </th>
            <td class="px-6 py-4">Silver</td>
            <td class="px-6 py-4">Laptop</td>
            <td class="px-6 py-4">$2999</td>
            <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600  hover:underline">
                Edit
              </a>
            </td>
          </tr>
          <tr class="bg-bg border-b ">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-table-search-2"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500    focus:ring-2 "
                />
                <label for="checkbox-table-search-2" class="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-textColor whitespace-nowrap "
            >
              Microsoft Surface Pro
            </th>
            <td class="px-6 py-4">White</td>
            <td class="px-6 py-4">Laptop PC</td>
            <td class="px-6 py-4">$1999</td>
            <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600  hover:underline">
                Edit
              </a>
            </td>
          </tr>
          <tr class="bg-bg border-b ">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-table-search-3"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500    focus:ring-2 "
                />
                <label for="checkbox-table-search-3" class="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-textColor whitespace-nowrap "
            >
              Magic Mouse 2
            </th>
            <td class="px-6 py-4">Black</td>
            <td class="px-6 py-4">Accessories</td>
            <td class="px-6 py-4">$99</td>
            <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600  hover:underline">
                Edit
              </a>
            </td>
          </tr>
          <tr class="bg-bg border-b ">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-table-3"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500    focus:ring-2 "
                />
                <label for="checkbox-table-3" class="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-textColor whitespace-nowrap "
            >
              Apple Watch
            </th>
            <td class="px-6 py-4">Silver</td>
            <td class="px-6 py-4">Accessories</td>
            <td class="px-6 py-4">$179</td>
            <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600  hover:underline">
                Edit
              </a>
            </td>
          </tr>
          <tr class="bg-bg border-b ">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-table-3"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500    focus:ring-2 "
                />
                <label for="checkbox-table-3" class="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-textColor whitespace-nowrap "
            >
              iPad
            </th>
            <td class="px-6 py-4">Gold</td>
            <td class="px-6 py-4">Tablet</td>
            <td class="px-6 py-4">$699</td>
            <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600  hover:underline">
                Edit
              </a>
            </td>
          </tr>
          <tr class="bg-bg">
            <td class="w-4 p-4">
              <div class="flex items-center">
                <input
                  id="checkbox-table-3"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded focus:ring-blue-500    focus:ring-2 "
                />
                <label for="checkbox-table-3" class="sr-only">
                  checkbox
                </label>
              </div>
            </td>
            <th
              scope="row"
              class="px-6 py-4 font-medium text-textColor whitespace-nowrap "
            >
              Apple iMac 27"
            </th>
            <td class="px-6 py-4">Silver</td>
            <td class="px-6 py-4">PC Desktop</td>
            <td class="px-6 py-4">$3999</td>
            <td class="px-6 py-4">
              <a href="#" class="font-medium text-blue-600  hover:underline">
                Edit
              </a>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductTable;
