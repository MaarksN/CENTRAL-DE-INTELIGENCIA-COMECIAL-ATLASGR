import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function initDb() {
    try {
        let atlasOrg = await prisma.organization.findUnique({
            where: { name: 'Atlas GR' }
        });

        if (!atlasOrg) {
            atlasOrg = await prisma.organization.create({
                data: {
                    name: 'Atlas GR'
                }
            });
            console.log('Created default organization: Atlas GR');
        } else {
            console.log('Default organization Atlas GR already exists');
        }
    } catch (error) {
        console.error('Error initializing database:', error);
    }
}

export default prisma;
