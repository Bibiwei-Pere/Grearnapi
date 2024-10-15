import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical } from "lucide-react";
import { Support } from "./Types";
import { AlertDialog, AlertDialogContent, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import { formatDate, formatDateShort, shortenText } from "@/hooks/auth";
import { DeleteTicket, NewTicket } from "../dashboard/Tickets";
import { DeleteUser, NewUser } from "../dashboard/User";
import { DeleteInvestment, NewInvestment } from "../dashboard/Investment";

export const SupportCol: ColumnDef<Support>[] = [
  {
    accessorKey: "_id",
    header: "Ticket ID",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "subject",
    header: "Subject",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("subject")}</div>,
  },
  {
    accessorKey: "status",
    header: "Payment Status",
    cell: ({ row }) => (
      <div>
        {row.getValue("status") === "Resolved" ? (
          <div className='py-1 px-2 bg-green-100 text-center max-w-[75px] text-green-700 rounded-md font-medium'>
            Resolved
          </div>
        ) : (
          <div className='py-1 px-2 text-red-700 rounded-md bg-red-100 text-center max-w-[50px] font-medium'>Open</div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => <div className='tableText'>{formatDateShort(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState(false);
      const [isDeleteOpen, setDeleteOpen] = useState(false);

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuSeparator />

              <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit Ticket</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} style={{ color: "red", fontWeight: "500" }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isEditOpen} onOpenChange={setEditOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <NewTicket edit='edit' data={row.original} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <DeleteTicket data={row.original} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const ManageUsersCol: ColumnDef<any>[] = [
  {
    accessorKey: "_id",
    header: "User ID",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("email")}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("role") || "User"}</div>,
  },
  {
    accessorKey: "activeInvestment",
    header: "Enrolled Investment",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("activeInvestment") || 0}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    cell: ({ row }) => <div className='font-medium tableText'>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div>
        {row.getValue("isActive") ? (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[90px] bg-green-700 font-medium'>
            Active
          </div>
        ) : (
          <div className='py-1 px-2  text-white rounded-full bg-red-700 text-center max-w-[85px] font-medium'>
            Inactive
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState(false);
      const [isDeleteOpen, setDeleteOpen] = useState(false);

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit User</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} style={{ color: "red", fontWeight: "500" }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isEditOpen} onOpenChange={setEditOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <NewUser edit='edit' data={row.original} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <DeleteUser data={row.original} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const ManageInvestmentCol: ColumnDef<any>[] = [
  {
    accessorKey: "product",
    header: "Product",
    cell: ({ row }) => <div className='font-medium tableText'>{shortenText(row.getValue("product"), 10)}</div>,
  },
  {
    accessorKey: "geo_location",
    header: "Geo_location",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("geo_location")}</div>,
  },
  {
    accessorKey: "minimum_invest",
    header: "Minimum_invest",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("minimum_invest")}</div>,
  },
  {
    accessorKey: "roi",
    header: "Roi",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("roi")}</div>,
  },
  {
    accessorKey: "gain",
    header: "Gain",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("gain")}</div>,
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("duration")}</div>,
  },
  {
    accessorKey: "createdAt",
    header: "Registration Date",
    cell: ({ row }) => <div className='font-medium tableText'>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <div>
        {row.getValue("isActive") ? (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[90px] bg-green-700 font-medium'>
            Published
          </div>
        ) : (
          <div className='py-1 px-2  text-white rounded-full bg-red-700 text-center max-w-[85px] font-medium'>
            Archived
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      const [isEditOpen, setEditOpen] = useState(false);
      const [isDeleteOpen, setDeleteOpen] = useState(false);

      return (
        <div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <MoreVertical className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setEditOpen(true)}>Edit Investment</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setDeleteOpen(true)} style={{ color: "red", fontWeight: "500" }}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <AlertDialog open={isEditOpen} onOpenChange={setEditOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <NewInvestment edit='edit' data={row.original} />
            </AlertDialogContent>
          </AlertDialog>

          <AlertDialog open={isDeleteOpen} onOpenChange={setDeleteOpen}>
            <AlertDialogContent className='left-[50%] top-[50%]'>
              <DeleteInvestment data={row.original} />
            </AlertDialogContent>
          </AlertDialog>
        </div>
      );
    },
  },
];

export const ManageAffiliateCol: ColumnDef<Support>[] = [
  {
    accessorKey: "_id",
    header: "Transaction ID",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("_id")}</div>,
  },
  {
    accessorKey: "username",
    header: "Username",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("username") || "User"}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("email")}</div>,
  },

  {
    accessorKey: "createdAt",
    header: "Request Date",
    cell: ({ row }) => <div className='font-medium tableText'>{formatDate(row.getValue("createdAt"))}</div>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className='font-medium tableText'>{row.getValue("role") || "User"}</div>,
  },
  {
    accessorKey: "amount",
    header: "Amount requested",
    cell: ({ row }) => <div className='font-medium tableText'>₦{row.getValue("amount") || 0}</div>,
  },
  {
    accessorKey: "affiliateStatus",
    header: "Status",
    cell: ({ row }) => (
      <div>
        {row.getValue("affiliateStatus") === "Approved" ? (
          <div className='py-1 px-2 text-center text-white rounded-full max-w-[90px] bg-green-700 font-medium'>
            {row.getValue("affiliateStatus")}
          </div>
        ) : row.getValue("affiliateStatus") === "Rejected" ? (
          <div className='py-1 px-2  text-white rounded-full bg-red-700 text-center max-w-[85px] font-medium'>
            {row.getValue("affiliateStatus")}
          </div>
        ) : (
          <div className='py-1 px-2  text-white rounded-full bg-red-700 text-center max-w-[85px] font-medium'>
            {row.getValue("affiliateStatus")}
          </div>
        )}
      </div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    cell: ({ row }) => {
      return (
        <AlertDialog>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuSeparator />
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem>Edit Category</DropdownMenuItem>
                </AlertDialogTrigger>
                <DropdownMenuItem style={{ color: "red", fontWeight: "500" }}>Delete</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <AlertDialogContent className='left-[50%] top-[50%]'>
            {/* Implement your form logic here */}
          </AlertDialogContent>
        </AlertDialog>
      );
    },
  },
];
