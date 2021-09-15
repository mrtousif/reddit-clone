import { IsPhoneNumber, IsEmail, IsOptional, IsString } from "class-validator";
import { Field, InputType } from "type-graphql";

@InputType()
export class UserValidator {
    @Field()
    @IsString()
    public name: string;

    @Field()
    @IsEmail()
    public email: string;

    @Field()
    @IsString()
    public password: string;

    @Field({ nullable: true })
    @IsPhoneNumber()
    @IsOptional()
    public phone: string;
}

export default UserValidator;
