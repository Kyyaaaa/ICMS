import cron from "node-cron";
import { supabaseAdmin } from "../../../configs/supabase";

/**
 * Locks the availability cycles for the next month.
 * It finds any cycles that are 'OPEN' and belong to the upcoming month,
 * and sets their status to 'SCHEDULING'.
 */
const lockNextMonthCycles = async (reason: string) => {
  try {
    const now = new Date();
    // Next month calculation
    const nextMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    const targetMonthStr = String(nextMonthDate.getMonth() + 1).padStart(2, '0');
    const targetCycleName = `${targetMonthStr}/${nextMonthDate.getFullYear()}`;

    console.log(
      `[Cron Job] ${reason}: Checking to lock cycle '${targetCycleName}'`,
    );

    const { data, error } = await supabaseAdmin
      .from("availability_cycles")
      .update({ status: "SCHEDULING" })
      .eq("name", targetCycleName)
      .eq("status", "OPEN")
      .select();

    if (error) {
      console.error(`[Cron Job] Error locking cycle:`, error);
      return;
    }

    if (data && data.length > 0) {
      console.log(
        `[Cron Job] Successfully locked cycle '${targetCycleName}' to SCHEDULING.`,
      );
    } else {
      console.log(
        `[Cron Job] No OPEN cycle found with name '${targetCycleName}' to lock.`,
      );
    }
  } catch (error) {
    console.error(`[Cron Job] Unexpected error during cycle locking:`, error);
  }
};

/**
 * Transitions cycles when moving to a new month.
 * - Sets the previous month to 'COMPLETED'
 * - Sets the current month to 'ACTIVE'
 */
const transitionCycleOnNewMonth = async () => {
  try {
    const now = new Date();
    // 1. Set current month to ACTIVE
    const currentMonthStr = String(now.getMonth() + 1).padStart(2, '0');
    const currentMonthName = `${currentMonthStr}/${now.getFullYear()}`;
    await supabaseAdmin
      .from("availability_cycles")
      .update({ status: "ACTIVE" })
      .eq("name", currentMonthName)
      .not("status", "eq", "ACTIVE"); // only update if not already ACTIVE

    console.log(
      `[Cron Job] Month transitioned: Set '${currentMonthName}' to ACTIVE.`,
    );

    // 2. Set previous month to COMPLETED
    const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevMonthStr = String(prevMonthDate.getMonth() + 1).padStart(2, '0');
    const prevMonthName = `${prevMonthStr}/${prevMonthDate.getFullYear()}`;
    await supabaseAdmin
      .from("availability_cycles")
      .update({ status: "COMPLETED" })
      .eq("name", prevMonthName)
      .not("status", "eq", "COMPLETED"); // only update if not already COMPLETED

    console.log(
      `[Cron Job] Month transitioned: Set '${prevMonthName}' to COMPLETED.`,
    );
  } catch (error) {
    console.error(
      `[Cron Job] Unexpected error during month transition:`,
      error,
    );
  }
};

export const initCycleLockingCron = () => {
  // Cron schedule: 23:59 on the 25th of every month
  cron.schedule("59 23 25 * *", () => {
    lockNextMonthCycles("Initial Lock (25th)");
  }, { timezone: "Asia/Ho_Chi_Minh" });

  // Cron schedule: 23:59 on the 27th of every month (Final lock in case it was reopened)
  cron.schedule("59 23 27 * *", () => {
    lockNextMonthCycles("Final Lock (27th)");
  }, { timezone: "Asia/Ho_Chi_Minh" });

  // Cron schedule: 00:00 on the 1st of every month (Transition to new month)
  cron.schedule("0 0 1 * *", () => {
    transitionCycleOnNewMonth();
  }, { timezone: "Asia/Ho_Chi_Minh" });

  console.log("[Cron Job] Cycle locking jobs initialized.");
};
