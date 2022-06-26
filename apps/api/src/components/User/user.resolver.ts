import { Arg, Ctx, Info, Mutation, Query, Resolver } from "type-graphql";
import { Service } from "typedi";
import UserValidator from "components/User/user.validator";
import { User } from "components/User/user.entity";
import type { GraphQLResolveInfo } from "graphql";
import { fieldsToRelations } from "utils/helpers/graphqlFieldsToRelations";
import type { MyContext } from "utils/interfaces/context.interface";

@Service()
@Resolver(() => User)
export class UserResolver {
    @Query(() => [User])
    public async getUsers(
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<User[]> {
        const relationPaths = fieldsToRelations(info);

        return ctx.em.getRepository(User).findAll();
    }

    @Query(() => User, { nullable: true })
    public async getUser(
        @Arg("id") id: string,
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<User | null> {
        const relationPaths = fieldsToRelations(info);

        return ctx.em.getRepository(User).findOne({ id });
    }

    @Mutation(() => User)
    public async addUser(@Arg("input") input: UserValidator, @Ctx() ctx: MyContext): Promise<User> {
        const user = new User(input);
        await ctx.em.persist(user).flush();

        return user;
    }

    @Mutation(() => User)
    public async updateUser(
        @Arg("input") input: UserValidator,
        @Arg("id") id: string,
        @Ctx() ctx: MyContext,
        @Info() info: GraphQLResolveInfo
    ): Promise<User> {
        const relationPaths = fieldsToRelations(info);
        const user = await ctx.em.getRepository(User).findOneOrFail({ id });
        user.assign(input);

        await ctx.em.persist(user).flush();

        return user;
    }

    @Mutation(() => Boolean)
    public async deleteUser(@Arg("id") id: string, @Ctx() ctx: MyContext): Promise<boolean> {
        const user = await ctx.em.getRepository(User).findOneOrFail({ id });

        await ctx.em.getRepository(User).remove(user).flush();

        return true;
    }
}
