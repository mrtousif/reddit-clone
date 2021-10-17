import { Server } from "http";
import fs from "fs";
import path from "path";
import Fastify, { FastifyInstance } from "fastify";
// plugins
import mercurius from "mercurius";
import mercuriusUpload from "mercurius-upload";
import fastifySecureSession from "fastify-secure-session";
import fastifyRedis from "fastify-redis";
import prettifier from "@mgcrea/pino-pretty-compact";
import printRoutes from "fastify-print-routes";
import GracefulServer from "@gquittet/graceful-server";
import metricsPlugin from "fastify-metrics";

import { Connection, IDatabaseDriver, MikroORM } from "@mikro-orm/core";
import { GraphQLSchema } from "graphql";
import { buildSchema, registerEnumType } from "type-graphql";
import nodeVault from "node-vault";

import { getContext } from "./utils/interfaces/context.interface";
import { PublisherType } from "./components/Publisher/publisherType.enum";
import config from "./config";
import connectDatabase from "./connectDatabase";
import authService from "@/services/auth.service";

// TODO: create service for this
registerEnumType(PublisherType, {
    name: "PublisherType",
    description: "Type of the publisher",
});

// get new instance of the client
const vault = nodeVault({
    apiVersion: "v1", // default
    endpoint: config.env.VAULT_ADDR,
    token: "1234", // optional client token; can be fetched after valid initialization of the server
});

// init vault server
vault
    .init({ secret_shares: 1, secret_threshold: 1 })
    .then((result) => {
        const keys = result.keys;
        // set token for all following requests
        vault.token = result.root_token;
        // unseal vault server
        return vault.unseal({ secret_shares: 1, key: keys[0] });
    })
    .catch(console.error);

export default class Application {
    public instance: FastifyInstance;
    public orm!: MikroORM<IDatabaseDriver<Connection>>;
    public server!: Server;
    public gracefulServer: any;
    public appDomain: string = config.api.domain;
    public appPort: number = config.api.port;

    public constructor() {
        this.instance = Fastify({
            logger: { prettyPrint: config.env.isDev, prettifier },
            ignoreTrailingSlash: true,
            trustProxy: ["127.0.0.1"],
        });

        this.instance.register(fastifyRedis, { url: config.env.REDIS_HOST });
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
        this.instance.register(metricsPlugin, { endpoint: "/metrics" });
        // this.instance.register(authService);

        this.gracefulServer = GracefulServer(this.instance.server);
        this.makeApiGraceful();
        this.routes();
    }

    public async init() {
        await this.initializeGraphql();
        this.orm = await connectDatabase();

        this.instance.listen(this.appPort, (error) => {
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
            resolvers: [`${__dirname}/**/*.resolver.{ts,js}`],
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
            this.instance.log.info(`Server is running on ${this.appDomain}:${this.appPort} 🌟👻`);
        });

        this.gracefulServer.on(GracefulServer.SHUTTING_DOWN, () => {
            this.instance.log.warn("Server is shutting down");
        });

        this.gracefulServer.on(GracefulServer.SHUTDOWN, (error) => {
            this.instance.log.error("Server is down because of", error.message);
        });
    }
}
