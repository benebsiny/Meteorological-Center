
import requests
from bs4 import BeautifulSoup
import re
import datetime


def get_electricity():

    # Get people amount
    try:
        ''' GET AREA SUPPLY RATE '''
        reqjs = requests.get(
            "https://www.taiwanstat.com/realtime/power/js/index.js")
        if reqjs.status_code != 200:
            print("Error")
            return None

        area_supply_rate = re.search(
            r"var areaSupplyRate = \[(.*)];", reqjs.text)
        if area_supply_rate is None or len(area_supply_rate.groups()) != 1:
            print("Unable to get area supply rate.")
            return None

        area_supply_rate = area_supply_rate.group(1)
        area_supply_rate = area_supply_rate.split(", ")
        # north, center, south, east
        area_supply_rate = list(map(lambda x: float(x), area_supply_rate))

        if len(area_supply_rate) != 4:
            print("Unable to get area supply rate.")
            return None

        ''' GET RESERVE SUPPLY OF EACH AREA '''
        reqapi = requests.get("https://www.taiwanstat.com/powers/latest/")
        if reqapi.status_code != 200:
            print("Error")
            return None

        resp = reqapi.json()

        # North usage
        north_usage = float(resp['regionData']['northUsage'])
        center_usage = float(resp['regionData']['centerUsage'])
        south_usage = float(resp['regionData']['southUsage'])
        east_usage = float(resp['regionData']['eastUsage'])

        # Get reserve supply
        reserve_supply = resp['reserveData']['reserveSupply']
        reserve_supply = float(reserve_supply)

        # Get update time
        update_time = resp['reserveData']['updateTime']
        update_time = re.sub('\(.*\)', ' ', update_time)

        ''' GET MAX & MIN SUPPLY '''
        region = ['north', 'center', 'south', 'east']
        max_supply = []
        min_supply = []
        for i in range(len(region)):
            max_supply.append(reserve_supply * area_supply_rate[i])
            min_supply.append(reserve_supply * area_supply_rate[i] * 0.5)

        return {
            'update_time': update_time,
            "north": {
                "usage": north_usage,
                "max_supply": max_supply[0],
                "min_supply": min_supply[0],
            },
            "center": {
                "usage": center_usage,
                "max_supply": max_supply[1],
                "min_supply": min_supply[1],
            },
            "south": {
                "usage": south_usage,
                "max_supply": max_supply[2],
                "min_supply": min_supply[2],
            },
            "east": {
                "usage": east_usage,
                "max_supply": max_supply[3],
                "min_supply": min_supply[3],
            },
        }

    except Exception as e:
        print(e)
        return 0


def get_water():
    req = requests.get("https://www.taiwanstat.com/waters/latest/")
    if req.status_code != 200:
        print("Error")
        return None

    data = req.json()
    if len(data) == 0:
        print("Error")
        return None

    reservoir = {}
    for key, val in data[0].items():
        reservoir[key] = {
            'baseAvailable': val['baseAvailable'],
            'volumn': val['volumn'],
        }

    timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    result = {
        'timestamp': timestamp,
        'reservoir': reservoir,
    }
    return result

def get_earthquake():

    domain = "https://www.cwb.gov.tw"
    req = requests.get("https://www.cwb.gov.tw/V8/C/E/MOD/EQ_ROW.html")
    if req.status_code != 200:
        print("Error")
        return None
    
    soup = BeautifulSoup(req.text, 'html.parser')
    earthquake = []

    rows = soup.select('.eq-row')
    for row in rows:
        link = row.select_one('.eq-infor > a').attrs['href']

        link = domain + link
        req = requests.get(link)
        if req.status_code != 200:
            print("Error")
            return None
        
        soup2 = BeautifulSoup(req.text, 'html.parser')
        lis = soup2.select('.list-unstyled.quake_info > li')

        # time
        time = lis[0].text[5:]

        # epicenter
        epicenter = lis[1].select_one('span').text
        epicenter = re.findall(r'，位於(.*)', epicenter)[0]

        # deep
        deep = lis[2].text[5:]

        # magnitude
        magnitude = lis[3].text[5:]

        vibration = []
        divs = soup2.select('.panel.panel-default')
        for div in divs:
            vibration_str = div.select_one(".panel-heading a").text
            location = vibration_str[:3]
            vib = vibration_str[-2:]
            vibration.append({"location": location, "vib": vib})

        earthquake.append({
            'time': time,
            'epicenter': epicenter,
            'deep': deep,
            'magnitude': magnitude,
            'vibration': vibration,
        })

    return earthquake

