import { MongoClient } from 'mongodb'

async function connectDB(): Promise<MongoClient> {
    const url = 'mongodb://database:27017';
    const client = new MongoClient(url);
    const connect = await client.connect();
    return connect;
}

export default connectDB;
