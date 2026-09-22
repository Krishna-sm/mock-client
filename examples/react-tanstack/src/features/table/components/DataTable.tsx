import { useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  type ColumnDef,
  type SortingState,
} from "@tanstack/react-table";
import type { Product } from "../../../types";
import { ArrowUpDown, ChevronLeft, ChevronRight, Search } from "lucide-react";

interface DataTableProps {
  readonly data: readonly Product[];
}

export function DataTable({ data }: DataTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Product Name",
      cell: (info) => <span className="font-medium text-black">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: (info) => <span className="tag-pill">{info.getValue<string>()}</span>,
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: (info) => (
        <span className="font-mono">${Number(info.getValue<number>()).toFixed(2)}</span>
      ),
    },
    {
      accessorKey: "stock",
      header: "Stock",
      cell: (info) => <span className="font-mono">{info.getValue<number>()} units</span>,
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: (info) => {
        const val = info.getValue<string>();
        return <span className="status-tag">{val.replace("_", " ")}</span>;
      },
    },
  ];

  const table = useReactTable({
    data: data as Product[],
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div className="table-wrapper">
      <div className="table-toolbar">
        <div className="search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search products..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            aria-label="Filter table products"
          />
        </div>
        <span className="table-total">
          {table.getFilteredRowModel().rows.length} total products
        </span>
      </div>

      <div className="table-scroll">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th key={header.id}>
                    {header.isPlaceholder ? null : (
                      <button
                        type="button"
                        className="th-btn"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        <ArrowUpDown size={12} />
                      </button>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-6 text-neutral-400">
                  No matching products found.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="table-pagination">
        <span className="page-indicator">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount() || 1}
        </span>
        <div className="pagination-controls">
          <button
            type="button"
            className="btn-outline btn-sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous table page"
          >
            <ChevronLeft size={14} />
            <span>Prev</span>
          </button>
          <button
            type="button"
            className="btn-outline btn-sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next table page"
          >
            <span>Next</span>
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
