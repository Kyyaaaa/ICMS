import cron from "node-cron";
import { payrollService } from "../payroll.service";

export const initPayrollCron = () => {
  // Run at 23:55 every day, but only execute if it's the last day of the month
  cron.schedule("55 23 * * *", async () => {
    try {
      // Get current date in Vietnam timezone
      const vnTimeStr = new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" });
      const vnDate = new Date(vnTimeStr);
      
      // Check if tomorrow is the 1st of the month
      const tomorrow = new Date(vnDate);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      if (tomorrow.getDate() !== 1) {
        return; // Not the last day of the month, skip
      }

      

      // Get the current month in YYYY-MM format
      const year = vnDate.getFullYear();
      const month = String(vnDate.getMonth() + 1).padStart(2, "0");
      const targetMonth = `${year}-${month}`;

      

      const result = await payrollService.generatePayroll({
        month: targetMonth,
      });
      
    } catch (error) {
      console.error("[Cron Job] Error running auto payroll generation:", error);
    }
  }, {
    timezone: "Asia/Ho_Chi_Minh"
  });

  
};
