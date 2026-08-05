import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db/connect";
import { CustomerProfile } from "@/models/customer-profile";
import { getCustomerMonthlyCalendar } from "@/lib/data-service";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ customerCode: string }> }
) {
  const { customerCode } = await params;
  const { searchParams } = new URL(request.url);
  const month = parseInt(searchParams.get("month") || String(new Date().getMonth() + 1));
  const year = parseInt(searchParams.get("year") || String(new Date().getFullYear()));

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const isAdmin = user.role === "ADMIN" || user.role === "SUPER_ADMIN";

  if (!isAdmin) {
    // Customers can only view their own calendar
    await connectToDatabase();
    const owned = await CustomerProfile.findOne({
      customerCode,
      userId: user.id,
    }).lean();
    if (!owned) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
  }

  const calendarData = await getCustomerMonthlyCalendar(customerCode, month, year);

  if (!calendarData) {
    return NextResponse.json({ error: "Calendar data not found" }, { status: 404 });
  }

  return NextResponse.json(calendarData);
}
