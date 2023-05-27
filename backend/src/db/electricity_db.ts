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
    const data = await connection.db('local').collection('electricity').findOne({update_time: "112.05.21 14:10"}) as any;
    if (data) {
        delete data['_id'];
        delete data['update_time'];
        return data as types;
    } else {
        throw new Error('No data found');
    }
}

