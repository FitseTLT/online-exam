import mongoose from "mongoose";

const setup = async () => {
    try {
        await mongoose.connect(process.env.DB_URL!);
        console.log("DB testing connected");
    } catch (e) {
        console.log(e);
    }
};

setup();
