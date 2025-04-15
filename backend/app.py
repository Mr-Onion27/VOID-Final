import pandas as pd
from pymongo import MongoClient
import sys
import json

# Slot mapping dictionary (same as before)
slot_mapping = {
   # Monday Slots
    'A1': 'Monday 8:00 AM - 8:50 AM', 'L1': 'Monday 8:00 AM - 8:50 AM',
    'F1': 'Monday 9:00 AM - 9:50 AM', 'L2': 'Monday 8:51 AM - 9:40 AM',
    'D1': 'Monday 10:00 AM - 10:50 AM', 'L3': 'Monday 9:51 AM - 10:40 AM',
    'TB1': 'Monday 11:00 AM - 11:50 AM', 'L4': 'Monday 10:41 AM - 11:30 AM',
    'TG1': 'Monday 12:00 PM - 12:50 PM', 'L5': 'Monday 11:40 AM - 12:30 PM',
    'L6': 'Monday 12:31 PM - 1:20 PM', 'A2': 'Monday 2:00 PM - 2:50 PM',
    'F2': 'Monday 3:00 PM - 3:50 PM', 'D2': 'Monday 4:00 PM - 4:50 PM',
    'TB2': 'Monday 5:00 PM - 5:50 PM', 'TG2': 'Monday 6:00 PM - 6:50 PM',
    'V3': 'Monday 7:01 PM - 7:50 PM',

    # Tuesday Slots
    'B1': 'Tuesday 8:00 AM - 8:50 AM', 'L7': 'Tuesday 8:00 AM - 8:50 AM',
    'G1': 'Tuesday 9:00 AM - 9:50 AM', 'L8': 'Tuesday 8:51 AM - 9:40 AM',
    'E1': 'Tuesday 10:00 AM - 10:50 AM', 'L9': 'Tuesday 9:51 AM - 10:40 AM',
    'TC1': 'Tuesday 11:00 AM - 11:50 AM', 'L10': 'Tuesday 10:41 AM - 11:30 AM',
    'TAA1': 'Tuesday 12:00 PM - 12:50 PM', 'L11': 'Tuesday 11:40 AM - 12:30 PM',
    'L12': 'Tuesday 12:31 PM - 1:20 PM', 'B2': 'Tuesday 2:00 PM - 2:50 PM',
    'G2': 'Tuesday 3:00 PM - 3:50 PM', 'E2': 'Tuesday 4:00 PM - 4:50 PM',
    'TC2': 'Tuesday 5:00 PM - 5:50 PM', 'TAA2': 'Tuesday 6:00 PM - 6:50 PM',
    'V4': 'Tuesday 7:01 PM - 7:50 PM',

    # Wednesday Slots
    'C1': 'Wednesday 8:00 AM - 8:50 AM', 'L13': 'Wednesday 8:00 AM - 8:50 AM',
    'A1': 'Wednesday 9:00 AM - 9:50 AM', 'L14': 'Wednesday 8:51 AM - 9:40 AM',
    'F1': 'Wednesday 10:00 AM - 10:50 AM', 'L15': 'Wednesday 9:51 AM - 10:40 AM',
    'V1': 'Wednesday 11:00 AM - 11:50 AM', 'L16': 'Wednesday 10:41 AM - 11:30 AM',
    'V2': 'Wednesday 12:00 PM - 12:50 PM', 'L17': 'Wednesday 11:40 AM - 12:30 PM',
    'L18': 'Wednesday 12:31 PM - 1:20 PM', 'C2': 'Wednesday 2:00 PM - 2:50 PM',
    'A2': 'Wednesday 3:00 PM - 3:50 PM', 'F2': 'Wednesday 4:00 PM - 4:50 PM',
    'V12': 'Wednesday 5:00 PM - 5:50 PM', 'TBB2': 'Wednesday 6:00 PM - 6:50 PM',
    'V5': 'Wednesday 7:01 PM - 7:50 PM',

    # Thursday Slots
    'D1': 'Thursday 8:00 AM - 8:50 AM', 'L19': 'Thursday 8:00 AM - 8:50 AM',
    'B1': 'Thursday 9:00 AM - 9:50 AM', 'L20': 'Thursday 8:51 AM - 9:40 AM',
    'G1': 'Thursday 10:00 AM - 10:50 AM', 'L21': 'Thursday 9:51 AM - 10:40 AM',
    'TE1': 'Thursday 11:00 AM - 11:50 AM', 'L22': 'Thursday 10:41 AM - 11:30 AM',
    'TCC1': 'Thursday 12:00 PM - 12:50 PM', 'L23': 'Thursday 11:40 AM - 12:30 PM',
    'L24': 'Thursday 12:31 PM - 1:20 PM', 'D2': 'Thursday 2:00 PM - 2:50 PM',
    'B2': 'Thursday 3:00 PM - 3:50 PM', 'G2': 'Thursday 4:00 PM - 4:50 PM',
    'TE2': 'Thursday 5:00 PM - 5:50 PM', 'TCC2': 'Thursday 6:00 PM - 6:50 PM',
    'V6': 'Thursday 7:01 PM - 7:50 PM',

    # Friday Slots
    'E1': 'Friday 8:00 AM - 8:50 AM', 'L25': 'Friday 8:00 AM - 8:50 AM',
    'C1': 'Friday 9:00 AM - 9:50 AM', 'L26': 'Friday 8:51 AM - 9:40 AM',
    'TA1': 'Friday 10:00 AM - 10:50 AM', 'L27': 'Friday 9:51 AM - 10:40 AM',
    'TF1': 'Friday 11:00 AM - 11:50 AM', 'L28': 'Friday 10:41 AM - 11:30 AM',
    'TD1': 'Friday 12:00 PM - 12:50 PM', 'L29': 'Friday 11:40 AM - 12:30 PM',
    'L30': 'Friday 12:31 PM - 1:20 PM', 'E2': 'Friday 2:00 PM - 2:50 PM',
    'C2': 'Friday 3:00 PM - 3:50 PM', 'TA2': 'Friday 4:00 PM - 4:50 PM',
    'TF2': 'Friday 5:00 PM - 5:50 PM', 'TDD2': 'Friday 6:00 PM - 6:50 PM',
    'V7': 'Friday 7:01 PM - 7:50 PM'
}

