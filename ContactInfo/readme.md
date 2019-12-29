GET TELEMETRY DATA

http://localhost:7071/api/ContactInfo (GET)
BODY (APPLICATION/JSON)
{
"key": {
"container": "telemetry",
"pid": "Web-Client-1"
}
}

http://localhost:7071/api/ContactInfo (POST)
BODY (APPLICATION/JSON)
{
"key": {
"container": "telemetry",
"pid": "Web-Client-1"
},
"value": {
"deviceId": "Web-Client-1",
"id": "Web-Client-1",
"version": 1,
"contact": [
{
"name": "Young DK",
"email": "kyoungd@yahoo.com",
"isEmail": true
},
{
"name": "Gum JK",
"email": "kyoungd@aol.com",
"isEmail": true
}
],
"alert": {
"temperature_max": 105,
"temperature_min": 97,
"temperature_change": 5,
"heartrate_max": 120,
"heartrate_min": 50,
"heartrate_change": 20,
"systolic_max": 150,
"systolic_min": 80,
"syslolic_change": 50,
"diastolic_max": 100,
"diastolic_min": 50,
"diastolic_change": 40,
"bloodoxygen_max": 100,
"bloodoxygen_min": 94,
"bloodoxygen_change": 5,
"bloodsugar_max": 0,
"bloodsugar_min": 0,
"bloodsugar_change": 0
},
"data": [
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191107",
"count": 16,
"temperature": 431.8086546589413,
"humidity": 1149.034602238958,
"heartrate": 1149.034602238958,
"systolic": 1869.0346022389579,
"diastolic": 1309.0346022389579,
"bloodoxygen": 1693.0346022389579
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191108",
"count": 14,
"temperature": 376.31234743206227,
"humidity": 992.1896301066707,
"heartrate": 992.1896301066707,
"systolic": 1622.1896301066708,
"diastolic": 1132.1896301066708,
"bloodoxygen": 1468.1896301066706
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191109",
"count": 48,
"temperature": 1273.6916338216365,
"humidity": 3337.6229114635603,
"heartrate": 3337.6229114635603,
"systolic": 5497.62291146356,
"diastolic": 3817.6229114635603,
"bloodoxygen": 4969.622911463561
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191110",
"count": 48,
"temperature": 1282.757262537852,
"humidity": 3332.8657609104876,
"heartrate": 3332.8657609104876,
"systolic": 5492.865760910487,
"diastolic": 3812.8657609104866,
"bloodoxygen": 4964.865760910486
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191111",
"count": 13,
"temperature": 349.9867949697889,
"humidity": 934.8764445948874,
"heartrate": 934.8764445948874,
"systolic": 1519.8764445948875,
"diastolic": 1064.8764445948875,
"bloodoxygen": 1376.8764445948873
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191112",
"count": 19,
"temperature": 491.705169124205,
"humidity": 1309.0690425288008,
"heartrate": 1309.0690425288008,
"systolic": 2164.0690425288008,
"diastolic": 1499.0690425288008,
"bloodoxygen": 1955.0690425288008
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191113",
"count": 31,
"temperature": 824.8505617228809,
"humidity": 2156.9742928462765,
"heartrate": 2156.9742928462765,
"systolic": 3551.974292846276,
"diastolic": 2466.974292846277,
"bloodoxygen": 3210.974292846276
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191114",
"count": 8,
"temperature": 203.58572588586676,
"humidity": 572.2048100044923,
"heartrate": 572.2048100044923,
"systolic": 932.2048100044924,
"diastolic": 652.2048100044924,
"bloodoxygen": 844.2048100044924
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191224",
"count": 24,
"temperature": 611.1963037553587,
"humidity": 1640.8281435475396,
"heartrate": 1640.8281435475396,
"systolic": 2720.8281435475396,
"diastolic": 1880.8281435475396,
"bloodoxygen": 2456.82814354754
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191226",
"count": 7,
"temperature": 171.9663011613584,
"humidity": 508.83916254494676,
"heartrate": 508.83916254494676,
"systolic": 823.8391625449468,
"diastolic": 578.8391625449468,
"bloodoxygen": 746.8391625449468
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191227",
"count": 11,
"temperature": 275.6758606889164,
"humidity": 765.2378780819524,
"heartrate": 765.2378780819524,
"systolic": 1260.2378780819527,
"diastolic": 875.2378780819527,
"bloodoxygen": 1139.2378780819527
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191228",
"count": 7,
"temperature": 180.97728745391817,
"humidity": 502.00095257011634,
"heartrate": 502.00095257011634,
"systolic": 817.0009525701164,
"diastolic": 572.0009525701164,
"bloodoxygen": 740.0009525701164
},
{
"deviceId": "Web-Client-1",
"count": 24,
"temperature": 611.1963037553587,
"humidity": 1640.8281435475396,
"heartrate": 1640.8281435475396,
"systolic": 2720.8281435475396,
"diastolic": 1880.8281435475396,
"bloodoxygen": 2456.82814354754
}
]
}
}

