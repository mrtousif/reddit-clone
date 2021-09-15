import { Server } from "http";
import fs from "fs";
import path from "path";
import Fastify, { FastifyInstance } from "fastify";
// plugins
import mercurius from "mercurius";
import mercuriusUpload from "mercurius-upload";
import fastifySecureSession from "fastify-secure-session";
import prettifier from "@mgcrea/pino-pretty-compact";
import printRoutes from "fastify-print-routes";
import GracefulServer from "@gquittet/graceful-server";

import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { GraphQLSchema } from "graphql";
import { buildSchema, registerEnumType } from "type-graphql";

import { getContext } from "./utils/interfaces/context.interface";
import { PublisherType } from "./components/Publisher/publisherType.enum";
import config from "./config";
// import ormConfig from "./orm.config";
import databaseService from "./services/database.service";
import authService from "./services/auth.service";

// TODO: create service for this
registerEnumType(PublisherType, {
    name: "PublisherType",
    description: "Type of the publisher",
});

export default class Application {
    public instance: FastifyInstance;
    public orm!: MikroORM<IDatabaseDriver<Connection>>;
    public server!: Server;
    public gracefulServer: any;
    public app_domain: string = config.api.domain;
    public app_port: number = config.api.port;

    public constructor() {
        this.instance = Fastify({
            logger: { prettyPrint: config.env.isDev, prettifier },
            ignoreTrailingSlash: true,
        });
        this.instance.register(fastifySecureSession, {
            cookieName: "my-session-cookie",
            key: fs.readFileSync(path.resolve("secret-key")),
            cookie: {
                path: "/",
                httpOnly: config.env.isProd, // Use httpOnly for all production purposes
                // options for setCookie, see https://github.com/fastify/fastify-cookie
            },
        });

        this.instance.register(printRoutes);
        this.instance.register(authService);

        this.gracefulServer = GracefulServer(this.instance.server);
        this.makeApiGraceful();
        this.routes();
    }

    public async init() {
        await this.initializeGraphql();
        this.orm = await databaseService();
        // await this.connectDatabase();
        this.instance.listen(this.app_port, (error) => {
            if (error) {
                this.orm.close();
                this.instance.log.error(error);
                process.exit(1);
            }
            this.gracefulServer.setReady();
        });
    }

    private async initializeGraphql() {
        const schema: GraphQLSchema = await buildSchema({
            resolvers: [__dirname + "/**/*.resolver.{ts,js}"],
            dateScalarMode: "isoDate",
        });

        this.instance.register(mercurius, {
            schema,
            graphiql: true,
            ide: true,
            path: "/graphql",
            allowBatchedQueries: true,
            context: (request) => getContext(request, this.orm.em.fork()),
        });
        this.instance.register(mercuriusUpload, {
            maxFileSize: 1000000,
            maxFiles: 10,
        });
    }

    private routes() {
        this.instance.get("/", async (_request, _reply) => {
            return { message: "God speed" };
        });
    }

    private makeApiGraceful() {
        this.gracefulServer.on(GracefulServer.READY, () => {
            console.log(`Server is running on ${this.app_domain}:${this.app_port} 🌟👻`);
        });

        this.gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
            console.log("Server is shutting down");
        });

        this.gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
            console.log("Server is down because of", error.message);
        });
    }
}
