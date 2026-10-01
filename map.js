const mapData = [

    {
        id: 0,
        type: "money",
        next: [1, 6, 30, 134],
        x: 1080,
        y: 900
    },

    {
        id: 1,
        type: "money",
        next: [2, 7],
        x: 1224,
        y: 900
    },

    {
        id: 2,
        type: "job",
        jobId: 1,
        next: [3],
        x: 1368,
        y: 900
    },

    {
        id: 3,
        type: "asset",
        typeIds: [4],
        next: [4],
        x: 1512,
        y: 900
    },

    {
        id: 4,
        type: "worst",
        next: [5],
        x: 1656,
        y: 900
    },

    {
        id: 5,
        type: "monster",
        next: [11, 89, 139],
        x: 1800,
        y: 900
    },

    {
        id: 6,
        type: "monster",
        next: [17],
        x: 1080,
        y: 780
    },

    {
        id: 7,
        type: "magic_shop",
        typeId: 1,
        next: [8],
        x: 1224,
        y: 780
    },

    {
        id: 8,
        type: "monster",
        next: [9],
        x: 1368,
        y: 780
    },

    {
        id: 9,
        type: "shop",
        typeId: 1,
        next: [10],
        x: 1512,
        y: 780
    },

    {
        id: 10,
        type: "treasure",
        treasureBoxId: 1,
        next: [11],
        x: 1656,
        y: 780
    },

    {
        id: 11,
        type: "asset",
        typeIds: [3],
        next: [12],
        x: 1800,
        y: 780
    },

    {
        id: 12,
        type: "monster",
        next: [13, 23],
        x: 1800,
        y: 660
    },

    {
        id: 13,
        type: "money",
        next: [14],
        x: 1656,
        y: 660
    },

    {
        id: 14,
        type: "job",
        jobId: 2,
        next: [15, 21],
        x: 1512,
        y: 660
    },

    {
        id: 15,
        type: "money",
        next: [16],
        x: 1368,
        y: 660
    },

    {
        id: 16,
        type: "shop",
        typeId: 2,
        next: [17],
        x: 1224,
        y: 660
    },

    {
        id: 17,
        type: "start",
        next: [18, 44],
        x: 1080,
        y: 660
    },

    {
        id: 18,
        type: "monster",
        next: [19, 24],
        x: 1080,
        y: 540
    },

    {
        id: 19,
        type: "magic_shop",
        typeId: 2,
        next: [20, 25],
        x: 1224,
        y: 540
    },

    {
        id: 20,
        type: "treasure",
        treasureBoxId: 1,
        next: [21],
        x: 1368,
        y: 540
    },

    {
        id: 21,
        type: "job",
        jobId: 3,
        next: [22],
        x: 1512,
        y: 540
    },

    {
        id: 22,
        type: "money",
        next: [23],
        x: 1656,
        y: 540
    },

    {
        id: 23,
        type: "monster",
        next: [29],
        x: 1800,
        y: 540
    },

    {
        id: 24,
        type: "treasure",
        treasureBoxId: 1,
        next: [25, 50],
        x: 1080,
        y: 420
    },

    {
        id: 25,
        type: "money",
        next: [26],
        x: 1224,
        y: 420
    },

    {
        id: 26,
        type: "shop",
        typeId: 1,
        next: [27],
        x: 1368,
        y: 420
    },

    {
        id: 27,
        type: "monster",
        next: [28],
        x: 1512,
        y: 420
    },

    {
        id: 28,
        type: "shop",
        typeId: 2,
        next: [29],
        x: 1656,
        y: 420
    },

    {
        id: 29,
        type: "job",
        jobId: 4,
        next: [79],
        x: 1800,
        y: 420
    },

    {
        id: 30,
        type: "money",
        next: [31, 35],
        x: 936,
        y: 900
    },

    {
        id: 31,
        type: "monster",
        next: [32],
        x: 792,
        y: 900
    },

    {
        id: 32,
        type: "job",
        jobId: 1,
        next: [33, 37],
        x: 648,
        y: 900
    },

    {
        id: 33,
        type: "shop",
        typeId: 1,
        next: [34],
        x: 504,
        y: 900
    },

    {
        id: 34,
        type: "monster",
        next: [39],
        x: 360,
        y: 900
    },

    {
        id: 35,
        type: "monster",
        next: [36, 44],
        x: 936,
        y: 780
    },

    {
        id: 36,
        type: "magic_shop",
        typeId: 1,
        next: [37],
        x: 792,
        y: 780
    },

    {
        id: 37,
        type: "money",
        next: [38],
        x: 648,
        y: 780
    },

    {
        id: 38,
        type: "asset",
        typeIds: [2],
        next: [39],
        x: 504,
        y: 780
    },

    {
        id: 39,
        type: "treasure",
        treasureBoxId: 1,
        next: [40],
        x: 360,
        y: 780
    },

    {
        id: 40,
        type: "money",
        next: [41, 49],
        x: 360,
        y: 660
    },

    {
        id: 41,
        type: "monster",
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
        type: "shop",
        typeId: 1,
        next: [44],
        x: 792,
        y: 660
    },

    {
        id: 44,
        type: "money",
        next: [45],
        x: 936,
        y: 660
    },

    {
        id: 45,
        type: "magic_shop",
        typeId: 1,
        next: [46, 50],
        x: 936,
        y: 540
    },

    {
        id: 46,
        type: "money",
        next: [47, 51],
        x: 792,
        y: 540
    },

    {
        id: 47,
        type: "asset",
        typeIds: [1],
        next: [48],
        x: 648,
        y: 540
    },

    {
        id: 48,
        type: "worst",
        next: [49],
        x: 504,
        y: 540
    },

    {
        id: 49,
        type: "monster",
        next: [54],
        x: 360,
        y: 540
    },

    {
        id: 50,
        type: "treasure",
        treasureBoxId: 4,
        next: [51],
        x: 936,
        y: 420
    },

    {
        id: 51,
        type: "job",
        jobId: 1,
        next: [52],
        x: 792,
        y: 420
    },

    {
        id: 52,
        type: "asset",
        typeIds: [5],
        next: [53],
        x: 648,
        y: 420
    },

    {
        id: 53,
        type: "shop",
        typeId: 1,
        next: [54],
        x: 504,
        y: 420
    },

    {
        id: 54,
        type: "monster",
        next: [],
        x: 360,
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
        typeIds: [1],
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
        typeIds: [1],
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
        type: "start",
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
        next: [88, 92],
        x: 2232,
        y: 900
    },

    {
        id: 88,
        type: "shop",
        typeId: 1,
        next: [89],
        x: 2088,
        y: 900
    },

    {
        id: 89,
        type: "monster",
        next: [94],
        x: 1944,
        y: 900
    },

    {
        id: 90,
        type: "monster",
        next: [91, 99],
        x: 2520,
        y: 780
    },

    {
        id: 91,
        type: "magic_shop",
        typeId: 1,
        next: [92],
        x: 2376,
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
        typeIds: [1],
        next: [94],
        x: 2088,
        y: 780
    },

    {
        id: 94,
        type: "treasure",
        treasureBoxId: 1,
        next: [95],
        x: 1944,
        y: 780
    },

    {
        id: 95,
        type: "money",
        next: [96, 104],
        x: 1944,
        y: 660
    },

    {
        id: 96,
        type: "monster",
        next: [97, 103],
        x: 2088,
        y: 660
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
        typeIds: [1],
        next: [103],
        x: 2232,
        y: 540
    },

    {
        id: 103,
        type: "worst",
        next: [104],
        x: 2088,
        y: 540
    },

    {
        id: 104,
        type: "monster",
        next: [109],
        x: 1944,
        y: 540
    },

    {
        id: 105,
        type: "treasure",
        treasureBoxId: 1,
        next: [106],
        x: 2520,
        y: 420
    },

    {
        id: 106,
        type: "job",
        jobId: 1,
        next: [107],
        x: 2376,
        y: 420
    },

    {
        id: 107,
        type: "asset",
        typeIds: [1],
        next: [108],
        x: 2232,
        y: 420
    },

    {
        id: 108,
        type: "shop",
        typeId: 1,
        next: [109],
        x: 2088,
        y: 420
    },

    {
        id: 109,
        type: "monster",
        next: [],
        x: 1944,
        y: 420
    },

    {
        id: 110,
        type: "money",
        next: [111, 116, 140, 244],
        x: 1080,
        y: 1500
    },

    {
        id: 111,
        type: "money",
        next: [112, 117],
        x: 1224,
        y: 1500
    },

    {
        id: 112,
        type: "job",
        jobId: 1,
        next: [113],
        x: 1368,
        y: 1500
    },

    {
        id: 113,
        type: "asset",
        typeIds: [1],
        next: [114],
        x: 1512,
        y: 1500
    },

    {
        id: 114,
        type: "worst",
        next: [115],
        x: 1656,
        y: 1500
    },

    {
        id: 115,
        type: "monster",
        next: [121, 199, 249],
        x: 1800,
        y: 1500
    },

    {
        id: 116,
        type: "monster",
        next: [127],
        x: 1080,
        y: 1380
    },

    {
        id: 117,
        type: "magic_shop",
        typeId: 1,
        next: [118],
        x: 1224,
        y: 1380
    },

    {
        id: 118,
        type: "monster",
        next: [119],
        x: 1368,
        y: 1380
    },

    {
        id: 119,
        type: "shop",
        typeId: 1,
        next: [120],
        x: 1512,
        y: 1380
    },

    {
        id: 120,
        type: "treasure",
        treasureBoxId: 1,
        next: [121],
        x: 1656,
        y: 1380
    },

    {
        id: 121,
        type: "asset",
        typeIds: [1],
        next: [122],
        x: 1800,
        y: 1380
    },

    {
        id: 122,
        type: "monster",
        next: [123, 133],
        x: 1800,
        y: 1260
    },

    {
        id: 123,
        type: "money",
        next: [124],
        x: 1656,
        y: 1260
    },

    {
        id: 124,
        type: "job",
        jobId: 1,
        next: [125, 131],
        x: 1512,
        y: 1260
    },

    {
        id: 125,
        type: "money",
        next: [126],
        x: 1368,
        y: 1260
    },

    {
        id: 126,
        type: "shop",
        typeId: 1,
        next: [127],
        x: 1224,
        y: 1260
    },

    {
        id: 127,
        type: "start",
        next: [128, 154],
        x: 1080,
        y: 1260
    },

    {
        id: 128,
        type: "monster",
        next: [129, 134],
        x: 1080,
        y: 1140
    },

    {
        id: 129,
        type: "magic_shop",
        typeId: 1,
        next: [130, 135],
        x: 1224,
        y: 1140
    },

    {
        id: 130,
        type: "treasure",
        treasureBoxId: 1,
        next: [131],
        x: 1368,
        y: 1140
    },

    {
        id: 131,
        type: "job",
        jobId: 1,
        next: [132],
        x: 1512,
        y: 1140
    },

    {
        id: 132,
        type: "money",
        next: [133],
        x: 1656,
        y: 1140
    },

    {
        id: 133,
        type: "monster",
        next: [139],
        x: 1800,
        y: 1140
    },

    {
        id: 134,
        type: "treasure",
        treasureBoxId: 1,
        next: [135, 160],
        x: 1080,
        y: 1020
    },

    {
        id: 135,
        type: "money",
        next: [136],
        x: 1224,
        y: 1020
    },

    {
        id: 136,
        type: "shop",
        typeId: 1,
        next: [137],
        x: 1368,
        y: 1020
    },

    {
        id: 137,
        type: "monster",
        next: [138],
        x: 1512,
        y: 1020
    },

    {
        id: 138,
        type: "shop",
        typeId: 1,
        next: [139],
        x: 1656,
        y: 1020
    },

    {
        id: 139,
        type: "job",
        jobId: 1,
        next: [189],
        x: 1800,
        y: 1020
    },

    {
        id: 140,
        type: "money",
        next: [141, 145],
        x: 936,
        y: 1500
    },

    {
        id: 141,
        type: "monster",
        next: [142],
        x: 792,
        y: 1500
    },

    {
        id: 142,
        type: "job",
        jobId: 1,
        next: [143, 147],
        x: 648,
        y: 1500
    },

    {
        id: 143,
        type: "shop",
        typeId: 1,
        next: [144],
        x: 504,
        y: 1500
    },

    {
        id: 144,
        type: "monster",
        next: [149],
        x: 360,
        y: 1500
    },

    {
        id: 145,
        type: "monster",
        next: [146, 154],
        x: 936,
        y: 1380
    },

    {
        id: 146,
        type: "magic_shop",
        typeId: 1,
        next: [147],
        x: 792,
        y: 1380
    },

    {
        id: 147,
        type: "money",
        next: [148],
        x: 648,
        y: 1380
    },

    {
        id: 148,
        type: "asset",
        typeIds: [1],
        next: [149],
        x: 504,
        y: 1380
    },

    {
        id: 149,
        type: "treasure",
        treasureBoxId: 1,
        next: [150],
        x: 360,
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
        x: 504,
        y: 1260
    },

    {
        id: 152,
        type: "job",
        jobId: 1,
        next: [153],
        x: 648,
        y: 1260
    },

    {
        id: 153,
        type: "shop",
        typeId: 1,
        next: [154],
        x: 792,
        y: 1260
    },

    {
        id: 154,
        type: "money",
        next: [155],
        x: 936,
        y: 1260
    },

    {
        id: 155,
        type: "magic_shop",
        typeId: 1,
        next: [156, 160],
        x: 936,
        y: 1140
    },

    {
        id: 156,
        type: "money",
        next: [157, 161],
        x: 792,
        y: 1140
    },

    {
        id: 157,
        type: "asset",
        typeIds: [1],
        next: [158],
        x: 648,
        y: 1140
    },

    {
        id: 158,
        type: "worst",
        next: [159],
        x: 504,
        y: 1140
    },

    {
        id: 159,
        type: "monster",
        next: [164],
        x: 360,
        y: 1140
    },

    {
        id: 160,
        type: "treasure",
        treasureBoxId: 1,
        next: [161],
        x: 936,
        y: 1020
    },

    {
        id: 161,
        type: "job",
        jobId: 1,
        next: [162],
        x: 792,
        y: 1020
    },

    {
        id: 162,
        type: "asset",
        typeIds: [1],
        next: [163],
        x: 648,
        y: 1020
    },

    {
        id: 163,
        type: "shop",
        typeId: 1,
        next: [164],
        x: 504,
        y: 1020
    },

    {
        id: 164,
        type: "monster",
        next: [],
        x: 360,
        y: 1020
    },

    {
        id: 165,
        type: "money",
        next: [166, 171, 195, 299],
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
        type: "start",
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
        next: [199],
        x: 2088,
        y: 1500
    },

    {
        id: 199,
        type: "monster",
        next: [204],
        x: 1944,
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
        next: [205],
        x: 1944,
        y: 1380
    },

    {
        id: 205,
        type: "money",
        next: [206, 214],
        x: 1944,
        y: 1260
    },

    {
        id: 206,
        type: "monster",
        next: [207, 213],
        x: 2088,
        y: 1260
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
        next: [212, 216],
        x: 2376,
        y: 1140
    },

    {
        id: 212,
        type: "asset",
        typeIds: [1],
        next: [213],
        x: 2232,
        y: 1140
    },

    {
        id: 213,
        type: "worst",
        next: [214],
        x: 2088,
        y: 1140
    },

    {
        id: 214,
        type: "monster",
        next: [219],
        x: 1944,
        y: 1140
    },

    {
        id: 215,
        type: "treasure",
        treasureBoxId: 1,
        next: [216],
        x: 2520,
        y: 1020
    },

    {
        id: 216,
        type: "job",
        jobId: 1,
        next: [217],
        x: 2376,
        y: 1020
    },

    {
        id: 217,
        type: "asset",
        typeIds: [1],
        next: [218],
        x: 2232,
        y: 1020
    },

    {
        id: 218,
        type: "shop",
        typeId: 1,
        next: [219],
        x: 2088,
        y: 1020
    },

    {
        id: 219,
        type: "monster",
        next: [],
        x: 1944,
        y: 1020
    },

    {
        id: 220,
        type: "money",
        next: [221, 226, 250],
        x: 1080,
        y: 2100
    },

    {
        id: 221,
        type: "money",
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
        type: "monster",
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
        type: "monster",
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
        type: "start",
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
        type: "job",
        jobId: 1,
        next: [299],
        x: 1800,
        y: 1620
    },

    {
        id: 250,
        type: "money",
        next: [251, 255],
        x: 936,
        y: 2100
    },

    {
        id: 251,
        type: "monster",
        next: [252],
        x: 792,
        y: 2100
    },

    {
        id: 252,
        type: "job",
        jobId: 1,
        next: [253, 257],
        x: 648,
        y: 2100
    },

    {
        id: 253,
        type: "shop",
        typeId: 1,
        next: [254],
        x: 504,
        y: 2100
    },

    {
        id: 254,
        type: "monster",
        next: [259],
        x: 360,
        y: 2100
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
        next: [258],
        x: 648,
        y: 1980
    },

    {
        id: 258,
        type: "asset",
        typeIds: [1],
        next: [259],
        x: 504,
        y: 1980
    },

    {
        id: 259,
        type: "treasure",
        treasureBoxId: 1,
        next: [260],
        x: 360,
        y: 1980
    },

    {
        id: 260,
        type: "money",
        next: [261, 269],
        x: 360,
        y: 1860
    },

    {
        id: 261,
        type: "monster",
        next: [262, 268],
        x: 504,
        y: 1860
    },

    {
        id: 262,
        type: "job",
        jobId: 1,
        next: [263],
        x: 648,
        y: 1860
    },

    {
        id: 263,
        type: "shop",
        typeId: 1,
        next: [264],
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
        next: [267, 271],
        x: 792,
        y: 1740
    },

    {
        id: 267,
        type: "asset",
        typeIds: [1],
        next: [268],
        x: 648,
        y: 1740
    },

    {
        id: 268,
        type: "worst",
        next: [269],
        x: 504,
        y: 1740
    },

    {
        id: 269,
        type: "monster",
        next: [274],
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
        next: [274],
        x: 504,
        y: 1620
    },

    {
        id: 274,
        type: "monster",
        next: [],
        x: 360,
        y: 1620
    },

    {
        id: 275,
        type: "money",
        next: [276, 281, 305],
        x: 2664,
        y: 2100
    },

    {
        id: 276,
        type: "money",
        next: [277, 282],
        x: 2808,
        y: 2100
    },

    {
        id: 277,
        type: "job",
        jobId: 1,
        next: [278],
        x: 2952,
        y: 2100
    },

    {
        id: 278,
        type: "asset",
        typeIds: [1],
        next: [279],
        x: 3096,
        y: 2100
    },

    {
        id: 279,
        type: "worst",
        next: [280],
        x: 3240,
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
        type: "asset",
        typeIds: [1],
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
        type: "start",
        next: [293, 319],
        x: 2664,
        y: 1860
    },

    {
        id: 293,
        type: "monster",
        next: [294, 299],
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
        id: 299,
        type: "treasure",
        treasureBoxId: 1,
        next: [300, 325],
        x: 2664,
        y: 1620
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
        next: [302],
        x: 2952,
        y: 1620
    },

    {
        id: 302,
        type: "monster",
        next: [303],
        x: 3096,
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
        next: [306, 310],
        x: 2520,
        y: 2100
    },

    {
        id: 306,
        type: "monster",
        next: [307],
        x: 2376,
        y: 2100
    },

    {
        id: 307,
        type: "job",
        jobId: 1,
        next: [308, 312],
        x: 2232,
        y: 2100
    },

    {
        id: 308,
        type: "shop",
        typeId: 1,
        next: [309],
        x: 2088,
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
        type: "asset",
        typeIds: [1],
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
        next: [322, 326],
        x: 2376,
        y: 1740
    },

    {
        id: 322,
        type: "asset",
        typeIds: [1],
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
        next: [326],
        x: 2520,
        y: 1620
    },

    {
        id: 326,
        type: "job",
        jobId: 1,
        next: [327],
        x: 2376,
        y: 1620
    },

    {
        id: 327,
        type: "asset",
        typeIds: [1],
        next: [328],
        x: 2232,
        y: 1620
    },

    {
        id: 328,
        type: "shop",
        typeId: 1,
        next: [329],
        x: 2088,
        y: 1620
    },

    {
        id: 329,
        type: "monster",
        next: [],
        x: 1944,
        y: 1620
    }

];
