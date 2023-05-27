import connect from "./connect"

interface types {
    time: string,
    epicenter: string,
    deep: string,
    magnitude: string,
    vibration: {
        location: string,
        vib: string,
    }[],
}

export default async function (): Promise<types[]> {
    const connection = await connect();
    const data = await connection.db('local').collection('earthquake').find().sort({time: -1}).toArray() as any;
    for (let i = 0; i < data.length; i++) {
        delete data[i]['_id'];
    }
    return data as types[];
}
