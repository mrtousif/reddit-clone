import { MikroORM } from "@mikro-orm/core";
import ormConfig from "../orm.config";
// import logger from "signale";

export const databaseService = async () => {
    const orm = await MikroORM.init(ormConfig);
    // const migrator = orm.getMigrator();
    // const migrations = await migrator.getPendingMigrations();
    // if (migrations && migrations.length > 0) {
    //     await migrator.up();
    // }
    return orm;
};

export default databaseService;
