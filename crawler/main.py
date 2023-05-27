import pymongo
import fetch
from pymongo.errors import ServerSelectionTimeoutError
if __name__ == "__main__":

    try:
        client = pymongo.MongoClient("mongodb://database:27017/")
        if "local" not in client.list_database_names():
            print("Unable to connect to database")
            exit()
        db = client["local"]

        ''' ELECTRICITY '''
        elec_db = db["electricity"]
        elec_data = fetch.get_electricity()
        if not elec_data:
            print("Error")

        elec_db.insert_one(elec_data)


        ''' WATER '''
        water_db = db["water"]
        water_data = fetch.get_water()
        if not water_data:
            print("Error")
        water_db.insert_one(water_data)


        ''' EARTHQUAKE '''
        earthquake_db = db["earthquake"]
        earthquake_data = fetch.get_earthquake()
        if not earthquake_data:
            print("Error")
        
        # insert if "time" not exist
        for data in earthquake_data:
            if earthquake_db.find_one({"time": data["time"]}) is None:
                earthquake_db.insert_one(data)

    except ServerSelectionTimeoutError:
        print("Unable to connect to database")
        exit()
