import { cleanEnv, str, email } from 'envalid';

const env = cleanEnv(process.env, {
    // API_KEY: str(),
    ADMIN_EMAIL: email({ default: 'admin@example.com' }),
    NODE_ENV: str({ choices: ['development', 'test', 'production', 'staging'] }),
});

export default env;
