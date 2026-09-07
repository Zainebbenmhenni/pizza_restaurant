import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type IncomingLine = {
  productId: string;
  sizeId?: string;
  quantity: number;
  unitPrice: number;
};

export async function POST(req: NextRequest) {
  const body = await req.json();

  const {
    deliveryMode,
    customerName,
    customerPhone,
    customerEmail,
    address,
    city,
    postalCode,
    notes,
    lines
  }: {
    deliveryMode: "LIVRAISON" | "A_EMPORTER";
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    address?: string;
    city?: string;
    postalCode?: string;
    notes?: string;
    lines: IncomingLine[];
  } = body;

  if (!customerName || !customerPhone || !customerEmail || !lines?.length) {
    return NextResponse.json({ error: "Champs obligatoires manquants." }, { status: 400 });
  }

  if (deliveryMode === "LIVRAISON" && (!address || !city || !postalCode)) {
    return NextResponse.json(
      { error: "Adresse complète requise pour la livraison." },
      { status: 400 }
    );
  }

  const totalPrice = lines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);

  const order = await prisma.order.create({
    data: {
      deliveryMode,
      customerName,
      customerPhone,
      customerEmail,
      address,
      city,
      postalCode,
      notes,
      totalPrice,
      items: {
        create: lines.map((l) => ({
          productId: l.productId,
          sizeId: l.sizeId,
          quantity: l.quantity,
          unitPrice: l.unitPrice
        }))
      }
    }
  });

  return NextResponse.json({ orderId: order.id });
}
