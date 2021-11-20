import type { FastifyPluginAsync } from "fastify";
// import fastifyAuth from "fastify-auth";
import fp from "fastify-plugin";
// import UrlJoin from "url-join";
// import config from "config";

const authPlugin: FastifyPluginAsync = async (app, _opts) => {
    // app.register(fastifyAuth);
    app.decorateRequest("user", null);
    const store = app.createSecureSession({});
};

export default fp(authPlugin, { name: "authPlugin" });
