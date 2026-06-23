import { ProfileView } from '@/shared/components/profile/ProfileView';

const TutorProfile = () => {
    return (
        <ProfileView 
            title="My Profile" 
            description="Manage your tutor account settings and security preferences."
            emailHint="Tutor email address cannot be changed."
        />
    );
};

export default TutorProfile;
