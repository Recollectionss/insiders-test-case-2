import postgresConfig from '../../config/postgres.config';
import appConfig from '../../config/app.config';
import { ConfigType } from '@nestjs/config';
import { ENV, NODE_ENV } from '../../constants/env.constants';
import { Sequelize } from 'sequelize-typescript';
import { User } from '../user/entities/user.entity';
import { Event } from '../event/entities/event.entity';
import { Participant } from '../participants/entity/participants.entity';

export const postgresProviders = [
  {
    provide: 'SEQUELIZE',
    inject: [postgresConfig.KEY, appConfig.KEY],
    useFactory: async (
      postgresConf: ConfigType<typeof postgresConfig>,
      appConf: ConfigType<typeof appConfig>,
    ) => {
      const creeds = postgresConf[appConf.node_env as ENV];
      if (!creeds) {
        throw new Error(`No DB credentials found for env: ${appConf.node_env}`);
      }

      const sequelize = new Sequelize({
        logging: console.log,
        dialect: 'postgres',
        host: postgresConf.host,
        port: postgresConf.port,
        database: postgresConf.db,
        username: postgresConf.user,
        password: postgresConf.pass,
        define: { schema: creeds.schema },
      });

      sequelize.addModels([User, Event, Participant]);

      if (appConf.node_env === NODE_ENV.Testing) {
        await sequelize.sync({ force: true });
      }

      return sequelize;
    },
  },
];
