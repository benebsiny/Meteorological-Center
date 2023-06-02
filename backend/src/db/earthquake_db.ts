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

    const today = new Date();

    const result = [];
    for (const d of data) {
        
        const time = new Date(d.time);

        if ((today.getTime() - time.getTime()) >= 3*24*60*60*1000) {
            break;
        }

        delete d['_id'];
        result.push(d);
    }

    return result as types[];
}