def update_availability(file_path):
    # Connect to MongoDB
    client = MongoClient("mongodb+srv://nanmaran:nanmaran@cluster0.hosdr.mongodb.net/authDB?retryWrites=true&w=majority")
    db = client["authDB"]
    collection = db["availability"]

    # Read Excel filee
    df = pd.read_excel(file_path)

    # Filter and clean data
    df = df[['ROOM NUMBER', 'SLOT']]
    df = df[(df['ROOM NUMBER'] != 'NIL') & (df['SLOT'] != 'NIL')]
    df = df.dropna(subset=['ROOM NUMBER', 'SLOT'])

    # Expand '+' slots
    df_expanded = df.assign(SLOT=df['SLOT'].str.split('+')).explode('SLOT')

    # Map slots to timings
    df_expanded['Slot Timings'] = df_expanded['SLOT'].map(slot_mapping)
    df_expanded = df_expanded.dropna(subset=['Slot Timings'])

    # All possible slots for rooms
    rooms = df_expanded['ROOM NUMBER'].unique()
    all_slots = pd.DataFrame([(room, slot, slot_mapping[slot])
                              for room in rooms
                              for slot in slot_mapping.keys()],
                             columns=['ROOM NUMBER', 'SLOT', 'Slot Timings'])

    # Find available slots
    available_slots = pd.merge(all_slots, df_expanded, on=['ROOM NUMBER', 'SLOT'], how='left', indicator=True)
    available_slots = available_slots[available_slots['_merge'] == 'left_only'].drop(columns=['_merge', 'Slot Timings_y'])
    available_slots.rename(columns={'Slot Timings_x': 'Slot Timings'}, inplace=True)

    # Convert to JSON
    available_slots_json = available_slots.to_dict(orient='records')

    # Update MongoDB
    collection.delete_many({})
    collection.insert_many(available_slots_json)

    return {
        "message": "Availability data updated successfully",
        "count": len(available_slots_json)
    }

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Usage: python app.py <file_path>"}))
        sys.exit(1)

    file_path = sys.argv[1]
    result = update_availability(file_path)

    # ✅ Proper JSON output so Node.js can parse it
    print(json.dumps(result))
