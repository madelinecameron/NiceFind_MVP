# get_records.py, version 2
# Written on: 03/02/2015

import sys
import os
import requests
import json

from pymongo import MongoClient

def pull_records():
    '''Pulls records from Craigslist using 3taps API'''

    try:
        print "Finding new records..."
        TOKEN = '5fc28a18ceb1ed57388e7a9b965336af'  # 3taps API key
        anchor = None
        external_id_set = set()
        items = list()

        if os.path.exists('./anchor'):  # Get Anchor point from file if avaliable
            with open('./anchor', 'r+') as anchor_file:
                anchor = anchor_file.read()

        params = {
            'auth_token' : TOKEN,
            'status' : 'for_sale',
            'location.country' : 'USA',
            'category' : 'SANT|SCOL|SJWL',
            'rpp' : 100,
            'state' : 'available',
            'location.state' : 'USA-MO',
            'retvals' : 'category,location,external_id,external_url,heading,body,' +
            'timestamp,price,currency,images,status,annotations',
            'source' : 'CRAIG',
            'anchor' : anchor
        }

        request_url = "http://polling.3taps.com/poll?" + '&'.join(
        "{!s}={!s}".format(key, val) for (key, val) in params.items())

        response = requests.get(request_url)
        response_utf8 = response.content.decode('utf-8')
        response_json = json.loads(response_utf8)

        for item in response_json["postings"]:

            # Proceed only if price, phone and images are avaliable in the record
            if 'price' in item and 'images' in item and 'phone' in item['annotations']:
                if item['price'] is not None and item['images'] != []:

                    # Proceed only if external_id has never been seen before
                    # Prevents duplicates
                    if item['external_id'] not in external_id_set:
                        geojson_obj = {
                            'type': 'Point',
                            'coordinates': [ float(item["location"]["long"]),
                            float(item["location"]["lat"]) ]
                        }

                        external_id_set.add(item["external_id"])

                        # Find the 'real location' of the item
                        real_loc = ""
                        if 'city' in item['location']:
                            print "Using 3taps location data to find city..."
                            location_request_url = "http://reference.3taps.com/locations/lookup?auth_token={0}&code={1}".format(TOKEN, item['location']['city'])

                            loc_response = requests.get(location_request_url)
                            loc_response_utf8 = loc_response.content.decode('utf-8')
                            loc_response_json = json.loads(loc_response_utf8)

                            real_loc = loc_response_json['location']['short_name']

                        else:  # This is hopefully only a back-up in case the worst
                            print "Using Google Geocoding to find city..."
                            location_request_url = "https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{long}&key=AIzaSyB3wH4frje1bAWg9MW2brZ0s3jwRpGudMo".format(lat=item['location']['lat'], long=item['location']['long'])

                            loc_response = requests.get(location_request_url)
                            loc_response_utf8 = loc_response.content.decode('utf-8')
                            loc_response_json = json.loads(loc_response_utf8)

                            real_loc = loc_response_json['results'][0]['address_components'][3]

                        item_insert = {
                            'name' : item['heading'],
                            'category' : item['category'],
                            'price' : "{0:.2f}".format(float(item['price'])),
                            'currency' : item['currency'],
                            'image_urls': item['images'][0]['full'],
                            'description' : item['body'],
                            'loc' : geojson_obj,
                            'real_loc' : real_loc,
                            'phone' : item['annotations']['phone'],
                            'timestamp' : item['timestamp']
                        }

                        items.append(item_insert)

        with open("./anchor", 'w+') as anchor_record:
            print "Anchor write: {0}".format(response_json["anchor"])
            anchor_record.write(str(response_json["anchor"]))

        return items
    except Exception as e:
        print "Exception: {0}".format(e)

def put_records_in_db(records):
    client = MongoClient("mongodb://server:solobuy@ds053300.mongolab.com:53300/solobuy")
    db = client["solobuy"]

    item_collection = db.items
    for item in records:
        inserted_item = item_collection.insert(item)
        print "Inserted: {0}".format(inserted_item)

if __name__ == "__main__":
    records = pull_records()
    print "Exporting all records to database..."
    put_records_in_db(records)
