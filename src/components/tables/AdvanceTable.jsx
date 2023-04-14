import { useRef, useState, useEffect, useMemo, useCallback } from "react";
import MaterialReactTable from "material-react-table";
import { Typography } from "@mui/material";
import axiosInstance from "../../config/axiosInstance";
import { Icon } from "@iconify/react";

import { ExportToCsv } from "export-to-csv";

import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";

//defining columns outside of the component is fine, is stable
const columns = [
  {
    accessorKey: "contactPerson",
    header: "Contact Person",
  },
  {
    accessorKey: "company",
    header: "Company",
  },
  {
    accessorKey: "mobile",
    header: "Mobile",
  },
  {
    accessorKey: "whatsapp",
    header: "Whatsapp",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
const csvOptions = {
  fieldSeparator: ",",
  quoteStrings: '"',
  decimalSeparator: ".",
  showLabels: true,
  useBom: true,
  useKeysAsHeaders: false,
  headers: columns.map((c) => c.header),
};
const csvExporter = new ExportToCsv(csvOptions);
const fetchSize = 25;

const ContactTable = () => {
  const tableContainerRef = useRef(null);
  const rowVirtualizerInstanceRef = useRef(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [sorting, setSorting] = useState([]);
  console.log(globalFilter);

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["table-data", columnFilters, globalFilter, sorting],
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await axiosInstance.get("/api/client/get-clients", {
          params: {
            start: pageParam * fetchSize,
            size: fetchSize,
            filters: JSON.stringify(columnFilters ?? []),
            sorting: JSON.stringify(sorting ?? []),
            search: globalFilter,
          },
        });
        return data;
        // const url = new URL("/api/client/get-clients", "http://localhost:5000");
        // url.searchParams.set("start", `${pageParam * fetchSize}`);
        // url.searchParams.set("size", `${fetchSize}`);
        // url.searchParams.set("filters", JSON.stringify(columnFilters ?? []));
        // url.searchParams.set("globalFilter", globalFilter ?? "");
        // url.searchParams.set("sorting", JSON.stringify(sorting ?? []));
        // const response = await fetch(url.href);
        // const json = await response.json();
        // return json;
      },
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );

  const totalDBRowCount = data?.pages?.[0]?.meta?.totalRowCount ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 400 &&
          !isFetching &&
          totalFetched < totalDBRowCount
        ) {
          fetchNextPage();
        }
      }
    },
    [fetchNextPage, isFetching, totalFetched, totalDBRowCount]
  );

  //scroll to top of table when sorting or filters change
  useEffect(() => {
    //scroll to the top of the table when the sorting changes
    try {
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting, columnFilters, globalFilter]);

  //a check on mount to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    fetchMoreOnBottomReached(tableContainerRef.current);
  }, [fetchMoreOnBottomReached]);

  const handleExportRows = (rows) => {
    csvExporter.generateCsv(rows.map((row) => row.original));
  };
  const handleExportData = () => {
    csvExporter.generateCsv(flatData);
  };
  return (
    <MaterialReactTable
      columns={columns}
      data={flatData}
      enablePagination={false}
      enableRowVirtualization //optional, but recommended if it is likely going to be more than 100 rows
      manualFiltering
      manualSorting
      muiTableContainerProps={{
        ref: tableContainerRef, //get access to the table container element
        sx: { maxHeight: "600px" }, //give the table a max height
        onScroll: (
          event //add an event listener to the table container element
        ) => fetchMoreOnBottomReached(event.target),
      }}
      muiToolbarAlertBannerProps={
        isError
          ? {
              color: "error",
              children: "Error loading data",
            }
          : undefined
      }
      onColumnFiltersChange={setColumnFilters}
      onGlobalFilterChange={setGlobalFilter}
      onSortingChange={setSorting}
      renderBottomToolbarCustomActions={() => (
        <Typography>
          Fetched {totalFetched} of {totalDBRowCount} total rows.
        </Typography>
      )}
      state={{
        columnFilters,
        globalFilter,
        isLoading,
        showAlertBanner: isError,
        showProgressBars: isFetching,
        sorting,
      }}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} //get access to the virtualizer instance
      rowVirtualizerProps={{ overscan: 4 }}
      renderTopToolbarCustomActions={({ table }) => (
        <div className="flex gap-5">
          <button
            onClick={() => setDownloadMenuOpen((prev) => !prev)}
            className="btn-filled btn-small h-full"
          >
            <Icon
              icon={
                downloadMenuOpen ? "ic:baseline-close" : "ic:round-download"
              }
              className="text-lg"
            />
          </button>
          {downloadMenuOpen && (
            <div className="flex gap-3">
              <button
                onClick={handleExportData}
                className="btn-outlined btn-small"
              >
                Export All Data
              </button>
              <button
                disabled={table.getPrePaginationRowModel().rows.length === 0}
                className="btn-outlined btn-small"
                onClick={() =>
                  handleExportRows(table.getPrePaginationRowModel().rows)
                }
              >
                Export All Rows
              </button>
              <button
                disabled={table.getRowModel().rows.length === 0}
                className="btn-outlined btn-small"
                onClick={() => handleExportRows(table.getRowModel().rows)}
              >
                Export Page Rows
              </button>
              <button
                className="btn-outlined btn-small"
                disabled={
                  !table.getIsSomeRowsSelected() &&
                  !table.getIsAllRowsSelected()
                }
                onClick={() =>
                  handleExportRows(table.getSelectedRowModel().rows)
                }
              >
                Export Selected Rows
              </button>
            </div>
          )}
        </div>
      )}
      enableRowSelection
    />
  );
};

const queryClient = new QueryClient();

const ContactTableComponent = () => (
  <QueryClientProvider client={queryClient}>
    <ContactTable />
  </QueryClientProvider>
);

export default ContactTableComponent;
