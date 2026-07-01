import { prisma } from "@/lib/prisma";
import { GST_RATE } from "@/lib/invoice-totals";

const round2 = (n: number) => Math.round(n * 100) / 100;

// Recomputes a quote's denormalised totals from its current line items.
export async function recalcQuoteTotals(quoteId: string) {
  const items = await prisma.quoteLineItem.findMany({
    where: { quoteId },
    select: { lineTotal: true, taxable: true },
  });

  let subtotal = 0;
  let taxAmount = 0;
  for (const item of items) {
    const lineTotal = Number(item.lineTotal);
    subtotal += lineTotal;
    if (item.taxable) {
      taxAmount += lineTotal * GST_RATE;
    }
  }

  subtotal = round2(subtotal);
  taxAmount = round2(taxAmount);

  await prisma.quote.update({
    where: { id: quoteId },
    data: { subtotal, taxAmount, total: round2(subtotal + taxAmount) },
  });
}
