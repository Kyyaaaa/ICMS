import { ProfileView } from '@/shared/components/profile/ProfileView';

const StaffProfile = () => {
    return (
        <ProfileView 
            title="My Profile" 
            description="Manage your staff account settings and security preferences."
            emailHint="Staff email address cannot be changed."
        />
    );
};

export default StaffProfile;
