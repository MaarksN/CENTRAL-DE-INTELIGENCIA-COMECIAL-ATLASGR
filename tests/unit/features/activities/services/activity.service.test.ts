import { describe, it, expect, vi, beforeEach } from 'vitest';
import { activityService } from '@/features/activities/services/activity.service';
import { prisma } from '@/lib/prisma';

vi.mock('@/lib/prisma', () => ({
  prisma: {
    activity: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    timelineEvent: {
      create: vi.fn(),
    }
  }
}));

describe('ActivityService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockActivity = {
    id: '1',
    type: 'Call',
    owner: 'John',
    date: new Date('2024-01-01T10:00:00Z'),
    status: 'Pendente',
    leadId: 'lead-1'
  };

  it('should find all activities without date', async () => {
    vi.mocked(prisma.activity.findMany).mockResolvedValue([mockActivity as never]);
    const result = await activityService.findAll();
    expect(prisma.activity.findMany).toHaveBeenCalledWith({
      where: {},
      include: { lead: { include: { company: true, contact: true } } },
      orderBy: { date: 'asc' }
    });
    expect(result).toEqual([mockActivity]);
  });

  it('should find all activities with date filter', async () => {
    vi.mocked(prisma.activity.findMany).mockResolvedValue([mockActivity as never]);
    const dateStr = '2024-01-01T10:00:00Z';
    const result = await activityService.findAll(dateStr);
    expect(prisma.activity.findMany).toHaveBeenCalledWith(expect.objectContaining({
      where: { date: expect.any(Object) }
    }));
    expect(result).toEqual([mockActivity]);
  });

  it('should create an activity and a timeline event', async () => {
    const input = { type: 'Call', owner: 'John', date: '2024-01-01T10:00:00Z', leadId: 'lead-1' };
    vi.mocked(prisma.activity.create).mockResolvedValue(mockActivity as never);
    const result = await activityService.create(input);
    expect(prisma.activity.create).toHaveBeenCalled();
    expect(prisma.timelineEvent.create).toHaveBeenCalled();
    expect(result).toEqual(mockActivity);
  });

  it('should update an activity', async () => {
    vi.mocked(prisma.activity.findUnique).mockResolvedValue(mockActivity as never);
    vi.mocked(prisma.activity.update).mockResolvedValue({ ...mockActivity, status: 'Concluído' } as never);
    
    const result = await activityService.update('1', { status: 'Concluído' });
    expect(prisma.activity.update).toHaveBeenCalled();
    expect(prisma.timelineEvent.create).toHaveBeenCalled();
    expect(result.status).toBe('Concluído');
  });

  it('should throw error when updating non-existent activity', async () => {
    vi.mocked(prisma.activity.findUnique).mockResolvedValue(null);
    await expect(activityService.update('1', { status: 'Concluído' })).rejects.toThrow('Activity not found');
  });

  it('should delete an activity', async () => {
    vi.mocked(prisma.activity.delete).mockResolvedValue(mockActivity as never);
    await activityService.delete('1');
    expect(prisma.activity.delete).toHaveBeenCalledWith({ where: { id: '1' } });
  });
});
