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
// import { Check, Loader2, MoreVertical, XCircleIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Category } from "./Types";
import { useDeleteCategory } from "@/hooks/categories";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
// import { useForm } from "react-hook-form";
// import { z } from "zod";
// import { categorySchema } from "./Forms";
// import { zodResolver } from "@hookform/resolvers/zod";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
import React from "react";
// import { Input } from "@/components/ui/input";
// import { useToast } from "@/components/ui/use-toast";
// import { useRouter } from "next/navigation";
// import { AlertDialogCancel } from "@radix-ui/react-alert-dialog";

const ActionsCell = ({
  row,
}: {
  row: {
    original: {
      _id: string;
    };
  };
}) => {
  const { mutation: del } = useDeleteCategory();
  // const { mutation: edit } = useEditCategory();

  const handleDelete = () => {
    del.mutate({
      categoryId: row.original._id,
    });
  };

  // const onEditCategory = (values: { name: string; }) => {
  //   edit.mutate({
  //     categoryId: row.original._id,
  //     name: values.name,
  //   });
  // };

  return (
    <AlertDialog>
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuSeparator />
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>Edit Category</DropdownMenuItem>
            </AlertDialogTrigger>
            <DropdownMenuItem
              onClick={handleDelete}
              style={{ color: "red", fontWeight: "500" }}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <AlertDialogContent className="left-[50%] top-[50%]">
        {/* Implement your form logic here */}
      </AlertDialogContent>
    </AlertDialog>
  );
};

export const CategoriesCol: ColumnDef<Category>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        className="border border-gray-300"
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        className="border border-gray-300"
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <h6>{row.getValue("name")}</h6>,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <ActionsCell row={row} />,
  },
];

// export const CategoriesCol: ColumnDef<Category>[] = [
//   {
//     id: "select",
//     header: ({ table }) => (
//       <Checkbox
//         className="border border-gray-300"
//         checked={
//           table.getIsAllPageRowsSelected() ||
//           (table.getIsSomePageRowsSelected() && "indeterminate")
//         }
//         onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
//         aria-label="Select all"
//       />
//     ),
//     cell: ({ row }) => (
//       <Checkbox
//         className="border border-gray-300"
//         checked={row.getIsSelected()}
//         onCheckedChange={(value) => row.toggleSelected(!!value)}
//         aria-label="Select row"
//       />
//     ),
//     enableSorting: false,
//     enableHiding: false,
//   },
//   {
//     accessorKey: "name",
//     header: "Name",
//     cell: ({ row }) => <h6>{row.getValue("name")}</h6>,
//   },
//   {
//     id: "actions",
//     enableHiding: false,
//     cell: ({ row }) => {
//       // const navigation = useRouter();
//       const { mutation: del } = useDeleteCategory();
//       const handleDelete = () => {
//         del.mutate({
//           categoryId: row.original._id,
//         });
//       };

//       console.log(row.original);

//       // const form = useForm<z.infer<typeof categorySchema>>({
//       //   resolver: zodResolver(categorySchema),
//       // });

//       const { mutation: edit } = useEditCategory();
//       const onuseEditCategory = (values: z.infer<typeof categorySchema>) => {
//         edit.mutate({
//           categoryId: row.original._id,
//           name: values.name,
//         });
//       };
//       return (
//         <AlertDialog>
//           <div>
//             {
//               <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                   <Button variant="ghost" className="h-8 w-8 p-0">
//                     <span className="sr-only">Open menu</span>
//                     <MoreVertical className="h-4 w-4" />
//                   </Button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end">
//                   <DropdownMenuSeparator />

//                   <AlertDialogTrigger asChild>
//                     <DropdownMenuItem>Edit Category</DropdownMenuItem>
//                   </AlertDialogTrigger>

//                   <DropdownMenuItem
//                     onClick={handleDelete}
//                     style={{ color: "red", fontWeight: "500" }}
//                   >
//                     Delete
//                   </DropdownMenuItem>
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             }
//           </div>
//           <AlertDialogContent className="left-[50%] top-[50%]">
//             {/* <Form {...form}>
//               <form
//                 onSubmit={form.handleSubmit(onuseEditCategory)}
//                 className="flex flex-col gap-5 mt-4"
//               >
//                 <AlertDialogCancel>
//                   <XCircleIcon className="cursor-pointer h-5 w-5 text-black" />
//                 </AlertDialogCancel>
//                 <h1 className="text-black">Add new category</h1>
//                 <FormField
//                   control={form.control}
//                   name="name"
//                   render={({ field }) => (
//                     <FormItem>
//                       <FormLabel className="text-black">
//                         Category name
//                       </FormLabel>
//                       <Input
//                         type="text"
//                         className="bg-transparent border-gray-800 focus:border-black text-black"
//                         placeholder="Enter category name"
//                         {...field}
//                       />
//                       <FormMessage />
//                     </FormItem>
//                   )}
//                 />
//                 {edit.isSuccess ? (
//                   <Button className="w-full border-green-500 bg-green-500">
//                     <Check className="h-4 w-4" />
//                   </Button>
//                 ) : (
//                   <Button variant={"secondary"} className="w-full">
//                     {edit.isPending ? (
//                       <Loader2 className="h-4 w-4 animate-spin" />
//                     ) : (
//                       "Proceed"
//                     )}
//                   </Button>
//                 )}
//               </form>
//             </Form> */}
//           </AlertDialogContent>
//         </AlertDialog>
//       );
//     },
//   },
// ];
