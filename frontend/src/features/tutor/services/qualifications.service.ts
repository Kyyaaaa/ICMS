import type { Qualification } from '../types/qualification';

const MOCK_QUALIFICATIONS: Qualification[] = [
    { id: 1, name: "IELTS Academic 8.0", issuer: "British Council", expDate: "2026-08-15", status: "Verified", file: "ielts_certificate.jpg" },
    { id: 2, name: "TESOL Certification", issuer: "Global TEFL", expDate: "No Expiration", status: "Verified", file: "tesol_cert.png" },
    { id: 3, name: "Master of Education (M.Ed)", issuer: "University of Oxford", expDate: "No Expiration", status: "Verified", file: "med_degree.pdf" },
    { id: 4, name: "TKT Module 1-3", issuer: "Cambridge Assessment", expDate: "2029-01-20", status: "Pending Verification", file: "tkt_cert.jpg" },
];

export const QualificationsService = {
    getMyQualifications: async (): Promise<Qualification[]> => {
        return new Promise((resolve) => setTimeout(() => resolve(MOCK_QUALIFICATIONS), 300));
    }
};
