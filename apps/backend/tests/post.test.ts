import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import Application from "application";
import supertest, { SuperTest, Test } from "supertest";
import createSimpleUuid from "utils/helpers/createSimpleUuid.helper";
import { clearDatabase } from "utils/services/clearDatabase.service";
import { loadFixtures } from "utils/services/loadFixtures.service";

let request: SuperTest<Test>;
let app: Application;
let em: EntityManager<IDatabaseDriver<Connection>>;

describe("Post tests", async () => {
    beforeAll(async () => {
        app = new Application();
        await app.init();

        em = app.orm.em.fork();

        request = supertest(app.instance);
    });

    beforeEach(async () => {
        await clearDatabase(app.orm);
        await loadFixtures(app.orm);
    });

    afterAll(async () => {
        app.server.close();
    });

    it("should get books", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `query {
          getPosts {
            id title user {
              id email
            }
            publisher {
              id name
            }
            tags {
              id name books {
                id
              }
            }
          }
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.getPosts).to.be.a("array");
    });

    it("should get post by id", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `query {
          getPost(id: "${createSimpleUuid(1)}") {
            id title user {
              id email
            }
            publisher {
              id name
            }
            tags {
              id name books {
                id
              }
            }
          }
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.getPost).to.be.a("object");
    });

    it("should create post", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `mutation {
          addPost (
            input: {
              title: "new Post",
            },
            authorId: "${createSimpleUuid(1)}"
            publisherId: "${createSimpleUuid(1)}"
          ) {
            id title user {
              id email
            }
            publisher {
              id name
            }
            tags {
              id name books {
                id
              }
            }
          }
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.addPost).to.be.a("object");
    });

    it("should update post", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `mutation {
          updatePost (input: {
            title: "updated post",
          }, id: "${createSimpleUuid(1)}") {
            id title user {
              id email
            }
            publisher {
              id name
            }
            tags {
              id name books {
                id
              }
            }
          }
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.updatePost).to.be.a("object");
    });

    it("should delete post", async () => {
        const response = await request
            .post("/graphql")
            .send({
                query: `mutation {
          deletePost (id: "${createSimpleUuid(1)}")
        }
        `,
            })
            .expect(200);

        // expect(response.body.data.deletePost).to.be.true;
    });
});
