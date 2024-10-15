"use client";
import React, { useEffect, useState } from "react";
import {
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
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ManageInvestmentCol } from "@/app/components/schema/Columns";
import Image from "next/image";
import empty from "../../components/assets/images/dashboard/empty.svg";
import { ContainerDashboard, DashboardHeader } from "@/components/ui/containers";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus } from "lucide-react";
import { NewUser } from "@/app/components/dashboard/User";
import { useGetAllInvestment } from "@/hooks/investment";
import { NewInvestment } from "@/app/components/dashboard/Investment";

const ManageInvestment = () => {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [data, setData] = useState<any>([]);
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 }); // Set default page size to 10

  const { data: investments } = useGetAllInvestment();
  useEffect(() => {
    if (investments) {
      setData(investments);
    }
  }, [investments]);

  console.log(investments);

  const table = useReactTable({
    data: data,
    columns: ManageInvestmentCol,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  return (
    <ContainerDashboard>
      <DashboardHeader>
        <div className='flex flex-col gap-2'>
          <h2>Investments</h2>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant={"ghost"} className='mr-0 flex items-center gap-2'>
              <Plus className='w-5 h-5' />
              Add Investment
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <NewInvestment edit='none' />
          </AlertDialogContent>
        </AlertDialog>
      </DashboardHeader>
      <div className='mt-10'>
        <div className='relative'>
          <div className='max-w-full'>
            <DashboardHeader className='relative top-0 pt-5 pb-10'>
              <h4>Investments List</h4>
              <Input
                placeholder='Search investments...'
                value={(table.getColumn("product")?.getFilterValue() as string) ?? ""}
                onChange={(event) => table.getColumn("product")?.setFilterValue(event.target.value)}
                className='max-w-sm'
              />
            </DashboardHeader>

            <div className='relative h-full'>
              <Table className='bg-black'>
                <TableHeader className='bg-black'>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        return (
                          <TableHead key={header.id}>
                            {header.isPlaceholder
                              ? null
                              : flexRender(header.column.columnDef.header, header.getContext())}
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={table.getAllColumns().length}>
                        <div className='flex flex-col items-center justify-center w-full h-[200px] gap-4'>
                          <Image src={empty} alt='empty' width={100} height={100} className='w-[100px] h-auto' />
                          <p className='text-[#666666] text-center'>No data yet</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </TableBody>
                <div className='absolute w-full bottom-0 flex items-center justify-end space-x-2 py-4'>
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => table.previousPage()}
                          isActive={table.getCanPreviousPage()}
                        />
                      </PaginationItem>

                      <PaginationItem>
                        <div className='flex w-[100px] items-center justify-center text-sm font-medium'>
                          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
                        </div>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => table.getCanNextPage() && table.nextPage()}
                          isActive={table.getCanNextPage()}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </Table>
            </div>
          </div>
        </div>
      </div>
    </ContainerDashboard>
  );
};

export default ManageInvestment;
