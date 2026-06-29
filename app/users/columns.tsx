"use client";

import { ColumnDef } from "@tanstack/react-table";
import { formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { RowActions } from "@/components/row-actions";
import { AuthUserForm } from "./forms";
import type { AuthUser } from "@/lib/auth/users";

export const columns: ColumnDef<AuthUser>[] = [
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <StatusBadge status={row.original.role.toUpperCase()} />,
  },
  {
    id: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.banned ? "INACTIVE" : "ACTIVE"} />,
  },
  {
    accessorKey: "createdAt",
    header: "Created",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <RowActions editTitle="Edit User" editForm={
        <AuthUserForm record={row.original} />
      } />
    ),
  },
];
