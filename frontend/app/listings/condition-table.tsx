"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Checkbox } from "@/components/ui/checkbox";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CONDITIONS } from "@/service/constants";

const data: ConditionsType[] = CONDITIONS.map((cond) => {
  return { id: cond, condition: cond };
});

const descriptions: {
  New: string;
  "Used - Like new": string;
  "Used - Good": string;
  "Used - Fair": string;
} = {
  New: "Brand new condition",
  "Used - Like new": "Almost like new",
  "Used - Good": "In good condition",
  "Used - Fair": "Fair condition",
};

function isConditionKey(value: string): value is keyof typeof descriptions {
  return value in descriptions;
}

export type ConditionsType = {
  id: string;
  condition: string;
};

export const columns: ColumnDef<ConditionsType>[] = [
  {
    id: "select",
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "condition",
    header: "condition",
    cell: ({ row }) => {
      const condition = row.getValue("condition") as string;

      return (
        <div>
          <div className="text-gray-600">{condition}</div>
          {isConditionKey(condition) && (
            <div className="text-gray-400 text-xs">
              {descriptions[condition]}
            </div>
          )}
        </div>
      );
    },
  },
];

export function ConditionTable({
  cond,
  setCond,
}: {
  cond: string[];
  setCond: (cond: string[]) => void;
}) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const handleRowSelectionChange = (newRowSelection: any) => {
    setRowSelection(newRowSelection);

    const selectedConditions = Object.keys(newRowSelection(rowSelection)).map(
      (index) => CONDITIONS[Number(index)]
    );

    setCond(selectedConditions);
  };

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: handleRowSelectionChange,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full bg-white rounded-lg">
      <div className="rounded-md border">
        <Table>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
