import { Collection, Entity, ManyToMany, Property } from "@mikro-orm/core";
import TagValidator from "components/Tag/tag.validator";
import { Post } from "components/Post/post.entity";
import { Field, ObjectType } from "type-graphql";
import { Base } from "components/base.entity";

@ObjectType()
@Entity()
export class Tag extends Base<Tag> {
    @Field()
    @Property()
    public name: string;

    // @Field(() => [Post])
    // @ManyToMany(() => Post, (b: Post) => b.tags)
    // public books = new Collection<Post>(this);

    public constructor(body: TagValidator) {
        super(body);
    }
}
