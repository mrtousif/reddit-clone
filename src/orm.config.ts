import { Options } from "@mikro-orm/core";
// import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import config from "./config";

export const ormConfig: Options = {
    // metadataProvider: TsMorphMetadataProvider,
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    user: config.mongo.user,
    password: config.mongo.password,
    dbName: config.mongo.dbName,
    host: config.mongo.host,
    port: config.mongo.port,
    type: "mongo",
    debug: config.env.isDev,
    tsNode: Boolean(process.env.NODE_DEV),
    // namingStrategy: EntityCaseNamingStrategy,
    // migrations: {
    //     path: "./src/migrations",
    //     tableName: "migrations",
    //     transactional: true,
    // },
};

export default ormConfig;
