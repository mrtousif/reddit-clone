import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import Application from "application";
import supertest, { SuperTest, Test } from "supertest";
import { clearDatabase } from "utils/services/clearDatabase.service";
import { loadFixtures } from "utils/services/loadFixtures.service";

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager<IDatabaseDriver<Connection>>;

describe("Sample tests", async () => {
    beforeAll(async () => {
        application = new Application();
        await application.init();

        em = application.orm.em.fork();

        request = supertest(application.instance);
    });

    afterAll(async () => {
        application.server.close();
    });

    it("should clear database and load fixtures", async () => {
        await clearDatabase(application.orm);
        await loadFixtures(application.orm);
        console.log("🚀 Database cleared, fixtures loaded");
    });
});
