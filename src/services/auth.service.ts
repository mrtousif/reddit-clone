import type { FastifyPluginAsync } from "fastify";
// import fastifyAuth from "fastify-auth";
import fp from "fastify-plugin";
import fastifyKeycloak from "fastify-keycloak";
// import UrlJoin from "url-join";
// import config from "config";

const authPlugin: FastifyPluginAsync = async (app, _opts) => {
    // app.register(fastifyAuth);
    app.decorateRequest("user", null);
    const store = app.createSecureSession({});

    app.register(fastifyKeycloak, {
        options: { store },
        middleware: { logout: "/leave" },
    });
};

export default fp(authPlugin, { name: "authPlugin" });
