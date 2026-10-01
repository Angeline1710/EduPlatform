import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature." }, { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  switch (event.type) {
    case "checkout.session.completed": {
      const userId = session.metadata?.userId;
      const courseId = session.metadata?.courseId;
      if (!userId || !courseId) break;

      // Mark paid and grant access together, so access can never be granted
      // against a payment row that failed to settle.
      await prisma.$transaction([
        prisma.payment.updateMany({
          where: { stripeSessionId: session.id },
          data: { status: "PAID" },
        }),
        prisma.enrollment.upsert({
          where: { userId_courseId: { userId, courseId } },
          update: {},
          create: { userId, courseId },
        }),
      ]);
      break;
    }

    // An abandoned or failed session must not sit as PENDING forever —
    // it would inflate the pending figure on the admin dashboard.
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed": {
      await prisma.payment.updateMany({
        where: { stripeSessionId: session.id, status: "PENDING" },
        data: { status: "FAILED" },
      });
      break;
    }
  }

  return NextResponse.json({ received: true });
}
