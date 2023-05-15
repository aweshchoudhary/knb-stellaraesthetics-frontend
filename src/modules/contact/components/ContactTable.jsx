import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";
import MaterialReactTable from "material-react-table";
import { Box, Tooltip, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { axiosInstance, Model } from "@/modules/common";

import { useGetDealsQuery } from "@/redux/services/dealApi";
import { useGetActivitiesQuery } from "@/redux/services/activityApi";
import { useSelector } from "react-redux";

import { EditContact } from "@/modules/contact";
import moment from "moment";
import { useGetMeQuery } from "@/redux/services/userApi";

const fetchLimit = 10;

const ContactTable = () => {
  const columns = useMemo(
    () => [
      {
        accessorKey: "contactPerson",
        header: "Contact Person",
        size: 250,
      },
      {
        accessorKey: "company",
        header: "Company",
        size: 250,
      },
      {
        id: "total-deals",
        header: "Deals",
        // size: 250,
        Cell: ({ row }) => {
          return row?.original?._id && <Deals contactId={row.original._id} />;
        },
      },
      {
        id: "next-activites",
        header: "Next Activity",
        // size: 250,
        Cell: ({ row }) => {
          return (
            row?.original?._id && <NextActivity contactId={row.original._id} />
          );
        },
      },
    ],
    []
  );
  const accessToken = useSelector((state) => state.auth.accessToken);
  const tableContainerRef = useRef(null);
  const rowVirtualizerInstanceRef = useRef(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState();
  const [sorting, setSorting] = useState([]);

  const [isContactEditModelOpen, setIsContactEditModelOpen] = useState(false);
  const [editRow, setEditRow] = useState({});

  const { data: user } = useGetMeQuery();

  const { data, fetchNextPage, isError, isFetching, isLoading } =
    useInfiniteQuery({
      queryKey: ["table-data", columnFilters, globalFilter, sorting],
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await axiosInstance.get("/api/contact/get-contacts", {
          params: {
            start: pageParam * fetchLimit,
            limit: fetchLimit,
            filter: JSON.stringify(columnFilters ?? []),
            sort: JSON.stringify(sorting ?? []),
            search: globalFilter,
            data: true,
            count: true,
          },
          headers: {
            Authorization: accessToken,
          },
        });
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
    <Suspense>
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
            {user?.role === "admin" && (
              <button
                className="btn-outlined btn-small"
                onClick={() => {
                  setIsContactEditModelOpen(true);
                  setEditRow(row);
                }}
              >
                <Icon icon={"uil:pen"} />
              </button>
            )}
            <Link
              className="btn-filled btn-small"
              to={"/contacts/" + row.original._id}
            >
              <Icon className="text-lg" icon={"ic:baseline-remove-red-eye"} />
            </Link>
          </div>
        )}
        enableRowSelection
        renderTopToolbarCustomActions={({ table }) => (
          <Box display="flex" gap="5px">
            {user?.role === "admin" && (
              <Tooltip title="Create Contact">
                <button className="btn btn-filled btn-small h-full">
                  <Icon icon="uil:plus" className="text-xl" />
                </button>
              </Tooltip>
            )}
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
      <Model
        isOpen={isContactEditModelOpen}
        setIsOpen={setIsContactEditModelOpen}
        title="Edit Contact"
      >
        <EditContact data={editRow} setIsOpen={setIsContactEditModelOpen} />
      </Model>
    </Suspense>
  );
};

const Deals = ({ contactId, status }) => {
  const { data, isLoading, isFetching } = useGetDealsQuery({
    filters: JSON.stringify([
      { id: "status", value: status || "open" },
      { id: "contacts", value: contactId },
    ]),
    count: true,
  });

  return (
    <span className={status === "lost" ? "text-red-600" : "text-green-600"}>
      {isLoading && isFetching ? "Loading..." : data?.meta?.total}
    </span>
  );
};

const NextActivity = ({ contactId }) => {
  const [latestActivity, setLatestActivity] = useState(null);
  const { data, isLoading, isFetching } = useGetActivitiesQuery({
    filters: JSON.stringify([{ id: "contacts", value: contactId }]),
    data: true,
  });
  useEffect(() => {
    const getLatesActivity = () => {
      data.reduce((date, activity) => {
        const activityDate = moment(activity.date); // Assuming activity.date is a valid date string

        if (!date || activityDate.isAfter(date)) {
          setLatestActivity(activity);
          return;
        } else {
          return date;
        }
      }, null);
    };
    if (data?.length) {
      getLatesActivity();
    }
  }, [data]);
  return (
    <span className={!latestActivity ? "text-red-600" : "text-green-600"}>
      {isLoading && isFetching ? (
        "Loading..."
      ) : (
        <span>
          {latestActivity
            ? moment(latestActivity.startDateTime).format("hh:mm | DD/MM/YYYY")
            : "No Activity"}
        </span>
      )}
    </span>
  );
};

const queryClient = new QueryClient();

const ContactTableComponent = () => (
  <QueryClientProvider client={queryClient}>
    <ContactTable />
  </QueryClientProvider>
);

export default ContactTableComponent;
