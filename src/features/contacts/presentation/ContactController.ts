import { Request, Response, NextFunction } from 'express';
import { ContactUseCases } from '../application/ContactUseCases';
import { AuthRequest } from '../../../shared/middlewares/authenticateToken';

export class ContactController {
    constructor(private contactUseCases: ContactUseCases) {}

    getContacts = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            const page = parseInt(req.query.page as string) || 1;
            const limit = parseInt(req.query.limit as string) || 50;
            const result = await this.contactUseCases.findContacts(orgId, req.query.q as string | undefined, page, limit);
            res.json({ success: true, data: result.data, meta: result.meta });
        } catch (error) {
            next(error);
        }
    };

    getContactById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            const contact = await this.contactUseCases.findContactById(orgId, req.params.id);
            if (!contact) {
                res.status(404).json({ success: false, error: 'Contact not found' });
                return;
            }
            res.json({ success: true, data: contact });
        } catch (error) {
            next(error);
        }
    };

    createContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            const contact = await this.contactUseCases.createContact(orgId, req.body);
            res.status(201).json({ success: true, data: contact });
        } catch (error) {
            next(error);
        }
    };

    updateContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            const contact = await this.contactUseCases.updateContact(orgId, req.params.id, req.body);
            res.json({ success: true, data: contact });
        } catch (error) {
            next(error);
        }
    };

    deleteContact = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            await this.contactUseCases.deleteContact(orgId, req.params.id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };

    enrichContact = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { organizationId: orgId } = (req as AuthRequest).user;
            const result = await this.contactUseCases.enrichContact(orgId, req.params.id);
            res.json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };
}
