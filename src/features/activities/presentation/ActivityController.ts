import { Request, Response, NextFunction } from 'express';
import { ActivityUseCases } from '../application/ActivityUseCases';
import { AuthRequest } from '../../../shared/middlewares/authenticateToken';

export class ActivityController {
    constructor(private activityUseCases: ActivityUseCases) {}

    getActivities = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            const activities = await this.activityUseCases.findActivities(orgId, req.query.date as string | undefined);
            res.json({ success: true, data: activities });
        } catch (error) {
            next(error);
        }
    };

    createActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            const activity = await this.activityUseCases.createActivity(orgId, req.body);
            res.status(201).json({ success: true, data: activity });
        } catch (error) {
            next(error);
        }
    };

    updateActivity = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            const activity = await this.activityUseCases.updateActivity(orgId, req.params.id, req.body);
            res.json({ success: true, data: activity });
        } catch (error) {
            next(error);
        }
    };

    deleteActivity = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            await this.activityUseCases.deleteActivity(orgId, req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}
