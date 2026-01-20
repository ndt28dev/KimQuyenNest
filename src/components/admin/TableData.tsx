"use client";

import {
  MantineReactTable,
  useMantineReactTable,
  type MRT_ColumnDef,
} from "mantine-react-table";
import type { ReactNode } from "react";

type TableDataProps<T extends Record<string, unknown>> = {
  data: T[];
  columns: MRT_ColumnDef<T>[];
  topToolbar?: ReactNode;
};

function TableData<T extends Record<string, unknown>>({
  data,
  columns,
  topToolbar,
}: TableDataProps<T>) {
  const table = useMantineReactTable({
    data,
    columns,

    renderTopToolbarCustomActions: () => topToolbar,

    layoutMode: "grid",
    enableColumnResizing: true,

    enableColumnPinning: true, // 👈 BẮT BUỘC

    initialState: {
      columnPinning: {
        right: ["actions"], // 👈 pin cột thao tác bên phải
      },
    },

    mantineTableContainerProps: {
      style: {
        overflowX: "auto",
        maxWidth: "100%",
      },
    },

    mantineTableProps: {
      style: {
        width: "max-content",
        minWidth: "100%",
      },
    },

    mantineTableHeadCellProps: {
      style: {
        whiteSpace: "nowrap",
      },
    },

    mantineTableBodyCellProps: {
      style: {
        whiteSpace: "nowrap",
      },
    },
  });

  return <MantineReactTable table={table} />;
}

export default TableData;
