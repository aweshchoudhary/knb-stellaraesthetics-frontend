import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  lazy,
  Suspense,
} from "react";
import MaterialReactTable from "material-react-table";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import axiosInstance from "../../config/axiosInstance";
import { Icon } from "@iconify/react";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useGetDealsQuery } from "../../redux/services/dealApi";
import * as XLSX from "xlsx";
import { useGetMeQuery, useGetUserQuery } from "../../redux/services/userApi";
import { useSelector } from "react-redux";

const Model = lazy(() => import("../models/Model"));
const CreatePipelineModel = lazy(() => import("../models/CreatePipelineModel"));

const fetchSize = 10;

const PipelineTable = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { data: loggedUser } = useGetMeQuery();

  //defining columns outside of the component is fine, is stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Name",
        size: 250,
      },
      {
        accessorKey: "open-deals",
        id: "open-deals",
        header: "Open Deals",
        // size: 250,
        Cell: ({ row }) => {
          return (
            <Box>
              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <CardList pipelineId={row?.original?._id} />
            </Box>
          );
        },
      },
      {
        accessorFn: (row) => `${row?.deals?.length}`,
        id: "total-deals",
        header: "Total Deals",
        // size: 250,
        Cell: ({ renderedCellValue }) => {
          return (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
              <span>{renderedCellValue}</span>
            </Box>
          );
        },
      },
      {
        accessorKey: "won-deals",
        id: "won-deals",
        header: "Won Deals",
        // size: 250,
        Cell: ({ row }) => {
          return (
            <Box>
              <CardList status="won" pipelineId={row?.original?._id} />
            </Box>
          );
        },
      },
      {
        accessorKey: "lost-deals",
        id: "lost-deals",
        header: "Lost Deals",
        // size: 250,
        Cell: ({ row }) => {
          return (
            <Box>
              <CardList status="lost" pipelineId={row?.original?._id} />
            </Box>
          );
        },
      },
      {
        // size: 250,
        accessorKey: "owner",
        header: "Owner",
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue && <Owner ownerId={renderedCellValue} />;
        },
      },
    ],
    // [
    //   {
    //     id: "employee", //id used to define `group` column
    //     header: "Employee",
    //     columns: [
    //       {
    //         accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    //         id: "name",
    //         header: "Name",
    //         size: 250,
    //         Cell: ({ renderedCellValue, row }) => (
    //           <Box
    //             sx={{
    //               display: "flex",
    //               alignItems: "center",
    //               gap: "1rem",
    //             }}
    //           >
    //             <img
    //               alt="avatar"
    //               height={30}
    //               src={row.original.avatar}
    //               loading="lazy"
    //               style={{ borderRadius: "50%" }}
    //             />
    //             {/* using renderedCellValue instead of cell.getValue() preserves filter match highlighting */}
    //             <span>{renderedCellValue}</span>
    //           </Box>
    //         ),
    //       },
    //       {
    //         accessorKey: "email",
    //         enableClickToCopy: true,
    //         header: "Email",
    //         size: 300,
    //       },
    //     ],
    //   },
    //   {
    //     id: "id",
    //     header: "Job Info",
    //     columns: [
    //       {
    //         accessorKey: "salary",
    //         // filterVariant: 'range', //if not using filter modes feature, use this instead of filterFn
    //         filterFn: "between",
    //         header: "Salary",
    //         size: 200,
    //         //custom conditional format and styling
    //         Cell: ({ cell }) => (
    //           <Box
    //             component="span"
    //             sx={(theme) => ({
    //               backgroundColor:
    //                 cell.getValue() < 50_000
    //                   ? theme.palette.error.dark
    //                   : cell.getValue() >= 50_000 && cell.getValue() < 75_000
    //                   ? theme.palette.warning.dark
    //                   : theme.palette.success.dark,
    //               borderRadius: "0.25rem",
    //               color: "#fff",
    //               maxWidth: "9ch",
    //               p: "0.25rem",
    //             })}
    //           >
    //             {cell.getValue()?.toLocaleString?.("en-US", {
    //               style: "currency",
    //               currency: "USD",
    //               minimumFractionDigits: 0,
    //               maximumFractionDigits: 0,
    //             })}
    //           </Box>
    //         ),
    //       },
    //       {
    //         accessorKey: "jobTitle", //hey a simple column for once
    //         header: "Job Title",
    //         size: 350,
    //       },
    //       {
    //         accessorFn: (row) => new Date(row.startDate), //convert to Date for sorting and filtering
    //         id: "startDate",
    //         header: "Start Date",
    //         filterFn: "lessThanOrEqualTo",
    //         sortingFn: "datetime",
    //         Cell: ({ cell }) => cell.getValue()?.toLocaleDateString(), //render Date as a string
    //         Header: ({ column }) => <em>{column.columnDef.header}</em>, //custom header markup
    //         //Custom Date Picker Filter from @mui/x-date-pickers
    //         Filter: ({ column }) => (
    //           <LocalizationProvider dateAdapter={AdapterDayjs}>
    //             <DatePicker
    //               onChange={(newValue) => {
    //                 column.setFilterValue(newValue);
    //               }}
    //               slotProps={{
    //                 textField: {
    //                   helperText: "Filter Mode: Less Than",
    //                   sx: { minWidth: "120px" },
    //                   variant: "standard",
    //                 },
    //               }}
    //               value={column.getFilterValue()}
    //             />
    //           </LocalizationProvider>
    //         ),
    //       },
    //     ],
    //   },
    // ],
    []
  );

  const tableContainerRef = useRef(null);
  const rowVirtualizerInstanceRef = useRef(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [isCreatePipelineModelOpen, setIsCreatePipelineModelOpen] =
    useState(false);

  const { data, fetchNextPage, isError, isFetching, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ["table-data", columnFilters, globalFilter, sorting],
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await axiosInstance.get(
          "/api/pipeline/get-pipelines",
          {
            params: {
              start: pageParam * fetchSize,
              size: fetchSize,
              filter: JSON.stringify(columnFilters ?? []),
              sort: JSON.stringify(sorting ?? []),
              search: globalFilter,
              data: true,
              count: true,
            },
            headers: {
              Authorization: accessToken,
            },
          }
        );
        return data;
      },
      getNextPageParam: (_lastGroup, groups) => groups.length,
      keepPreviousData: true,
      refetchOnWindowFocus: false,
    });

  const flatData = useMemo(
    () => data?.pages.flatMap((page) => page.data) ?? [],
    [data]
  );
  const totalDBRowCount = data?.pages?.[0]?.meta?.total ?? 0;
  const totalFetched = flatData.length;

  //called on scroll and possibly on mount to fetch more data as the user scrolls and reaches bottom of table
  const fetchMoreOnBottomReached = useCallback(
    (containerRefElement) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        //once the user has scrolled within 400px of the bottom of the table, fetch more data if we can
        if (
          scrollHeight - scrollTop - clientHeight < 450 &&
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

  const handleExportData = (rows) => {
    const customizedData = [];
    if (rows.length) {
      rows.forEach((item) => {
        const { contactPerson, company, email, mobile, whatsapp } =
          item.original;
        customizedData.push({
          company,
          contactPerson,
          mobile,
          whatsapp,
          email,
        });
      });
    } else {
      flatData.forEach((item) => {
        const { contactPerson, company, email, mobile, whatsapp } = item;
        customizedData.push({
          company,
          contactPerson,
          mobile,
          whatsapp,
          email,
        });
      });
    }
    const worksheet = XLSX.utils.json_to_sheet(customizedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Contacts List V1");
    //let buffer = XLSX.write(workbook, { bookType: "xlsx", type: "buffer" });
    //XLSX.write(workbook, { bookType: "xlsx", type: "binary" });
    XLSX.writeFile(
      workbook,
      Math.floor(Date.now() * Math.random() * 100) + ".xlsx"
    );
  };
  return (
    <>
      <MaterialReactTable
        columns={columns}
        data={flatData}
        enablePagination={false}
        // enableRowVirtualization //optional, but recommended if it is likely going to be more than 100 rows
        manualFiltering
        manualSorting
        enableRowActions
        muiTableContainerProps={{
          ref: tableContainerRef, //get access to the table container element
          sx: { maxHeight: "500px" }, //give the table a max height
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
        renderRowActions={({ row }) => (
          <div className="flex gap-1">
            <Link
              className="btn-filled btn-small"
              to={"/pipeline/" + row.original._id}
            >
              <Icon className="text-lg" icon={"ic:baseline-remove-red-eye"} />
            </Link>
          </div>
        )}
        enableRowSelection
        renderTopToolbarCustomActions={({ table }) => (
          <Box display="flex" alignItems={"stretch"} gap="5px">
            {loggedUser && loggedUser?.role !== "member" && (
              <button
                onClick={() => setIsCreatePipelineModelOpen(true)}
                className="btn-filled btn-small h-full"
                disabled={loggedUser?.role === "member"}
              >
                <Icon icon="uil:plus" className="text-lg" />
              </button>
            )}
            <button
              onClick={() => refetch()}
              className="btn-outlined btn-small h-full"
            >
              <Icon icon={"tabler:reload"} className="text-lg" />
            </button>
            <button
              onClick={() => setDownloadMenuOpen((prev) => !prev)}
              className="btn-outlined btn-small h-full"
            >
              <Icon
                icon={
                  downloadMenuOpen ? "ic:baseline-close" : "ic:round-download"
                }
                className="text-lg"
              />
            </button>
            {downloadMenuOpen && (
              <Box display="flex" gap="5px">
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
                    handleExportData(table.getPrePaginationRowModel().rows)
                  }
                >
                  Export All Rows
                </button>
                <button
                  disabled={table.getRowModel().rows.length === 0}
                  className="btn-outlined btn-small"
                  onClick={() => handleExportData(table.getRowModel().rows)}
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
                    handleExportData(table.getSelectedRowModel().rows)
                  }
                >
                  Export Selected Rows
                </button>
              </Box>
            )}
          </Box>
        )}
      />
      <Suspense>
        {loggedUser?.role !== "member" && isCreatePipelineModelOpen && (
          <Model
            isOpen={isCreatePipelineModelOpen}
            setIsOpen={setIsCreatePipelineModelOpen}
            title="Edit Pipeline"
          >
            <CreatePipelineModel setIsOpen={setIsCreatePipelineModelOpen} />
          </Model>
        )}
      </Suspense>
    </>
  );
};

const CardList = ({ pipelineId, status }) => {
  const { data, isLoading, isFetching } = useGetDealsQuery({
    filters: JSON.stringify([
      { id: "status", value: status || "open" },
      { id: "pipelineId", value: pipelineId },
    ]),
    count: true,
  });

  return (
    <span className={status === "lost" ? "text-red-600" : "text-green-600"}>
      {isLoading && isFetching ? "Loading..." : data?.meta?.total}
    </span>
  );
};
const Owner = ({ ownerId }) => {
  const { data, isLoading, isFetching, isSuccess } = useGetUserQuery(ownerId);
  return (
    isSuccess &&
    !isLoading &&
    !isFetching && (
      <>
        {data ? (
          <Link
            to={"/user/" + data._id}
            className="underline capitalize font-medium hover:text-primary"
          >
            {isLoading && isFetching ? "Loading..." : data.fullname}
          </Link>
        ) : (
          <p className="text-red-600">Owner Deleted</p>
        )}
      </>
    )
  );
};

const queryClient = new QueryClient();

const ContactTableComponent = () => (
  <QueryClientProvider client={queryClient}>
    <PipelineTable />
  </QueryClientProvider>
);

export default ContactTableComponent;
