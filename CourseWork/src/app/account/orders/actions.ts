"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { requireAuth } from "@/server/guards";
import { orderService } from "@/server/services";

function msgUrl(type: "paid" | "canceled" | "error", text?: string) {
  const p = new URLSearchParams();
  p.set("msg", type);
  if (text) p.set("text", text);
  return `/account/orders?${p.toString()}`;
}

export async function payOrderAction(formData: FormData) {
  const me = await requireAuth("/account/orders");
  const orderId = String(formData.get("orderId") || "");
  if (!orderId) redirect(msgUrl("error", "Некоректний запит"));

  const res = await orderService.payOrder({ orderId, userId: me.sub });
  if (!res.ok) redirect(msgUrl("error", res.error));

  revalidatePath("/account/orders");
  redirect(msgUrl("paid"));
}

export async function cancelOrderAction(formData: FormData) {
  const me = await requireAuth("/account/orders");
  const orderId = String(formData.get("orderId") || "");
  if (!orderId) redirect(msgUrl("error", "Некоректний запит"));

  const res = await orderService.cancelOrder({ orderId, userId: me.sub });
  if (!res.ok) redirect(msgUrl("error", res.error));

  revalidatePath("/account/orders");
  redirect(msgUrl("canceled"));
}
