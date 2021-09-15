import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import supertest, { SuperTest, Test } from "supertest";
import createSimpleUuid from "utils/helpers/createSimpleUuid.helper";
import { clearDatabase } from "utils/services/clearDatabase.service";
import { loadFixtures } from "utils/services/loadFixtures.service";

import Application from "application";

let request: SuperTest<Test>;
let application: Application;
let em: EntityManager<IDatabaseDriver<Connection>>;

describe("User tests", async () => {
    beforeAll(async () => {
        application = new Application();
        await application.init();

        em = application.orm.em.fork();

        request = supertest(application.instance);
    });

    beforeEach(async () => {
        await clearDatabase(application.orm);
        await loadFixtures(application.orm);
    });

    afterAll(async () => {
        application.server.close();
    });

    it("should get authors", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `query {
          getUsers {
            id name email born
            books {
              id title
            }
          }
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.getUsers).to.be.a("array");
    });

    it("should get user by id", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `query {
          getUser(id: "${createSimpleUuid(1)}") {
            id name born email
            books {
              id title tags {
                id name
              }
            }
          }
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.getUser).to.be.a("object");
    });

    it("should create user", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `mutation {
          addUser (
            input: {
              email: "email@email.com",
              name: "new user",
              born: "${new Date(new Date().setFullYear(1994)).toISOString()}"
            }
          ) {
            id name born email
            books {
              id title tags {
                id name
              }
            }
          }
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.addUser).to.be.a("object");
    });

    it("should update user", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `mutation {
          updateUser (input: {
            email: "updated@email.com",
            name: "update name",
            born: "${new Date().toISOString()}"
          }, id: "${createSimpleUuid(1)}") {
            id name born email
            books {
              id title tags {
                id name
              }
            }
          }
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.updateUser).to.be.a("object");
    });

    it("should delete user", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `mutation {
          deleteUser (id: "${createSimpleUuid(1)}")
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.deleteUser).to.be.true;
    });
});
