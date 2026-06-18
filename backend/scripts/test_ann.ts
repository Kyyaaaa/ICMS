import { AnnouncementRepository } from '../src/modules/announcement/announcement.repository';
import * as dotenv from 'dotenv';
dotenv.config();

async function run() {
    console.log('Admin notifs:');
    const adminAnns = await AnnouncementRepository.getNotificationsByRole('Admin');
    console.log(adminAnns.map(a => ({ title: a.title, scope: a.scope, roles: a.roles })));
    
    console.log('Staff notifs:');
    const staffAnns = await AnnouncementRepository.getNotificationsByRole('Staff');
    console.log(staffAnns.map(a => ({ title: a.title, scope: a.scope, roles: a.roles })));
}

run().catch(console.error);