http://localhost:7071/api/ContactInfo
{
"key": {
"container": "care_taker",
"pid": "2434e485-f725-4e2a-ad45-f0b38fb287da"
}
}

http://localhost:7071/api/ContactInfo
{
"key": {
"container": "care_taker",
"pid": "2434e485-f725-4e2a-ad45-f0b38fb287da"
},
"value":{
"id": "2434e485-f725-4e2a-ad45-f0b38fb287da",
"careTakerId": "2434e485-f725-4e2a-ad45-f0b38fb287da",
"contact": {
"name": "Young Kw",
"email": "kyoungd@yahoo.com",
"phone": "818-679-3565",
"isPush": true,
"isSMS": false,
"isEmail": true
},
"address": {
"zipCode": "91004",
"country": "USA"
},
"patients": [
{
"deviceId": "Web-Client-1",
"name": "Young K",
"alert": {
"temperature_max": 105,
"temperature_min": 97,
"temperature_change": 5,
"heartrate_max": 120,
"heartrate_min": 50,
"heartrate_change": 20,
"systolic_max": 150,
"systolic_min": 80,
"syslolic_change": 50,
"diastolic_max": 100,
"diastolic_min": 50,
"diastolic_change": 40,
"bloodoxygen_max": 100,
"bloodoxygen_min": 94,
"bloodoxygen_change": 5,
"bloodsugar_max": 0,
"bloodsugar_min": 0,
"bloodsugar_change": 0
},
"data": [
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191220",
"count": 13,
"temperature": 349.98679496978889,
"humidity": 934.8764445948874,
"heartrate": 934.8764445948874,
"systolic": 1519.8764445948875,
"diastolic": 1064.8764445948875,
"bloodoxygen": 1376.8764445948873
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191221",
"count": 19,
"temperature": 491.705169124205,
"humidity": 1309.0690425288008,
"heartrate": 1309.0690425288008,
"systolic": 2164.0690425288008,
"diastolic": 1499.0690425288008,
"bloodoxygen": 1955.0690425288008
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191222",
"count": 31,
"temperature": 824.85056172288091,
"humidity": 2156.9742928462765,
"heartrate": 2156.9742928462765,
"systolic": 3551.9742928462761,
"diastolic": 2466.974292846277,
"bloodoxygen": 3210.9742928462761
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191223",
"count": 8,
"temperature": 203.58572588586676,
"humidity": 572.20481000449229,
"heartrate": 572.20481000449229,
"systolic": 932.2048100044924,
"diastolic": 652.2048100044924,
"bloodoxygen": 844.2048100044924
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191224",
"count": 24,
"temperature": 611.19630375535871,
"humidity": 1640.8281435475396,
"heartrate": 1640.8281435475396,
"systolic": 2720.8281435475396,
"diastolic": 1880.8281435475396,
"bloodoxygen": 2456.82814354754
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191225",
"count": 16,
"temperature": 431.80865465894129,
"humidity": 1149.0346022389581,
"heartrate": 1149.0346022389581,
"systolic": 1869.0346022389579,
"diastolic": 1309.0346022389579,
"bloodoxygen": 1693.0346022389579
},
{
"deviceId": "Web-Client-1",
"eventDateOnly": "20191226",
"count": 7,
"temperature": 171.96630116135839,
"humidity": 508.83916254494676,
"heartrate": 508.83916254494676,
"systolic": 823.83916254494682,
"diastolic": 578.83916254494682,
"bloodoxygen": 746.83916254494682
}
]
}
]
}
}
