import { ProfileView } from '@/shared/components/profile/ProfileView';

const LearnerProfile = () => {
    return (
        <ProfileView 
            title="My Profile" 
            description="Manage your personal information and account security."
            emailHint="Email address cannot be changed once registered."
        />
    );
};

export default LearnerProfile;
