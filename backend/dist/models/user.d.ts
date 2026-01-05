import mongoose from "mongoose";
export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};
declare const User: mongoose.Model<UserType, {}, {}, {}, mongoose.Document<unknown, {}, UserType, {}, mongoose.DefaultSchemaOptions> & UserType & Required<{
    _id: string;
}> & {
    __v: number;
}, any, UserType>;
export default User;
//# sourceMappingURL=user.d.ts.map