import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  Suspense,
} from "react";

import MaterialReactTable from "material-react-table";
import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Icon } from "@iconify/react";
import {
  QueryClient,
  QueryClientProvider,
  useInfiniteQuery,
} from "@tanstack/react-query";
import * as XLSX from "xlsx";
import { useGetMeQuery, useGetUserQuery } from "@/redux/services/userApi";
import { useSelector } from "react-redux";
import { axiosInstance, Model } from "@/modules/common";

import { CreateItemModel } from "@/modules/item";

const fetchSize = 10;

const ProductServiceTable = () => {
  const accessToken = useSelector((state) => state.auth.accessToken);
  const { data: loggedUser } = useGetMeQuery();

  //defining columns outside of the component is fine, is stable
  const columns = useMemo(
    () => [
      {
        accessorKey: "title",
        header: "Title",
        size: 300,
      },
      {
        accessorKey: "type",
        header: "Type",
        size: 150,
      },
      {
        accessorKey: "rate",
        header: "Rate",
        size: 150,
      },
      {
        accessorKey: "currency",
        header: "Currency",
        size: 150,
      },
      {
        // size: 250,
        accessorKey: "creator",
        header: "Creator",
        Cell: ({ renderedCellValue }) => {
          return renderedCellValue && <Creator creatorId={renderedCellValue} />;
        },
      },
    ],
    []
  );

  const tableContainerRef = useRef(null);
  const rowVirtualizerInstanceRef = useRef(null);
  const [downloadMenuOpen, setDownloadMenuOpen] = useState(false);

  const [columnFilters, setColumnFilters] = useState([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const [isCreateItemModelOpen, setIsCreateItemModelOpen] = useState(false);

  const { data, fetchNextPage, isError, isFetching, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ["table-data", columnFilters, globalFilter, sorting],
      queryFn: async ({ pageParam = 0 }) => {
        const { data } = await axiosInstance.get("/api/item/get-items", {
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
            <Link
              className="btn-filled btn-small"
              to={"/products-services/" + row.original._id}
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
                onClick={() => setIsCreateItemModelOpen(true)}
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
        {loggedUser?.role !== "member" && isCreateItemModelOpen && (
          <Model
            isOpen={isCreateItemModelOpen}
            setIsOpen={setIsCreateItemModelOpen}
            title="Create Product Service"
          >
            <CreateItemModel setIsOpen={setIsCreateItemModelOpen} />
          </Model>
        )}
      </Suspense>
    </Suspense>
  );
};

const Creator = ({ creatorId }) => {
  const { data, isLoading, isFetching, isSuccess } = useGetUserQuery(creatorId);
  return (
    isSuccess &&
    !isLoading &&
    !isFetching && (
      <>
        {data ? (
          <Link
            to={"/users/" + data._id}
            className="underline capitalize font-medium hover:text-primary"
          >
            {isLoading && isFetching ? "Loading..." : data.fullname}
          </Link>
        ) : (
          <p className="text-red-600">Creator Deleted</p>
        )}
      </>
    )
  );
};

const queryClient = new QueryClient();

const ContactTableComponent = () => (
  <QueryClientProvider client={queryClient}>
    <ProductServiceTable />
  </QueryClientProvider>
);

export default ContactTableComponent;
