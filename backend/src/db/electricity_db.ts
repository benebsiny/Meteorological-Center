import connect from "./connect"

interface sup {
    usage: number,
    max_supply: number,
    min_supply: number,
}

interface types {
    north: sup,
    south: sup,
    east: sup,
    center: sup,
}

export default async function (): Promise<types> {
    const connection = await connect();
    const data = await connection.db('local').collection('electricity').find().sort({update_time: -1}).limit(1).tryNext() as any;
    if (data) {
        delete data['_id'];
        delete data['update_time'];
        return data as types;
    } else {
        throw new Error('No data found');
    }
}

