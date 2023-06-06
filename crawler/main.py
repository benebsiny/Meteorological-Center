import os
import logging
import sys

import fetch

import pymongo
from pymongo.errors import ServerSelectionTimeoutError
from apscheduler.schedulers.blocking import BlockingScheduler

def run():
    try:
        # check environment has username and password
        if "DATABASE_USER" not in os.environ or "DATABASE_PASSWORD" not in os.environ:
            client = pymongo.MongoClient("mongodb://database:27017/")
        else:
            client = pymongo.MongoClient(
                "mongodb://" + os.environ["DATABASE_USER"] + ":" + os.environ["DATABASE_PASSWORD"] + "@database:27017/")
            
        if "local" not in client.list_database_names():
            logging.error("Unable to connect to database")
            exit()
        db = client["local"]

        ''' ELECTRICITY '''
        elec_db = db["electricity"]
        elec_data = fetch.get_electricity()
        if not elec_data:
            logging.error("Unable to get electricity data")

        elec_db.insert_one(elec_data)


        ''' WATER '''
        water_db = db["water"]
        water_data = fetch.get_water()
        if not water_data:
            logging.error("Unable to get water data")
        water_db.insert_one(water_data)


        ''' EARTHQUAKE '''
        earthquake_db = db["earthquake"]
        earthquake_data = fetch.get_earthquake()
        if not earthquake_data:
            logging.error("Unable to get earthquake data")
        
        # insert if "time" not exist
        for data in earthquake_data:
            if earthquake_db.find_one({"time": data["time"]}) is None:
                earthquake_db.insert_one(data)
        
        logging.info("Crawler process finished")

    except ServerSelectionTimeoutError:
        logging.error("Unable to connect to database")
    except Exception as e:
        logging.error(e)


if __name__ == "__main__":

    logging.basicConfig(level=logging.INFO)

    if len(sys.argv) > 1 and sys.argv[1] == "--debug":
        logging.info("[Debug mode]")
        run()
        exit()

    run() # Run at start up

    scheduler = BlockingScheduler()
    scheduler.add_job(run, 'interval', hours=1)
    scheduler.start()
    