import cron from "node-cron";
import { payrollService } from "../payroll.service";

export const initPayrollCron = () => {
  // Run at 23:55 every day, but only execute if it's the last day of the month
  cron.schedule("55 23 * * *", async () => {
    try {
      // Check if tomorrow is the 1st of the month
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (tomorrow.getDate() !== 1) {
        return; // Not the last day of the month, skip
      }

      console.log(
        "[Cron Job] Running automatic payroll generation for the current month...",
      );

      // Get the current month in YYYY-MM format
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const targetMonth = `${year}-${month}`;

      console.log(`[Cron Job] Target month to generate: ${targetMonth}`);

      const result = await payrollService.generatePayroll({
        month: targetMonth,
      });
      console.log(`[Cron Job] Auto payroll generation success:`, result);
    } catch (error) {
      console.error("[Cron Job] Error running auto payroll generation:", error);
    }
  });

  console.log(
    "[Cron Job] Initialized automatic monthly payroll generation job.",
  );
};
