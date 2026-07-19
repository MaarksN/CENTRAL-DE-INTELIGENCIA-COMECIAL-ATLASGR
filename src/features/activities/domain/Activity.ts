import { Repository } from '../../../shared/domain/Repository';
import { ActivityType, ActivityStatus } from '../../../lib/zod';

export interface Activity {
    id: string;
    type: ActivityType;
    owner: string;
    date: Date;
    time: string | null;
    status: ActivityStatus;
    observations: string | null;
    leadId: string;
    organizationId: string | null;
    createdAt: Date;
    updatedAt: Date;
    lead?: any;
}

export interface ActivityRepository extends Repository<Activity> {
    findAllWithFilters(organizationId: string, dateStr?: string): Promise<Activity[]>;
    createWithTimeline(organizationId: string, data: any): Promise<Activity>;
    updateWithTimeline(organizationId: string, id: string, data: any): Promise<Activity>;
}
