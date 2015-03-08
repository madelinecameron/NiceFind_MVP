import sys
import os
import json
import requests

from pymongo import MongoClient

def parse_towns(state):
    '''Takes in JSON from downloaded data from sba.gov and parses out the relevant info'''

    city_lat_long = list()
    for city in state:
        if city['county_name'] is not None:  # Which means it isn't a county
            try:
                geojson_obj = {
                    'type': 'Point',
                    'coordinates': [ float(city['primary_longitude']),
                    float(city['primary_latitude']) ]
                }
                city_entry = {
                    'name' : city['name'],
                    'state_abbr' : city['state_abbreviation'],
                    'county_name' : city['county_name'],
                    'location' : geojson_obj
                }
                city_lat_long.append(city_entry)
            except:
                print "Failed! {0}".format(city)
                continue

        else:
            print "This is a county! Skipping..."

    print "Done finding all of the towns!"
    return city_lat_long

def request_towns(abbr):
    ''' Downloads data from sba.gov that corresponds to state abbreviation '''

    request_url = "http://api.sba.gov/geodata/city_county_data_for_state_of/{0}.json".format(abbr)
    town_response = requests.get(request_url)
    town_response_utf8 = town_response.content.decode('utf-8')
    town_response_json = json.loads(town_response_utf8)

    return town_response_json

def add_towns_to_db(town_list):
    client = MongoClient("mongodb://server:solobuy@ds053300.mongolab.com:53300/solobuy")
    db = client["solobuy"]

    item_collection = db.towns
    for item in town_list:
        inserted_item = item_collection.insert(item)
        print "Inserted: {0}".format(inserted_item)

if __name__ == "__main__":
    state_abbreviations = dict()
    with open('./state_abbr.json') as state_abbr:
        state_abbreviations = json.loads(state_abbr.read())

    for abbr in state_abbreviations:
        towns = request_towns(abbr)
        towns_lat_long = parse_towns(towns)
        add_towns_to_db(towns_lat_long)
