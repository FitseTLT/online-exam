import mongoose from "mongoose";

const setup = async () => {
    try {
        await mongoose.connect(process.env.DB_URL!);

        console.log("Database Connected");
    } catch (e) {
        console.log(e);
    }
};

setup();
