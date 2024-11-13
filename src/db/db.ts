import { AppDataSource } from "@/typeorm/typeorm";

export const initDB = async() => {
    try {
        await AppDataSource.initialize();
        console.log("db connection done successfully");
    }
    catch(err) {
        console.error("Error in db connection",err);
    }
}