import { IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class PostValidator {
    @Field()
    @IsString()
    public title: string;
}

export default PostValidator;
