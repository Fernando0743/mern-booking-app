import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export type UserType = {
    _id: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
};

const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true },
    password: { type: String, required: true},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
});

//Primero tenemos el tipo de UserType, este representa el objeto o tipo de usuario con el que podremos interactuar desde 
// nuestro código y despues tenemos el User Schema que representa la plantilla o la definición de la estructura de nuestro 
// usuario dentro de nuestra base de datos mongodb en este caso.

//Middleware for MongoDb, in this case is when receiveing a request we encrypt the password before sending it to mongodb
userSchema.pre("save", async function() {
    if(this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 8);
    }
});


const User = mongoose.model<UserType>("User",  userSchema)

export default User;