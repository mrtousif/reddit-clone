import { randomUUID } from "crypto";
import { PrimaryKey, Property, BigIntType, BaseEntity } from "@mikro-orm/core";
import { Field, ID, ObjectType } from "type-graphql";

@ObjectType({ isAbstract: true })
export class Base<T extends { id: string }> extends BaseEntity<T, "id"> {
    @Field(() => ID)
    @PrimaryKey({ type: BigIntType })
    public id!: string;

    @Field()
    @Property({ defaultRaw: "now()" })
    public createdAt: Date = new Date();

    @Field({ nullable: true })
    @Property({ nullable: true, onUpdate: () => new Date() })
    public updatedAt?: Date;

    public constructor(body = {}) {
        super();
        this.assign(body);
    }
}
