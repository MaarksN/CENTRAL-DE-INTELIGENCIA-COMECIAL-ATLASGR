export interface Repository<T> {
    findById?(organizationId: string, id: string): Promise<T | null>;
    findAll?(organizationId: string, query?: string, page?: number, limit?: number): Promise<{ data: T[], meta: any }>;
    create?(organizationId: string, data: any): Promise<T>;
    update?(organizationId: string, id: string, data: any): Promise<T>;
    delete?(organizationId: string, id: string): Promise<any>;
}
