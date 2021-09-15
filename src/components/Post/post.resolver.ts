import PostValidator from "components/Post/post.validator";
import { User } from "components/User/user.entity";
import { Post } from "components/Post/post.entity";
// import { Publisher } from "components/Publisher/publisher.entity";
import { GraphQLResolveInfo } from "graphql";
import { fieldsToRelations, getFields } from "utils/helpers/graphqlFieldsToRelations";
import { Arg, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "utils/interfaces/context.interface";

@Resolver(() => Post)
export class PostResolver {
    @Query(() => [Post])
    public async getPosts(
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<Post[]> {
        const relationPaths = fieldsToRelations(info, { root: "post" });

        return ctx.em.getRepository(Post).findAll(relationPaths);
    }

    @Query(() => Post, { nullable: true })
    public async getPost(
        @Arg("id") id: string,
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<Post | null> {
        const relationPaths = fieldsToRelations(info, { root: "post" });

        return ctx.em.getRepository(Post).findOne({ id }, relationPaths);
    }

    @Mutation(() => Post)
    public async addPost(
        @Arg("input") input: PostValidator,
        @Arg("userId") userId: string,
        @Arg("publisherId", { nullable: true }) publisherId: string,
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<Post> {
        const post = new Post(input);

        getFields(info, "user");
        // fieldsToRelations(info, { root: "user" });

        post.user = await ctx.em.getRepository(User).findOneOrFail({ id: userId });

        // if (publisherId) {
        //     post.publisher = await ctx.em.getRepository(Publisher).findOneOrFail(
        //         { id: publisherId },
        //         fieldsToRelations(info, {
        //             root: "publisher",
        //         })
        //     );
        // }

        // await ctx.em.persist(post).flush();
        return post;
    }

    @Mutation(() => Post)
    public async updatePost(
        @Arg("input") input: PostValidator,
        @Arg("id") id: string,
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<Post> {
        const relationPaths = fieldsToRelations(info, { root: "post" });
        const post = await ctx.em.getRepository(Post).findOneOrFail({ id }, relationPaths);
        post.assign(input);

        await ctx.em.persist(post).flush();

        return post;
    }

    @Mutation(() => Boolean)
    public async deletePost(@Arg("id") id: string, @Ctx() ctx: MyContext): Promise<boolean> {
        const post = await ctx.em.getRepository(Post).findOneOrFail({ id });
        await ctx.em.getRepository(Post).remove(post).flush();

        return true;
    }
}
