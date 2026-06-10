import { ProfileView } from '@/shared/components/profile/ProfileView';

const AdminProfile = () => {
    return (
        <ProfileView 
            title="My Profile" 
            description="Manage your admin account settings and security preferences."
            emailHint="Admin email address cannot be changed."
        />
    );
};

export default AdminProfile;
