import os, json, sys
from fuzzywuzzy import process, fuzz

replaced_items = dict()

def save(json, file):
	with open(file, "w+") as item_file:
		print("Dumping file...")
		item_file.write(json)
	
def replace_item(prev_name, new_name, item_dict):
	item_dict[new_name] = item_dict.pop(prev_name)
	
def parse_items(raw_json):
	parsed_item_json = parse_item(raw_json)
	return parsed_item_json
	
def parse_item(item_json):
	mod_items = item_json['name']  # Dictionary

	if os.path.exists('modified_items.json'):
		replaced_items = json.loads(open('modified_items.json', 'r+'))
	else:
		replaced_items = dict()
		
	for item in sorted(list(mod_items)):
		print("Item name: {0}".format(item))
		
		name = None
		modifier = None
		
		if ',' in item:  # Has a modifier
			split_item = item.split(',')
			name = split_item[0]
			for i in range(1, len(split_item)):  # This is for joining multiple modifiers
				modifier = ' '.join(split_item[0:])
				
		else:
			name = item
			modifier = None
		
		if replaced_items:  # If replaced_items dict isn't empty
			if name in (replaced_items.keys() or replaced_items.values()):
				if name in replaced_items.keys():
					replacement_name = replaced_items[name]
					print("Replacing {0} with {1}".format(item, replacement_item))
					mod_items[replacement_name] = mod_items.pop(item)
				else:
					print("Item name is already a replacement, skipping!")
					continue
				
			(similar_item_w_mod, percent_similar_w_mod) = process.extractOne(item, replaced_items.keys())
			(similar_item_wo_mod, percent_similar_wo_mod) = process.extractOne(name, replaced_items.keys())
			
			print("\tSimilar w/ mod: {0}, {1}\n\tSimilar w/o mod: {2},{3}".format(similar_item_w_mod,
			percent_similar_w_mod, similar_item_wo_mod, percent_similar_wo_mod))
			
			replacement_name = replaced_items[similar_item_w_mod]
							
			if percent_similar_w_mod >= 95:
				if fuzz.partial_ratio(name, replacement_name) < 80:
					print("Not similar enough!")
				else:
					print("Replacing {0} with {1}".format(item, replacement_name))
					mod_items[replacement_name] = mod_items.pop(item)
					continue
			else:
				if percent_similar_wo_mod >= 98:
					print("Without the modifier, the name is similar enough!")
					continue
		
			if percent_similar_w_mod > 85 and percent_similar_w_mod < 95:
				response = raw_input("Should {0} be replaced with {1}?".format(item, replacement_name))
				
				if response == ("Y" or "S"):
					if response == "Y":
						mod_items[replacement_name] = mod_items.pop(item)
						continue
					else:
						replaced_items[item] = item
				
		replacement_name = raw_input("{0}; Is this correct?\n".format(item))
		if replacement_name != ("Y" or "R"):
			mod_items[replacement_name] = mod_items.pop(item)
		else:
			if replacement_name == "Y":
				print("Keeping {0}!".format(item))
				replaced_items[item] = item
			else:
				mod_items.pop(item)
				
	item_json['name'] = mod_items
	save(json.dumps(replaced_items), 'modified_items.json')
	return item_json
	
							