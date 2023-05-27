import connect from "./connect"

interface sub {
    baseAvailable: number,
    volumn: number,
}

interface types {
    寶山第二水庫: sub,
    日月潭: sub,
    南化水庫: sub,
    翡翠水庫: sub,
    湖山水庫: sub,
    鯉魚潭: sub,
    烏山頭水庫: sub,
    石門水庫: sub,
    蘭潭水庫: sub,
    霧社水庫: sub,
    曾文水庫: sub,
    白河水庫: sub,
    新山水庫: sub,
    仁義潭水庫: sub,
    寶山水庫: sub,
    永和山水庫: sub,
    阿公店水庫: sub,
    明德水庫: sub,
    石岡壩: sub,
    牡丹水庫: sub,
    德基水庫: sub,
}

export default async function (): Promise<types> {
    const connection = await connect();
    const data = await connection.db('local').collection('water').findOne({update_time: "2023-05-21 14:55:55"}) as any;
    if (data) {
        delete data['_id'];
        delete data['timestamp'];
        
        return data as types;
    } else {
        throw new Error('No data found');
    }
}

