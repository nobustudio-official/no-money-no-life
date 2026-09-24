// =========================
// マップデータ
// =========================

const mapData = [

    {
        id: 0,
        type: "money",
        next: [1, 6, 30],
        x: 52,
        y: 75
    },

    {
        id: 1,
        type: "money",
        next: [2, 7],
        x: 60,
        y: 75
    },

    {
        id: 2,
        type: "job",
        jobId: 1,
        next: [3],
        x: 68,
        y: 75
    },

    {
        id: 3,
        type: "asset",
        typeIds: [4],
        next: [4],
        x: 76,
        y: 75
    },

    {
        id: 4,
        type: "worst",
        next: [5],
        x: 84,
        y: 75
    },

    {
        id: 5,
        type: "monster",
        next: [11],
        x: 92,
        y: 75
    },

    {
        id: 6,
        type: "monster",
        next: [17],
        x: 52,
        y: 65
    },
    
    {
        id: 7,
        type: "magic_shop",
        typeId: 1,
        next: [8],
        x: 60,
        y: 65
    },

    {
        id: 8,
        type: "monster",
        next: [9],
        x: 68,
        y: 65
    },

    {
        id: 9,
        type: "shop",
        typeId: 1,
        next: [10],
        x: 76,
        y: 65
    },

    {
        id: 10,
        type: "treasure",
        treasureBoxId: 1,
        next: [11],
        x: 84,
        y: 65
    },

    {
        id: 11,
        type: "asset",
        typeIds: [3],
        next: [12],
        x: 92,
        y: 65
    },

    {
        id: 12,
        type: "monster",
        next: [13, 23],
        x: 92,
        y: 55
    },

    {
        id: 13,
        type: "money",
        next: [14],
        x: 84,
        y: 55
    },

    {
        id: 14,
        type: "job",
        jobId: 2,
        next: [15, 21],
        x: 76,
        y: 55
    },

    {
        id: 15,
        type: "money",
        next: [16],
        x: 68,
        y: 55
    },

    {
        id: 16,
        type: "shop",
        typeId: 2,
        next: [17],
        x: 60,
        y: 55
    },

    {
        id: 17,
        type: "start",
        next: [18,44],
        x: 52,
        y: 55
    },

    {
        id: 18,
        type: "monster",
        next: [19,24],
        x: 52,
        y: 45
    },

    {
        id: 19,
        type: "magic_shop",
        typeId: 2,
        next: [20, 25],
        x: 60,
        y: 45
    },

    {
        id: 20,
        type: "treasure",
        treasureBoxId: 1,
        next: [21],
        x: 68,
        y: 45
    },

    {
        id: 21,
        type: "job",
        jobId: 3,
        next: [22],
        x: 76,
        y: 45
    },

    {
        id: 22,
        type: "money",
        next: [23],
        x: 84,
        y: 45
    },

    {
        id: 23,
        type: "monster",
        next: [29],
        x: 92,
        y: 45
    },

    {
        id: 24,
        type: "treasure",
        treasureBoxId: 1,
        next: [25,50],
        x: 52,
        y: 35
    },

    {
        id: 25,
        type: "money",
        next: [26],
        x: 60,
        y: 35
    },

    {
        id: 26,
        type: "shop",
        typeId: 1,
        next: [27],
        x: 68,
        y: 35
    },

    {
        id: 27,
        type: "monster",
        next: [28],
        x: 76,
        y: 35
    },

    {
        id: 28,
        type: "shop",
        typeId: 2,
        next: [29],
        x: 84,
        y: 35
    },

    {
        id: 29,
        type: "job",
        jobId: 4,
        next: [],
        x: 92,
        y: 35
    },

    {
        id: 30,
        type: "money",
        next: [31, 35],
        x: 44,
        y: 75
    },
    {
        id: 31,
        type: "monster",
        next: [32],
        x: 36,
        y: 75
    },
    {
        id: 32,
        type: "job",
        jobId: 1,
        next: [33,37],
        x: 28,
        y: 75
    },
    {
        id: 33,
        type: "shop",
        typeId: 1,
        next: [34],
        x: 20,
        y: 75
    },
    {
        id: 34,
        type: "monster",
        next: [39],
        x: 12,
        y: 75
    },

    {
        id: 35,
        type: "monster",
        next: [36,44],
        x: 44,
        y: 65
    },
    {
        id: 36,
        type: "magic_shop",
        typeId: 1,
        next: [37],
        x: 36,
        y: 65
    },
    {
        id: 37,
        type: "money",
        next: [38],
        x: 28,
        y: 65
    },
    {
        id: 38,
        type: "asset",
        typeIds: [2],
        next: [39],
        x: 20,
        y: 65
    },
    {
        id: 39,
        type: "treasure",
        treasureBoxId: 1,
        next: [40],
        x: 12,
        y: 65
    },

    {
        id: 40,
        type: "money",
        next: [41,49],
        x: 12,
        y: 55
    },
    {
        id: 41,
        type: "monster",
        next: [42,48],
        x: 20,
        y: 55
    },
    {
        id: 42,
        type: "job",
        jobId: 1,
        next: [43],
        x: 28,
        y: 55
    },
    {
        id: 43,
        type: "shop",
        typeId: 1,
        next: [44],
        x: 36,
        y: 55
    },
    {
        id: 44,
        type: "money",
        next: [45],
        x: 44,
        y: 55
    },

    {
        id: 45,
        type: "magic_shop",
        typeId: 1,
        next: [46, 50],
        x: 44,
        y: 45
    },
    {
        id: 46,
        type: "money",
        next: [47,51],
        x: 36,
        y: 45
    },
    {
        id: 47,
        type: "asset",
        typeIds: [1],
        next: [48],
        x: 28,
        y: 45
    },
    {
        id: 48,
        type: "worst",
        next: [49],
        x: 20,
        y: 45
    },
    {
        id: 49,
        type: "monster",
        next: [54],
        x: 12,
        y: 45
    },

    {
        id: 50,
        type: "treasure",
        treasureBoxId: 1,
        next: [51],
        x: 44,
        y: 35
    },
    {
        id: 51,
        type: "job",
        jobId: 1,
        next: [52],
        x: 36,
        y: 35
    },
    {
        id: 52,
        type: "asset",
        typeIds: [5],
        next: [53],
        x: 28,
        y: 35
    },
    {
        id: 53,
        type: "shop",
        typeId: 1,
        next: [54],
        x: 20,
        y: 35
    },
    {
        id: 54,
        type: "monster",
        next: [55],
        x: 12,
        y: 35
    },

];
