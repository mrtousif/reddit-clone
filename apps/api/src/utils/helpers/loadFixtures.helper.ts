import { MikroORM } from "@mikro-orm/core";
import { PublisherType } from "components/Publisher/publisherType.enum";
import { User } from "components/User/user.entity";
import { Post } from "components/Post/post.entity";
import { Publisher } from "components/Publisher/publisher.entity";
import { Tag } from "components/Tag/tag.entity";
import { faker } from '@faker-js/faker';
import createSimpleUuid from "utils/helpers/createSimpleUuid.helper";

export const loadFixtures = async (orm: MikroORM): Promise<void> => {
    try {
        const tags = await Promise.all(
            [...Array.from({ length: 5 })].map(async (_, tagIndex) => {
                const tag = new Tag({
                    name: `tag ${tagIndex + 1}`,
                });

                // Setting temporary id for test purposes
                tag.id = createSimpleUuid(tagIndex + 1);

                await orm.em.persist(tag);
                return tag;
            })
        );

        const publishers = await Promise.all(
            [...Array.from({ length: 5 })].map(async (_, publisherIndex) => {
                const publisher = new Publisher({
                    name: faker.company.companyName(),
                    type: PublisherType.GLOBAL,
                });

                // Setting temporary id for test purposes
                publisher.id = createSimpleUuid(publisherIndex + 1);

                await orm.em.persist(publisher);
                return publisher;
            })
        );

        const authors = await Promise.all(
            [...Array.from({ length: 5 })].map(async (_, authorIndex) => {
                const user = new User({
                    name: `user ${authorIndex + 1}`,
                    email: faker.internet.email(),
                    phone: faker.phone.phoneNumber(),
                    password: faker.internet.password()
                });

                // Setting temporary id for test purposes
                user.id = createSimpleUuid(authorIndex + 1);

                await orm.em.persist(user);
                return user;
            })
        );

        await Promise.all(
            [...Array.from({ length: 5 })].map(async (_, bookIndex) => {
                const post = new Post({
                    title: `title ${bookIndex + 1}`,
                });

                // Setting temporary id for test purposes
                post.id = createSimpleUuid(bookIndex + 1);
                // post.tags = [orm.em.getRepository(Tag).getReference(tags[bookIndex].id)];
                // post.user = orm.em.getRepository(User).getReference(authors[bookIndex].id);
                // post.publisher = orm.em
                //     .getRepository(Publisher)
                //     .getReference(publishers[bookIndex].id);

                await orm.em.persist(post);
                return post;
            })
        );

        await orm.em.flush();
    } catch (error) {
        console.error("📌 Could not load fixtures", error);
    }
};
