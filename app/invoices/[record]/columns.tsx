"use client";

import { useTransition } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { useRouter } from "next/navigation";

import { RowActions } from "@/components/row-actions";
import { formatMoney } from "@/lib/format";
import { deleteInvoiceLineItem } from "./actions";

export type LineItemRow = {
  id: string;
  description: string;
  productName: string | null;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

function LineItemRowActions({ id }: { id: string }) {
  const [, startTransition] = useTransition();
  const router = useRouter();

  return (
    <RowActions
      actions={[
        {
          label: "Delete",
          destructive: true,
          onSelect: () =>
            startTransition(async () => {
              await deleteInvoiceLineItem(id);
              router.refresh();
            }),
        },
      ]}
    />
  );
}

export const columns: ColumnDef<LineItemRow>[] = [
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "productName",
    header: "Product",
    cell: ({ row }) => row.original.productName ?? "—",
  },
  {
    accessorKey: "quantity",
    header: "Qty",
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => formatMoney(row.original.unitPrice),
  },
  {
    accessorKey: "lineTotal",
    header: "Total",
    cell: ({ row }) => formatMoney(row.original.lineTotal),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <LineItemRowActions id={row.original.id} />,
  },
];
