"use client";

import { ColumnDef } from "@tanstack/react-table";
import type { ProductType } from "@prisma/client";
import { formatMoney } from "@/lib/format";
import { StatusBadge } from "@/components/status-badge";
import { RowActions } from "@/components/row-actions";
import { ProductForm } from "./forms";

export type ProductRow = {
  id: string;
  name: string;
  sku: string | null;
  type: ProductType;
  unitPrice: number;
  description: string | null;
};

export const columns: ColumnDef<ProductRow>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "sku",
    header: "SKU",
    cell: ({ row }) => row.original.sku ?? "—",
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <StatusBadge status={row.original.type} />,
  },
  {
    accessorKey: "unitPrice",
    header: "Unit Price",
    cell: ({ row }) => formatMoney(row.original.unitPrice),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <RowActions editTitle="Edit Product" editForm={
        <ProductForm
          record={{
            id: row.original.id,
            name: row.original.name,
            sku: row.original.sku,
            type: row.original.type,
            unitPrice: row.original.unitPrice,
            description: row.original.description,
          }}
        />
      } />
    ),
  },
];
