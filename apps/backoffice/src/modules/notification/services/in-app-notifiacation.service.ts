import { config } from 'apps/backoffice/src/config';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IInAppNotification } from 'interface-models/notification/in-app-notification.interface';
import { InAppNotification } from 'entities/notification/in-app-notification.entity';
import { In, QueryFailedError, Repository } from 'typeorm';
import { IUser } from 'interface-models/iam/user.interface';
import { CacheClear } from 'apps/backoffice/src/infrastructure/cache/decorators/cache-clear.decorator';

@Injectable()
export class InAppNotificationService {
    constructor(
        @InjectRepository(InAppNotification)
        private readonly notificationRepository: Repository<InAppNotification>,
    ) {}

    async find(): Promise<IInAppNotification[]> {
        return await this.notificationRepository.find();
    }

    @CacheClear(config.cache.name.notification.list)
    async create(data: IInAppNotification): Promise<IInAppNotification> {
        const newAdmin = this.notificationRepository.create(data);
        return await this.notificationRepository.save(newAdmin);
    }

    @CacheClear(config.cache.name.notification.list)
    async bulkCreateByUserIds(
        userIds: number[],
        data: IInAppNotification,
    ): Promise<void> {
        const newDatas = userIds.map((userId) => {
            const newData = <IInAppNotification>{};
            Object.assign(newData, data);
            newData.targetUserId = userId;
            return newData;
        });

        await this.notificationRepository
            .createQueryBuilder()
            .insert()
            .into(InAppNotification)
            .values(newDatas)
            .execute();
    }

    @CacheClear(config.cache.name.notification.list)
    async update(
        id: number,
        data: IInAppNotification,
    ): Promise<IInAppNotification> {
        const status = await this.notificationRepository.update(
            { id },
            { ...data },
        );
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }

        return data;
    }

    @CacheClear(config.cache.name.notification.list)
    async updateByUser(
        userId: number,
        data: IInAppNotification,
    ): Promise<IInAppNotification> {
        const status = await this.notificationRepository.update(
            { targetUser: { id: userId } },
            { ...data },
        );
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }

        return data;
    }

    @CacheClear(config.cache.name.notification.list)
    async updateByUserAndIds(
        userId: number,
        ids: number[],
        data: IInAppNotification,
    ): Promise<IInAppNotification> {
        const status = await this.notificationRepository.update(
            { id: In(ids), targetUser: { id: userId } },
            { ...data },
        );
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }

        return data;
    }

    @CacheClear(config.cache.name.notification.list)
    async delete(id: number): Promise<void> {
        const status = await this.notificationRepository.delete({ id });
        if (status.affected < 1) {
            throw new QueryFailedError('Error, Data not changed', null, null);
        }
    }

    async findOneById(id: number): Promise<IInAppNotification> {
        return await this.notificationRepository.findOneOrFail({
            where: { id },
        });
    }

    async findOneByUserAndId(
        userId: number,
        id: number,
    ): Promise<IInAppNotification> {
        return await this.notificationRepository.findOneOrFail({
            where: { id, targetUser: { id: userId } },
        });
    }

    async findOneByIds(ids: number[]): Promise<IInAppNotification[]> {
        return await this.notificationRepository.find({
            where: { id: In(ids) },
        });
    }

    async countUnread(user: IUser): Promise<number> {
        return await this.notificationRepository
            .createQueryBuilder('notification')
            .leftJoinAndSelect('notification.targetUser', 'targetUser')
            .andWhere('targetUser.id = :userId', { userId: user.id })
            .andWhere('notification.isRead = :isRead', { isRead: false })
            .getCount();
    }

    @CacheClear(config.cache.name.notification.list)
    async markRead(id: number): Promise<void> {
        await this.notificationRepository.update({ id }, { isRead: true });
    }
}
