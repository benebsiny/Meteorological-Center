import {MongoClient} from 'mongodb'

async function connectDB(): Promise<MongoClient> {

    let url;
    if (process.env.DATABASE_USER === undefined || process.env.DATABASE_PASSWORD === undefined) {
        url = 'mongodb://database:27017';
    } else {
        url = `mongodb://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@database:27017`;
    }
    const client = new MongoClient(url);
    return await client.connect();

}

export default connectDB;
