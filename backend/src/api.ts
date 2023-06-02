import { Request, Response } from 'express';
import getElectricity from './db/electricity_db';
import getWater from './db/water_db';
import getEarthquake from './db/earthquake_db';


const api = async (req: Request, res: Response) => {
    const earthquake = await getEarthquake();
    const electricity = await getElectricity();
    const water = await getWater();

    let data: any = {};
    const countryName = ['臺北市', '新北市', '基隆市', '桃園市', '新竹縣', '新竹市', '苗栗縣', '臺中市', '南投縣', '彰化縣', '雲林縣', '嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣', '宜蘭縣', '花蓮縣', '臺東縣'] //, '澎湖縣', '金門縣', '連江縣']

    for (let i = 0; i < countryName.length; i++) {
        data[countryName[i]] = {};
        data[countryName[i]].water = [];

        // Electricity
        if (i <= 5 || countryName[i] == '宜蘭縣') {
            data[countryName[i]].electricity = electricity.north;
        } else if (i <= 10) {
            data[countryName[i]].electricity = electricity.center;
        } else if (i <= 15) {
            data[countryName[i]].electricity = electricity.south;
        } else {
            data[countryName[i]].electricity = electricity.east;
        }
    }

    // Water
    for (const waterName in water) {

        const w = water[waterName] as any;
        w.water = waterName;

        switch (waterName) {
            case "新山水庫":
                data["基隆市"].water.push(water[waterName]);
                break;
            case "翡翠水庫":
                data["臺北市"].water.push(water[waterName]);
                data["新北市"].water.push(water[waterName]);
                break;
            case "石門水庫":
                data["新北市"].water.push(water[waterName]);
                data["桃園市"].water.push(water[waterName]);
                data["新竹縣"].water.push(water[waterName]);
                data["新竹市"].water.push(water[waterName]);
                break;
            case "永和山水庫":
                data["新竹縣"].water.push(water[waterName]);
                data["新竹市"].water.push(water[waterName]);
                data["苗栗縣"].water.push(water[waterName]);
                break;
            case "寶山水庫":
            case "寶山第二水庫":
                data["新竹縣"].water.push(water[waterName]);
                data["新竹市"].water.push(water[waterName]);
                break;
            case "明德水庫":
                data["苗栗縣"].water.push(water[waterName]);
                break;
            case "鯉魚潭水庫":
                data["苗栗縣"].water.push(water[waterName]);
                data["臺中市"].water.push(water[waterName]);
                break;
            case "德基水庫":
                data["臺中市"].water.push(water[waterName]);
                break;
            case "日月潭水庫":
            case "霧社水庫":
                data["南投縣"].water.push(water[waterName]);
                break;
            case "湖山水庫":
                data["雲林縣"].water.push(water[waterName]);
                data["彰化縣"].water.push(water[waterName]);
                data["嘉義縣"].water.push(water[waterName]);
                data["嘉義市"].water.push(water[waterName]);
                break;
            case "仁義潭水庫":
            case "蘭潭水庫":
                data["嘉義縣"].water.push(water[waterName]);
                data["嘉義市"].water.push(water[waterName]);
                break;
            case "白河水庫":
            case "烏山頭水庫":
                data["臺南市"].water.push(water[waterName]);
                break;
            case "曾文水庫":
                data["嘉義縣"].water.push(water[waterName]);
                data["嘉義市"].water.push(water[waterName]);
                data["臺南市"].water.push(water[waterName]);
                break;
            case "南化水庫":
                data["臺南市"].water.push(water[waterName]);
                data["高雄市"].water.push(water[waterName]);
                break;
            case "阿公店水庫":
                data["高雄市"].water.push(water[waterName]);
                break;
            case "牡丹水庫":
                data["屏東縣"].water.push(water[waterName]);
                break;
            default:
                break;
        }
    }

    // Earthquake
    for (const e of earthquake) {
        for (const v of e.vibration) {
            if (!data[v.location].earthquake) data[v.location].earthquake = [];
            data[v.location].earthquake.push({
                time: e.time,
                epicenter: e.epicenter,
                deep: e.deep,
                magnitude: e.magnitude,
                vib: v.vib,
            });
        }
    }

    res.json(data);
}

export default api;
