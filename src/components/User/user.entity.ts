import {
    Cascade,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    Property,
    Unique,
    BeforeCreate,
} from "@mikro-orm/core";
import UserValidator from "components/User/user.validator";
import { Field, ObjectType } from "type-graphql";
import { Base } from "components/base.entity";
import { Post } from "components/Post";
import * as argon2 from "argon2";

@ObjectType()
@Entity()
export class User extends Base<User> {
    @Field()
    @Property()
    public name: string;

    @Field()
    @Property()
    @Unique()
    public email: string;

    @Property()
    public password: string;

    @Field({ nullable: true })
    @Property({ nullable: true })
    public phone?: string;

    @Field(() => [Post])
    @OneToMany(() => Post, (b: Post) => b.user, { cascade: [Cascade.ALL] })
    public posts = new Collection<Post>(this);

    @Field(() => Post, { nullable: true })
    @ManyToOne(() => Post, { nullable: true })
    public favouritePost?: Post;

    public constructor(body: UserValidator) {
        super(body);
    }

    @BeforeCreate()
    public async runBeforeCreate() {
        const hash = await argon2.hash(this.password);
        this.password = hash;
    }
}
