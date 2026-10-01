const mapData = [

    {
        id: 0,
        type: "asset",
        typeIds: [0],
        next: [30],
        x: 1080,
        y: 945
    },

    {
        id: 1,
        type: "money",
        next: [3],
        x: 1200,
        y: 945
    },

    {
        id: 3,
        type: "asset",
        typeIds: [2],
        next: [137, 5],
        x: 1512,
        y: 945
    },

    {
        id: 5,
        type: "treasure",
        treasureBoxId: 0,
        next: [89, 12],
        x: 1730,
        y: 945
    },

    {
        id: 7,
        type: "monster",
        next: [1, 16],
        x: 1200,
        y: 780
    },

    {
        id: 12,
        type: "treasure",
        treasureBoxId: 0,
        next: [14, 95, 22],
        x: 1730,
        y: 700
    },

    {
        id: 14,
        type: "monster",
        next: [21],
        x: 1565,
        y: 700
    },

    {
        id: 16,
        type: "asset",
        typeIds: [0],
        next: [44],
        x: 1200,
        y: 660
    },

    {
        id: 21,
        type: "money",
        next: [22, 27],
        x: 1565,
        y: 545
    },

    {
        id: 22,
        type: "asset",
        typeIds: [0],
        next: [],
        x: 1730,
        y: 545
    },

    {
        id: 24,
        type: "asset",
        typeIds: [0],
        next: [25],
        x: 1080,
        y: 436
    },

    {
        id: 25,
        type: "asset",
        typeIds: [0],
        next: [26],
        x: 1231,
        y: 436
    },

    {
        id: 26,
        type: "treasure",
        treasureBoxId: 0,
        next: [27],
        x: 1402,
        y: 436
    },

    {
        id: 27,
        type: "monster",
        next: [],
        x: 1565,
        y: 436
    },

    {
        id: 30,
        type: "shop",
        typeId: 0,
        next: [35],
        x: 936,
        y: 945
    },

    {
        id: 34,
        type: "monster",
        next: [40, 159],
        x: 360,
        y: 900
    },

    {
        id: 35,
        type: "asset",
        typeIds: [0],
        next: [44],
        x: 936,
        y: 780
    },

    {
        id: 40,
        type: "treasure",
        treasureBoxId: 1,
        next: [41, 49],
        x: 360,
        y: 660
    },

    {
        id: 41,
        type: "treasure",
        treasureBoxId: 0,
        next: [42, 48],
        x: 504,
        y: 660
    },

    {
        id: 42,
        type: "job",
        jobId: 1,
        next: [43],
        x: 648,
        y: 660
    },

    {
        id: 43,
        type: "money",
        next: [44],
        x: 792,
        y: 660
    },

    {
        id: 44,
        type: "money",
        next: [],
        x: 936,
        y: 660
    },

    {
        id: 45,
        type: "treasure",
        treasureBoxId: 4,
        next: [50],
        x: 936,
        y: 540
    },

    {
        id: 47,
        type: "monster",
        next: [48, 52],
        x: 648,
        y: 540
    },

    {
        id: 48,
        type: "asset",
        typeIds: [0],
        next: [49],
        x: 504,
        y: 540
    },

    {
        id: 49,
        type: "asset",
        typeIds: [0],
        next: [],
        x: 360,
        y: 540
    },

    {
        id: 50,
        type: "worst",
        next: [51],
        x: 936,
        y: 420
    },

    {
        id: 51,
        type: "monster",
        next: [52],
        x: 792,
        y: 420
    },

    {
        id: 52,
        type: "worst",
        next: [],
        x: 648,
        y: 420
    },

    {
        id: 55,
        type: "money",
        next: [56, 61, 85, 189],
        x: 2664,
        y: 900
    },

    {
        id: 56,
        type: "money",
        next: [57, 62],
        x: 2808,
        y: 900
    },

    {
        id: 57,
        type: "job",
        jobId: 1,
        next: [58],
        x: 2952,
        y: 900
    },

    {
        id: 58,
        type: "asset",
        typeIds: [0],
        next: [59],
        x: 3096,
        y: 900
    },

    {
        id: 59,
        type: "worst",
        next: [60],
        x: 3240,
        y: 900
    },

    {
        id: 60,
        type: "monster",
        next: [66, 194],
        x: 3384,
        y: 900
    },

    {
        id: 61,
        type: "monster",
        next: [72],
        x: 2664,
        y: 780
    },

    {
        id: 62,
        type: "magic_shop",
        typeId: 1,
        next: [63],
        x: 2808,
        y: 780
    },

    {
        id: 63,
        type: "monster",
        next: [64],
        x: 2952,
        y: 780
    },

    {
        id: 64,
        type: "shop",
        typeId: 1,
        next: [65],
        x: 3096,
        y: 780
    },

    {
        id: 65,
        type: "treasure",
        treasureBoxId: 1,
        next: [66],
        x: 3240,
        y: 780
    },

    {
        id: 66,
        type: "asset",
        typeIds: [0],
        next: [67],
        x: 3384,
        y: 780
    },

    {
        id: 67,
        type: "monster",
        next: [68, 78],
        x: 3384,
        y: 660
    },

    {
        id: 68,
        type: "money",
        next: [69],
        x: 3240,
        y: 660
    },

    {
        id: 69,
        type: "job",
        jobId: 1,
        next: [70, 76],
        x: 3096,
        y: 660
    },

    {
        id: 70,
        type: "money",
        next: [71],
        x: 2952,
        y: 660
    },

    {
        id: 71,
        type: "shop",
        typeId: 1,
        next: [72],
        x: 2808,
        y: 660
    },

    {
        id: 72,
        type: "money",
        next: [73, 99],
        x: 2664,
        y: 660
    },

    {
        id: 73,
        type: "monster",
        next: [74, 79],
        x: 2664,
        y: 540
    },

    {
        id: 74,
        type: "magic_shop",
        typeId: 1,
        next: [75, 80],
        x: 2808,
        y: 540
    },

    {
        id: 75,
        type: "treasure",
        treasureBoxId: 1,
        next: [76],
        x: 2952,
        y: 540
    },

    {
        id: 76,
        type: "job",
        jobId: 1,
        next: [77],
        x: 3096,
        y: 540
    },

    {
        id: 77,
        type: "money",
        next: [78],
        x: 3240,
        y: 540
    },

    {
        id: 78,
        type: "monster",
        next: [84],
        x: 3384,
        y: 540
    },

    {
        id: 79,
        type: "treasure",
        treasureBoxId: 1,
        next: [80, 105],
        x: 2664,
        y: 420
    },

    {
        id: 80,
        type: "money",
        next: [81],
        x: 2808,
        y: 420
    },

    {
        id: 81,
        type: "shop",
        typeId: 1,
        next: [82],
        x: 2952,
        y: 420
    },

    {
        id: 82,
        type: "monster",
        next: [83],
        x: 3096,
        y: 420
    },

    {
        id: 83,
        type: "shop",
        typeId: 1,
        next: [84],
        x: 3240,
        y: 420
    },

    {
        id: 84,
        type: "job",
        jobId: 1,
        next: [],
        x: 3384,
        y: 420
    },

    {
        id: 85,
        type: "money",
        next: [86, 90],
        x: 2520,
        y: 900
    },

    {
        id: 86,
        type: "monster",
        next: [87],
        x: 2376,
        y: 900
    },

    {
        id: 87,
        type: "job",
        jobId: 1,
        next: [92],
        x: 2232,
        y: 900
    },

    {
        id: 89,
        type: "job",
        jobId: 0,
        next: [219],
        x: 1944,
        y: 945
    },

    {
        id: 90,
        type: "monster",
        next: [99],
        x: 2520,
        y: 780
    },

    {
        id: 92,
        type: "money",
        next: [93],
        x: 2232,
        y: 780
    },

    {
        id: 93,
        type: "asset",
        typeIds: [0],
        next: [],
        x: 2088,
        y: 780
    },

    {
        id: 95,
        type: "asset",
        typeIds: [0],
        next: [104],
        x: 1944,
        y: 700
    },

    {
        id: 97,
        type: "job",
        jobId: 1,
        next: [98],
        x: 2232,
        y: 660
    },

    {
        id: 98,
        type: "shop",
        typeId: 1,
        next: [99],
        x: 2376,
        y: 660
    },

    {
        id: 99,
        type: "money",
        next: [100],
        x: 2520,
        y: 660
    },

    {
        id: 100,
        type: "magic_shop",
        typeId: 1,
        next: [101, 105],
        x: 2520,
        y: 540
    },

    {
        id: 101,
        type: "money",
        next: [102, 106],
        x: 2376,
        y: 540
    },

    {
        id: 102,
        type: "asset",
        typeIds: [0],
        next: [104],
        x: 2232,
        y: 540
    },

    {
        id: 104,
        type: "asset",
        typeIds: [0],
        next: [],
        x: 1944,
        y: 540
    },

    {
        id: 105,
        type: "treasure",
        treasureBoxId: 1,
        next: [79],
        x: 2520,
        y: 420
    },

    {
        id: 106,
        type: "job",
        jobId: 1,
        next: [105],
        x: 2376,
        y: 420
    },

    {
        id: 110,
        type: "money",
        next: [116, 140, 244],
        x: 1080,
        y: 1500
    },

    {
        id: 111,
        type: "money",
        next: [112, 245, 334],
        x: 1224,
        y: 1460
    },

    {
        id: 112,
        type: "monster",
        next: [113],
        x: 1370,
        y: 1460
    },

    {
        id: 113,
        type: "monster",
        next: [114],
        x: 1512,
        y: 1460
    },

    {
        id: 114,
        type: "money",
        next: [115],
        x: 1662,
        y: 1460
    },

    {
        id: 115,
        type: "money",
        next: [249, 133],
        x: 1800,
        y: 1459
    },

    {
        id: 116,
        type: "monster",
        next: [127],
        x: 1080,
        y: 1380
    },

    {
        id: 127,
        type: "money",
        next: [128, 154],
        x: 1053,
        y: 1252
    },

    {
        id: 128,
        type: "monster",
        next: [129],
        x: 1054,
        y: 1100
    },

    {
        id: 129,
        type: "magic_shop",
        typeId: 1,
        next: [137],
        x: 1228,
        y: 1100
    },

    {
        id: 132,
        type: "money",
        next: [133, 138],
        x: 1656,
        y: 1210
    },

    {
        id: 133,
        type: "job",
        jobId: 1,
        next: [139, 214],
        x: 1800,
        y: 1210
    },

    {
        id: 137,
        type: "job",
        jobId: 0,
        next: [],
        x: 1512,
        y: 1100
    },

    {
        id: 138,
        type: "shop",
        typeId: 1,
        next: [139, 137],
        x: 1656,
        y: 1100
    },

    {
        id: 139,
        type: "start",
        next: [219],
        x: 1800,
        y: 1100
    },

    {
        id: 140,
        type: "money",
        next: [145, 142],
        x: 936,
        y: 1500
    },

    {
        id: 142,
        type: "monster",
        next: [143, 147],
        x: 691,
        y: 1500
    },

    {
        id: 143,
        type: "shop",
        typeId: 1,
        next: [144, 273],
        x: 500,
        y: 1500
    },

    {
        id: 144,
        type: "monster",
        next: [269],
        x: 360,
        y: 1500
    },

    {
        id: 145,
        type: "monster",
        next: [154],
        x: 936,
        y: 1380
    },

    {
        id: 147,
        type: "money",
        next: [152],
        x: 691,
        y: 1380
    },

    {
        id: 150,
        type: "money",
        next: [151, 159],
        x: 360,
        y: 1260
    },

    {
        id: 151,
        type: "monster",
        next: [152, 158],
        x: 500,
        y: 1260
    },

    {
        id: 152,
        type: "job",
        jobId: 1,
        next: [157],
        x: 691,
        y: 1260
    },

    {
        id: 154,
        type: "money",
        next: [],
        x: 936,
        y: 1260
    },

    {
        id: 155,
        type: "magic_shop",
        typeId: 1,
        next: [157],
        x: 936,
        y: 1100
    },

    {
        id: 157,
        type: "money",
        next: [158],
        x: 691,
        y: 1100
    },

    {
        id: 158,
        type: "worst",
        next: [159],
        x: 500,
        y: 1100
    },

    {
        id: 159,
        type: "monster",
        next: [],
        x: 360,
        y: 1100
    },

    {
        id: 165,
        type: "money",
        next: [166, 171, 195],
        x: 2664,
        y: 1500
    },

    {
        id: 166,
        type: "money",
        next: [167, 172],
        x: 2808,
        y: 1500
    },

    {
        id: 167,
        type: "job",
        jobId: 1,
        next: [168],
        x: 2952,
        y: 1500
    },

    {
        id: 168,
        type: "asset",
        typeIds: [1],
        next: [169],
        x: 3096,
        y: 1500
    },

    {
        id: 169,
        type: "worst",
        next: [170],
        x: 3240,
        y: 1500
    },

    {
        id: 170,
        type: "monster",
        next: [176, 304],
        x: 3384,
        y: 1500
    },

    {
        id: 171,
        type: "monster",
        next: [182],
        x: 2664,
        y: 1380
    },

    {
        id: 172,
        type: "magic_shop",
        typeId: 1,
        next: [173],
        x: 2808,
        y: 1380
    },

    {
        id: 173,
        type: "monster",
        next: [174],
        x: 2952,
        y: 1380
    },

    {
        id: 174,
        type: "shop",
        typeId: 1,
        next: [175],
        x: 3096,
        y: 1380
    },

    {
        id: 175,
        type: "treasure",
        treasureBoxId: 1,
        next: [176],
        x: 3240,
        y: 1380
    },

    {
        id: 176,
        type: "asset",
        typeIds: [1],
        next: [177],
        x: 3384,
        y: 1380
    },

    {
        id: 177,
        type: "monster",
        next: [178, 188],
        x: 3384,
        y: 1260
    },

    {
        id: 178,
        type: "money",
        next: [179],
        x: 3240,
        y: 1260
    },

    {
        id: 179,
        type: "job",
        jobId: 1,
        next: [180, 186],
        x: 3096,
        y: 1260
    },

    {
        id: 180,
        type: "money",
        next: [181],
        x: 2952,
        y: 1260
    },

    {
        id: 181,
        type: "shop",
        typeId: 1,
        next: [182],
        x: 2808,
        y: 1260
    },

    {
        id: 182,
        type: "money",
        next: [183, 209],
        x: 2664,
        y: 1260
    },

    {
        id: 183,
        type: "monster",
        next: [184, 189],
        x: 2664,
        y: 1140
    },

    {
        id: 184,
        type: "magic_shop",
        typeId: 1,
        next: [185, 190],
        x: 2808,
        y: 1140
    },

    {
        id: 185,
        type: "treasure",
        treasureBoxId: 1,
        next: [186],
        x: 2952,
        y: 1140
    },

    {
        id: 186,
        type: "job",
        jobId: 1,
        next: [187],
        x: 3096,
        y: 1140
    },

    {
        id: 187,
        type: "money",
        next: [188],
        x: 3240,
        y: 1140
    },

    {
        id: 188,
        type: "monster",
        next: [194],
        x: 3384,
        y: 1140
    },

    {
        id: 189,
        type: "treasure",
        treasureBoxId: 1,
        next: [190, 215],
        x: 2664,
        y: 1020
    },

    {
        id: 190,
        type: "money",
        next: [191],
        x: 2808,
        y: 1020
    },

    {
        id: 191,
        type: "shop",
        typeId: 1,
        next: [192],
        x: 2952,
        y: 1020
    },

    {
        id: 192,
        type: "monster",
        next: [193],
        x: 3096,
        y: 1020
    },

    {
        id: 193,
        type: "shop",
        typeId: 1,
        next: [194],
        x: 3240,
        y: 1020
    },

    {
        id: 194,
        type: "job",
        jobId: 1,
        next: [],
        x: 3384,
        y: 1020
    },

    {
        id: 195,
        type: "money",
        next: [196, 200],
        x: 2520,
        y: 1500
    },

    {
        id: 196,
        type: "monster",
        next: [197],
        x: 2376,
        y: 1500
    },

    {
        id: 197,
        type: "job",
        jobId: 1,
        next: [198, 202],
        x: 2232,
        y: 1500
    },

    {
        id: 198,
        type: "shop",
        typeId: 1,
        next: [],
        x: 2088,
        y: 1500
    },

    {
        id: 200,
        type: "monster",
        next: [201, 209],
        x: 2520,
        y: 1380
    },

    {
        id: 201,
        type: "magic_shop",
        typeId: 1,
        next: [202],
        x: 2376,
        y: 1380
    },

    {
        id: 202,
        type: "money",
        next: [203],
        x: 2232,
        y: 1380
    },

    {
        id: 203,
        type: "asset",
        typeIds: [1],
        next: [204],
        x: 2088,
        y: 1380
    },

    {
        id: 204,
        type: "treasure",
        treasureBoxId: 1,
        next: [],
        x: 1944,
        y: 1380
    },

    {
        id: 207,
        type: "job",
        jobId: 1,
        next: [208],
        x: 2232,
        y: 1260
    },

    {
        id: 208,
        type: "shop",
        typeId: 1,
        next: [209],
        x: 2376,
        y: 1260
    },

    {
        id: 209,
        type: "money",
        next: [210],
        x: 2520,
        y: 1260
    },

    {
        id: 210,
        type: "magic_shop",
        typeId: 1,
        next: [211, 215],
        x: 2520,
        y: 1140
    },

    {
        id: 211,
        type: "money",
        next: [216],
        x: 2376,
        y: 1140
    },

    {
        id: 214,
        type: "magic_shop",
        typeId: 1,
        next: [219],
        x: 1944,
        y: 1210
    },

    {
        id: 215,
        type: "treasure",
        treasureBoxId: 1,
        next: [189],
        x: 2520,
        y: 1020
    },

    {
        id: 216,
        type: "job",
        jobId: 1,
        next: [215],
        x: 2376,
        y: 1020
    },

    {
        id: 217,
        type: "asset",
        typeIds: [1],
        next: [216],
        x: 2258,
        y: 1096
    },

    {
        id: 218,
        type: "job",
        jobId: 3,
        next: [217],
        x: 2098,
        y: 1102
    },

    {
        id: 219,
        type: "money",
        next: [218],
        x: 1944,
        y: 1100
    },

    {
        id: 220,
        type: "asset",
        typeIds: [0],
        next: [221, 226],
        x: 1080,
        y: 2100
    },

    {
        id: 221,
        type: "asset",
        typeIds: [0],
        next: [222, 227],
        x: 1224,
        y: 2100
    },

    {
        id: 222,
        type: "job",
        jobId: 1,
        next: [223],
        x: 1368,
        y: 2100
    },

    {
        id: 223,
        type: "asset",
        typeIds: [1],
        next: [224],
        x: 1512,
        y: 2100
    },

    {
        id: 224,
        type: "worst",
        next: [225],
        x: 1656,
        y: 2100
    },

    {
        id: 225,
        type: "monster",
        next: [231, 309],
        x: 1800,
        y: 2100
    },

    {
        id: 226,
        type: "shop",
        typeId: 0,
        next: [237],
        x: 1080,
        y: 1980
    },

    {
        id: 227,
        type: "magic_shop",
        typeId: 1,
        next: [228],
        x: 1224,
        y: 1980
    },

    {
        id: 228,
        type: "asset",
        typeIds: [0],
        next: [229],
        x: 1368,
        y: 1980
    },

    {
        id: 229,
        type: "shop",
        typeId: 1,
        next: [230],
        x: 1512,
        y: 1980
    },

    {
        id: 230,
        type: "treasure",
        treasureBoxId: 1,
        next: [231],
        x: 1656,
        y: 1980
    },

    {
        id: 231,
        type: "asset",
        typeIds: [1],
        next: [232],
        x: 1800,
        y: 1980
    },

    {
        id: 232,
        type: "monster",
        next: [233, 243],
        x: 1800,
        y: 1860
    },

    {
        id: 233,
        type: "money",
        next: [234],
        x: 1656,
        y: 1860
    },

    {
        id: 234,
        type: "job",
        jobId: 1,
        next: [235, 241],
        x: 1512,
        y: 1860
    },

    {
        id: 235,
        type: "money",
        next: [236],
        x: 1368,
        y: 1860
    },

    {
        id: 236,
        type: "shop",
        typeId: 1,
        next: [237],
        x: 1224,
        y: 1860
    },

    {
        id: 237,
        type: "money",
        next: [238, 264],
        x: 1080,
        y: 1860
    },

    {
        id: 238,
        type: "monster",
        next: [239, 244],
        x: 1080,
        y: 1740
    },

    {
        id: 239,
        type: "magic_shop",
        typeId: 1,
        next: [240, 245],
        x: 1224,
        y: 1740
    },

    {
        id: 240,
        type: "treasure",
        treasureBoxId: 1,
        next: [241],
        x: 1368,
        y: 1740
    },

    {
        id: 241,
        type: "job",
        jobId: 1,
        next: [242],
        x: 1512,
        y: 1740
    },

    {
        id: 242,
        type: "money",
        next: [243],
        x: 1656,
        y: 1740
    },

    {
        id: 243,
        type: "monster",
        next: [249],
        x: 1800,
        y: 1740
    },

    {
        id: 244,
        type: "treasure",
        treasureBoxId: 1,
        next: [245, 270],
        x: 1080,
        y: 1620
    },

    {
        id: 245,
        type: "money",
        next: [246],
        x: 1224,
        y: 1620
    },

    {
        id: 246,
        type: "shop",
        typeId: 1,
        next: [247],
        x: 1368,
        y: 1620
    },

    {
        id: 247,
        type: "monster",
        next: [248],
        x: 1512,
        y: 1620
    },

    {
        id: 248,
        type: "shop",
        typeId: 1,
        next: [249],
        x: 1656,
        y: 1620
    },

    {
        id: 249,
        type: "shop",
        typeId: 0,
        next: [329],
        x: 1800,
        y: 1620
    },

    {
        id: 253,
        type: "worst",
        next: [254, 257],
        x: 500,
        y: 1980
    },

    {
        id: 254,
        type: "monster",
        next: [260],
        x: 360,
        y: 1980
    },

    {
        id: 255,
        type: "monster",
        next: [256, 264],
        x: 936,
        y: 1980
    },

    {
        id: 256,
        type: "magic_shop",
        typeId: 1,
        next: [257],
        x: 792,
        y: 1980
    },

    {
        id: 257,
        type: "money",
        next: [],
        x: 648,
        y: 1980
    },

    {
        id: 260,
        type: "job",
        jobId: 3,
        next: [261, 269],
        x: 360,
        y: 1860
    },

    {
        id: 261,
        type: "monster",
        next: [262, 268],
        x: 500,
        y: 1860
    },

    {
        id: 262,
        type: "treasure",
        treasureBoxId: 1,
        next: [263, 257],
        x: 648,
        y: 1860
    },

    {
        id: 263,
        type: "treasure",
        treasureBoxId: 1,
        next: [264, 266],
        x: 792,
        y: 1860
    },

    {
        id: 264,
        type: "money",
        next: [265],
        x: 936,
        y: 1860
    },

    {
        id: 265,
        type: "magic_shop",
        typeId: 1,
        next: [266, 270],
        x: 936,
        y: 1740
    },

    {
        id: 266,
        type: "money",
        next: [271, 268],
        x: 792,
        y: 1740
    },

    {
        id: 268,
        type: "worst",
        next: [269, 273],
        x: 500,
        y: 1740
    },

    {
        id: 269,
        type: "monster",
        next: [],
        x: 360,
        y: 1740
    },

    {
        id: 270,
        type: "treasure",
        treasureBoxId: 1,
        next: [271],
        x: 936,
        y: 1620
    },

    {
        id: 271,
        type: "job",
        jobId: 1,
        next: [272],
        x: 792,
        y: 1620
    },

    {
        id: 272,
        type: "asset",
        typeIds: [1],
        next: [273],
        x: 648,
        y: 1620
    },

    {
        id: 273,
        type: "shop",
        typeId: 1,
        next: [],
        x: 500,
        y: 1620
    },

    {
        id: 275,
        type: "money",
        next: [281, 305],
        x: 2664,
        y: 2100
    },

    {
        id: 277,
        type: "job",
        jobId: 1,
        next: [],
        x: 2952,
        y: 2100
    },

    {
        id: 280,
        type: "monster",
        next: [286],
        x: 3384,
        y: 2100
    },

    {
        id: 281,
        type: "monster",
        next: [292],
        x: 2664,
        y: 1980
    },

    {
        id: 282,
        type: "magic_shop",
        typeId: 1,
        next: [283],
        x: 2808,
        y: 1980
    },

    {
        id: 283,
        type: "monster",
        next: [284],
        x: 2952,
        y: 1980
    },

    {
        id: 284,
        type: "shop",
        typeId: 1,
        next: [285],
        x: 3096,
        y: 1980
    },

    {
        id: 285,
        type: "treasure",
        treasureBoxId: 1,
        next: [286],
        x: 3240,
        y: 1980
    },

    {
        id: 286,
        type: "money",
        next: [287],
        x: 3384,
        y: 1980
    },

    {
        id: 287,
        type: "monster",
        next: [288, 298],
        x: 3384,
        y: 1860
    },

    {
        id: 288,
        type: "money",
        next: [289],
        x: 3240,
        y: 1860
    },

    {
        id: 289,
        type: "job",
        jobId: 1,
        next: [290, 296],
        x: 3096,
        y: 1860
    },

    {
        id: 290,
        type: "money",
        next: [291],
        x: 2952,
        y: 1860
    },

    {
        id: 291,
        type: "shop",
        typeId: 1,
        next: [292],
        x: 2808,
        y: 1860
    },

    {
        id: 292,
        type: "money",
        next: [293, 319],
        x: 2664,
        y: 1860
    },

    {
        id: 293,
        type: "monster",
        next: [294],
        x: 2664,
        y: 1740
    },

    {
        id: 294,
        type: "magic_shop",
        typeId: 1,
        next: [295, 300],
        x: 2808,
        y: 1740
    },

    {
        id: 295,
        type: "treasure",
        treasureBoxId: 1,
        next: [296],
        x: 2952,
        y: 1740
    },

    {
        id: 296,
        type: "job",
        jobId: 1,
        next: [297],
        x: 3096,
        y: 1740
    },

    {
        id: 297,
        type: "money",
        next: [298],
        x: 3240,
        y: 1740
    },

    {
        id: 298,
        type: "monster",
        next: [304],
        x: 3384,
        y: 1740
    },

    {
        id: 300,
        type: "money",
        next: [301],
        x: 2808,
        y: 1620
    },

    {
        id: 301,
        type: "shop",
        typeId: 1,
        next: [],
        x: 2952,
        y: 1620
    },

    {
        id: 303,
        type: "shop",
        typeId: 1,
        next: [304],
        x: 3240,
        y: 1620
    },

    {
        id: 304,
        type: "job",
        jobId: 1,
        next: [],
        x: 3384,
        y: 1620
    },

    {
        id: 305,
        type: "money",
        next: [310],
        x: 2520,
        y: 2100
    },

    {
        id: 309,
        type: "monster",
        next: [314],
        x: 1944,
        y: 2100
    },

    {
        id: 310,
        type: "monster",
        next: [311, 319],
        x: 2520,
        y: 1980
    },

    {
        id: 311,
        type: "magic_shop",
        typeId: 1,
        next: [312],
        x: 2376,
        y: 1980
    },

    {
        id: 312,
        type: "money",
        next: [313],
        x: 2232,
        y: 1980
    },

    {
        id: 313,
        type: "money",
        next: [314],
        x: 2088,
        y: 1980
    },

    {
        id: 314,
        type: "treasure",
        treasureBoxId: 1,
        next: [315],
        x: 1944,
        y: 1980
    },

    {
        id: 315,
        type: "money",
        next: [316, 324],
        x: 1944,
        y: 1860
    },

    {
        id: 316,
        type: "monster",
        next: [317, 323],
        x: 2088,
        y: 1860
    },

    {
        id: 317,
        type: "job",
        jobId: 1,
        next: [318],
        x: 2232,
        y: 1860
    },

    {
        id: 318,
        type: "shop",
        typeId: 1,
        next: [319],
        x: 2376,
        y: 1860
    },

    {
        id: 319,
        type: "money",
        next: [320],
        x: 2520,
        y: 1860
    },

    {
        id: 320,
        type: "magic_shop",
        typeId: 1,
        next: [321, 325],
        x: 2520,
        y: 1740
    },

    {
        id: 321,
        type: "money",
        next: [322],
        x: 2376,
        y: 1740
    },

    {
        id: 322,
        type: "money",
        next: [323],
        x: 2232,
        y: 1740
    },

    {
        id: 323,
        type: "worst",
        next: [324],
        x: 2088,
        y: 1740
    },

    {
        id: 324,
        type: "monster",
        next: [329],
        x: 1944,
        y: 1740
    },

    {
        id: 325,
        type: "treasure",
        treasureBoxId: 1,
        next: [],
        x: 2520,
        y: 1620
    },

    {
        id: 327,
        type: "money",
        next: [],
        x: 2232,
        y: 1620
    },

    {
        id: 328,
        type: "shop",
        typeId: 1,
        next: [327],
        x: 2088,
        y: 1620
    },

    {
        id: 329,
        type: "monster",
        next: [328],
        x: 1944,
        y: 1620
    },

    {
        id: 334,
        type: "job",
        jobId: 4,
        next: [],
        x: 1224,
        y: 1331
    }

];
