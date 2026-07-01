"use client";

import Link from "next/link";
import { ColumnDef } from "@tanstack/react-table";
import type { QuoteStatus } from "@prisma/client";
import { formatMoney, formatDate } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { RowActions } from "@/components/row-actions";

export type QuoteRow = {
  id: string;
  number: string;
  companyName: string;
  status: QuoteStatus;
  total: number;
  issueDate: Date;
  expiryDate: Date | null;
};

export const columns: ColumnDef<QuoteRow>[] = [
  {
    accessorKey: "number",
    header: "Number",
    cell: ({ row }) => (
      <Link
        href={`/quotes/${row.original.id}`}
        className="font-medium text-primary underline-offset-4 hover:underline"
      >
        {row.original.number}
      </Link>
    ),
  },
  {
    accessorKey: "companyName",
    header: "Company",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "total",
    header: "Total",
    cell: ({ row }) => formatMoney(row.original.total),
  },
  {
    accessorKey: "issueDate",
    header: "Issued",
    cell: ({ row }) => formatDate(row.original.issueDate),
  },
  {
    accessorKey: "expiryDate",
    header: "Expires",
    cell: ({ row }) => formatDate(row.original.expiryDate),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <RowActions
        actions={[
          {
            label: "Download PDF",
            onSelect: () =>
              window.open(`/api/quotes/${row.original.id}/pdf`, "_blank"),
          },
        ]}
      />
    ),
  },
];
