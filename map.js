// =========================
// マップデータ
// =========================

const mapData = [

    {
        id: 0,
        name: "START",
        type: "start",
        next: [1, 6],
        x: 30,
        y: 80
    },

    {
        id: 1,
        type: "money",
        next: [2, 7],
        x: 38,
        y: 80
    },

    {
        id: 2,
        type: "job",
        jobId: 1,
        next: [3],
        x: 46,
        y: 80
    },

    {
        id: 3,
        type: "asset",
        typeIds: [1],
        next: [4],
        x: 54,
        y: 80
    },

    {
        id: 4,
        type: "worst",
        next: [5],
        x: 62,
        y: 80
    },

    {
        id: 5,
        type: "monster",
        next: [11],
        x: 70,
        y: 80
    },

    {
        id: 6,
        type: "monster",
        next: [17],
        x: 30,
        y: 65
    },

    // =========================
    // 7番：魔法店へ変更
    // =========================

    {
        id: 7,
        type: "magic_shop",
        typeId: 1,
        next: [8],
        x: 38,
        y: 65
    },

    {
        id: 8,
        type: "monster",
        next: [9],
        x: 46,
        y: 65
    },

    {
        id: 9,
        type: "shop",
        typeId: 1,
        next: [10],
        x: 54,
        y: 65
    },

    {
        id: 10,
        type: "treasure",
        treasureBoxId: 1,
        next: [11],
        x: 62,
        y: 65
    },

    {
        id: 11,
        type: "asset",
        typeIds: [3],
        next: [12],
        x: 70,
        y: 65
    },

    {
        id: 12,
        type: "monster",
        next: [13, 23],
        x: 70,
        y: 50
    },

    {
        id: 13,
        type: "money",
        next: [14],
        x: 62,
        y: 50
    },

    {
        id: 14,
        type: "job",
        jobId: 2,
        next: [15, 21],
        x: 54,
        y: 50
    },

    {
        id: 15,
        type: "money",
        next: [16],
        x: 46,
        y: 50
    },

    {
        id: 16,
        type: "shop",
        typeId: 2,
        next: [17],
        x: 38,
        y: 50
    },

    {
        id: 17,
        type: "money",
        next: [18],
        x: 30,
        y: 50
    },

    {
        id: 18,
        type: "monster",
        next: [19,24],
        x: 30,
        y: 35
    },

    // =========================
    // 19番：ショップから魔法店へ変更
    // =========================

    {
        id: 19,
        type: "magic_shop",
        typeId: 2,
        next: [20, 25],
        x: 38,
        y: 35
    },

    {
        id: 20,
        type: "treasure",
        treasureBoxId: 1,
        next: [21],
        x: 46,
        y: 35
    },

    {
        id: 21,
        type: "job",
        jobId: 3,
        next: [22],
        x: 54,
        y: 35
    },

    {
        id: 22,
        type: "money",
        next: [23],
        x: 62,
        y: 35
    },

    {
        id: 23,
        type: "monster",
        next: [29],
        x: 70,
        y: 35
    },

    {
        id: 24,
        type: "treasure",
        treasureBoxId: 1,
        next: [25],
        x: 30,
        y: 20
    },

    {
        id: 25,
        type: "money",
        next: [26],
        x: 38,
        y: 20
    },

    {
        id: 26,
        type: "shop",
        typeId: 1,
        next: [27],
        x: 46,
        y: 20
    },

    {
        id: 27,
        type: "monster",
        next: [28],
        x: 54,
        y: 20
    },

    {
        id: 28,
        type: "shop",
        typeId: 2,
        next: [29],
        x: 62,
        y: 20
    },

    {
        id: 29,
        type: "job",
        jobId: 4,
        next: [],
        x: 70,
        y: 20
    }

];
