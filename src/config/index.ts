import { cleanEnv, str, email, port, url } from "envalid";

const env = cleanEnv(process.env, {
    NODE_ENV: str({
        choices: ["development", "test", "production", "staging"],
    }),
    API_PORT: port({ default: 6000 }),
    VAULT_ADDR: url({ default: "http://127.0.0.1:8200" }),
    DOMAIN: url({ default: "http://localhost" }),
    BASE_URL: url({ default: "http://localhost:3000" }),
    ADMIN_EMAIL: email({ default: "admin@example.com" }),
    POSTGRES_USER: str({ default: "postgres" }),
    POSTGRES_PASSWORD: str({ default: "postgres" }),
    POSTGRES_HOST: str({ default: "localhost" }),
    POSTGRES_PORT: port({ default: 5432 }),
    POSTGRES_DB: str({ default: "test_db" }),
    REDIS_HOST: str({ default: "redis://127.0.0.1" }),
    TOKEN_SECRET: str({ default: "definitely_not_a_secret_string" }),
});

export default {
    env,
    baseUrl: env.BASE_URL,
    api: {
        domain: env.DOMAIN,
        port: env.API_PORT,
    },
    postgres: {
        user: env.POSTGRES_USER,
        password: env.POSTGRES_PASSWORD,
        host: env.POSTGRES_HOST,
        port: env.POSTGRES_PORT,
        dbName: env.POSTGRES_DB,
    },
    keycloak: {
        public: "https://localhost:6000",
        admin: "https://localhost:8080"
    },
};
