import { ITags } from 'interface-models/movie/tags.interface';
import { TagResponse } from '../responses/tag.response';

export class TagMapper {
    public static fromEntity = (tag: ITags): TagResponse => ({
        id: tag.id,
        name: tag.name,
        createdAt: tag.createdAt,
        updatedAt: tag.updatedAt,
    });
}
