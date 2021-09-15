import { Collection, Entity, Enum, OneToMany, Property } from "@mikro-orm/core";
import { PublisherType } from "components/Publisher/publisherType.enum";
import { PublisherValidator } from "components/Publisher/publisher.validator";
import { Post } from "components/Post/post.entity";
import { Field, ObjectType } from "type-graphql";
import { Base } from "utils/entities/base.entity";

@ObjectType()
@Entity()
export class Publisher extends Base<Publisher> {
    @Field()
    @Property()
    public name: string;

    @Field(() => PublisherType)
    @Enum(() => PublisherType)
    public type: PublisherType;

    // @Field(() => [Post])
    // @OneToMany(() => Post, (b: Post) => b.publisher)
    // public books = new Collection<Post>(this);

    public constructor(body: PublisherValidator) {
        super(body);
    }
}
