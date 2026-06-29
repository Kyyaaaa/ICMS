import axiosClient from "../../../shared/services/axiosClient";
import { formatDate } from "../../../shared/utils/date";
import type { TutorChangeRequest, CreateChangeRequestData } from "../types/change-request";

export const ChangeRequestService = {
    getRequests: async (): Promise<TutorChangeRequest[]> => {
        try {
            const response = await axiosClient.get("/change-requests/my-requests");
            const data = Array.isArray((response as {data?: unknown[]})?.data) ? (response as {data?: unknown[]}).data : (Array.isArray(response) ? response : []);
            return ((data as any[]) || []).map((req: any) => ({
                id: String(req.id),
                className: req.class ? `${req.class.course?.title || "Unknown Course"} - ${req.class.name || "Unknown Class"}` : "Unknown Class",
                session: req.session?.session_number || 1,
                type: req.type,
                originalTime: req.original_time,
                proposedTime: req.proposed_time,
                reason: req.reason,
                status: req.status as "Pending" | "Approved" | "Rejected" | "Cancelled",
                submittedAt: formatDate(req.created_at),
                staffNote: req.staff_note || "",
                finalTime: req.final_time || ""
            }));
        } catch (error) {
            console.error("Failed to fetch tutor change requests:", error);
            return [];
        }
    },
    createRequest: async (data: CreateChangeRequestData): Promise<TutorChangeRequest> => {
        try {
            const response = await axiosClient.post("/change-requests", {
                tutor_id: data.tutor_id,
                class_id: data.class_id,
                session_id: data.session_id,
                type: data.type,
                original_time: data.originalTime,
                proposed_time: data.proposedTime,
                reason: data.reason
            });
            const req = (response as {data?: unknown})?.data as Record<string, unknown> || (response as unknown as Record<string, unknown>);
            return {
                id: String(req.id),
                className: data.className,
                session: data.session,
                type: String(req.type || data.type),
                originalTime: String(req.original_time || "TBD"),
                proposedTime: String(req.proposed_time || data.proposedTime),
                reason: String(req.reason || data.reason),
                status: (req.status || "Pending") as "Pending" | "Approved" | "Rejected" | "Cancelled",
                submittedAt: formatDate(req.created_at ? String(req.created_at) : new Date().toISOString()),
                staffNote: req.staff_note ? String(req.staff_note) : "",
                finalTime: req.final_time ? String(req.final_time) : "",
            };
        } catch (error) {
            console.error("Failed to create change request:", error);
            throw error;
        }
    },
    cancelRequest: async (id: string): Promise<void> => {
        try {
            await axiosClient.patch(`/change-requests/${id}/status`, {
                status: "Cancelled"
            });
        } catch (error) {
            console.error("Failed to cancel change request:", error);
            throw error;
        }
    }
};
