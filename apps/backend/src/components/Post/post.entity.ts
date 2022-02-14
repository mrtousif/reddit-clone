import { Cascade, Collection, Entity, ManyToMany, ManyToOne, Property } from "@mikro-orm/core";
import PostValidator from "components/Post/post.validator";
import { User } from "components/User";
import { Publisher } from "components/Publisher/publisher.entity";
import { Tag } from "components/Tag/tag.entity";
import { Field, ObjectType } from "type-graphql";
import { Base } from "components/base.entity";

@ObjectType()
@Entity()
export class Post extends Base<Post> {
    @Field()
    @Property()
    public title: string;

    @Field(() => User)
    @ManyToOne(() => User, { onDelete: "cascade" })
    public user: User;

    // @Field(() => Publisher, { nullable: true })
    // @ManyToOne(() => Publisher, {
    //     cascade: [Cascade.PERSIST, Cascade.REMOVE],
    //     nullable: true,
    // })
    // public publisher?: Publisher;

    // @Field(() => [Tag])
    // @ManyToMany(() => Tag)
    // public tags = new Collection<Tag>(this);

    public constructor(body: PostValidator) {
        super(body);
    }
}
