import { Options } from "@mikro-orm/core";
// import { TsMorphMetadataProvider } from "@mikro-orm/reflection";
import config from "@/config";

export const ormConfig: Options = {
    // metadataProvider: TsMorphMetadataProvider,
    entities: ["dist/**/*.entity.js"],
    entitiesTs: ["src/**/*.entity.ts"],
    user: config.postgres.user,
    password: config.postgres.password,
    dbName: config.postgres.dbName,
    host: config.postgres.host,
    port: config.postgres.port,
    type: "postgresql",
    debug: config.env.isDev,
    tsNode: Boolean(process.env.NODE_DEV),
    migrations: {
        path: "./src/migrations",
        tableName: "migrations",
        transactional: true,
    },
};

export default ormConfig;
