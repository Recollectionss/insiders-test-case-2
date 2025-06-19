import { USER_REPOSITORY } from './user.constants';
import { User } from './entities/user.entity';

export const UserProviders = [{ provide: USER_REPOSITORY, useValue: User }];
