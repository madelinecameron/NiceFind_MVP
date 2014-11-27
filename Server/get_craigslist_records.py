import sys, os, requests, json
from datetime import datetime

def get_records(api_key):
    next_page = 1
    params = { 'auth_token' : api_key, 'status' : 'for_sale', 'lat' : 37.956002, 'long' : -91.774363, 'radius' : '50mi', 'category': 'SANT', 'has_image': 1, 'has_price': 1, 'rpp': 100 }
    
    while(next_page > 0):
        request_url = "http://search.3taps.com/?" + '&'.join("{!s}={!s}".format(key, val) for (key, val) in params.items())
        print("Request: {0}".format(request_url))
        response = requests.get(request_url)
        print("Headers: %s" % response.headers)
        
        content_decode = response.content.decode("utf-8")
        json_parse = json.loads(content_decode)
        print("Json: %s" % json_parse)
        external_id_set = set()
        item_list = []
        for item in json_parse["postings"]:
            if(item["external_id"] not in external_id_set):
                external_id_set.add(item["external_id"])
                item_list.append([item["category"], item["heading"]])

        for item in item_list:
            print("Item: %s" % item)
            
        next_page = json_parse['next_page']
        params = { 'auth_token' : api_key, 'status' : 'for_sale', 'lat' : 37.956002, 'long' : -91.774363, 'radius' : '50mi', 'category': 'SANT', 'has_image': 1, 'has_price': 1, 'rpp': 100, 'page': next_page }
    
    return item_list
    
def remove_unwanted_records(records):
    pass
	
if __name__ == "__main__":
    conf = open("./three_taps_conf")
    api_key = conf.readline().replace("\n", "")
    
    records = get_records(api_key)
    
    # unwanted_records_removed = removed_unwanted_records(records)