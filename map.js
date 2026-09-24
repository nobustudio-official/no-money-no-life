// =========================
// マップデータ
// =========================

const mapData = [

    {
        id: 0,
        name: "START",
        type: "start",
        next: [1, 6, 30],
        x: 0,
        y: 80
    },

    {
        id: 1,
        type: "money",
        next: [2, 7],
        x: 8,
        y: 80
    },

    {
        id: 2,
        type: "job",
        jobId: 1,
        next: [3],
        x: 16,
        y: 80
    },

    {
        id: 3,
        type: "asset",
        typeIds: [4],
        next: [4],
        x: 24,
        y: 80
    },

    {
        id: 4,
        type: "worst",
        next: [5],
        x: 32,
        y: 80
    },

    {
        id: 5,
        type: "monster",
        next: [11],
        x: 40,
        y: 80
    },

    {
        id: 6,
        type: "monster",
        next: [17],
        x: 0,
        y: 65
    },
    
    {
        id: 7,
        type: "magic_shop",
        typeId: 1,
        next: [8],
        x: 8,
        y: 65
    },

    {
        id: 8,
        type: "monster",
        next: [9],
        x: 16,
        y: 65
    },

    {
        id: 9,
        type: "shop",
        typeId: 1,
        next: [10],
        x: 24,
        y: 65
    },

    {
        id: 10,
        type: "treasure",
        treasureBoxId: 1,
        next: [11],
        x: 32,
        y: 65
    },

    {
        id: 11,
        type: "asset",
        typeIds: [3],
        next: [12],
        x: 40,
        y: 65
    },

    {
        id: 12,
        type: "monster",
        next: [13, 23],
        x: 40,
        y: 50
    },

    {
        id: 13,
        type: "money",
        next: [14],
        x: 32,
        y: 50
    },

    {
        id: 14,
        type: "job",
        jobId: 2,
        next: [15, 21],
        x: 24,
        y: 50
    },

    {
        id: 15,
        type: "money",
        next: [16],
        x: 16,
        y: 50
    },

    {
        id: 16,
        type: "shop",
        typeId: 2,
        next: [17],
        x: 8,
        y: 50
    },

    {
        id: 17,
        type: "money",
        next: [18,44],
        x: 0,
        y: 50
    },

    {
        id: 18,
        type: "monster",
        next: [19,24],
        x: 0,
        y: 35
    },

    {
        id: 19,
        type: "magic_shop",
        typeId: 2,
        next: [20, 25],
        x: 8,
        y: 35
    },

    {
        id: 20,
        type: "treasure",
        treasureBoxId: 1,
        next: [21],
        x: 16,
        y: 35
    },

    {
        id: 21,
        type: "job",
        jobId: 3,
        next: [22],
        x: 24,
        y: 35
    },

    {
        id: 22,
        type: "money",
        next: [23],
        x: 32,
        y: 35
    },

    {
        id: 23,
        type: "monster",
        next: [29],
        x: 40,
        y: 35
    },

    {
        id: 24,
        type: "treasure",
        treasureBoxId: 1,
        next: [25],
        x: 0,
        y: 20
    },

    {
        id: 25,
        type: "money",
        next: [26],
        x: 8,
        y: 20
    },

    {
        id: 26,
        type: "shop",
        typeId: 1,
        next: [27],
        x: 16,
        y: 20
    },

    {
        id: 27,
        type: "monster",
        next: [28],
        x: 24,
        y: 20
    },

    {
        id: 28,
        type: "shop",
        typeId: 2,
        next: [29],
        x: 32,
        y: 20
    },

    {
        id: 29,
        type: "job",
        jobId: 4,
        next: [],
        x: 40,
        y: 20
    },

    {
    id: 30,
    type: "money",
    next: [31, 35],
    x: -8,
    y: 80
},
{
    id: 31,
    type: "monster",
    next: [32],
    x: -16,
    y: 80
},
{
    id: 32,
    type: "job",
    jobId: 1,
    next: [33],
    x: -24,
    y: 80
},
{
    id: 33,
    type: "shop",
    typeId: 1,
    next: [34],
    x: -32,
    y: 80
},
{
    id: 34,
    type: "monster",
    next: [39],
    x: -40,
    y: 80
},

{
    id: 35,
    type: "monster",
    next: [36,44],
    x: -8,
    y: 65
},
{
    id: 36,
    type: "magic_shop",
    typeId: 1,
    next: [37],
    x: -16,
    y: 65
},
{
    id: 37,
    type: "money",
    next: [38],
    x: -24,
    y: 65
},
{
    id: 38,
    type: "asset",
    typeIds: [1],
    next: [39],
    x: -32,
    y: 65
},
{
    id: 39,
    type: "treasure",
    treasureBoxId: 1,
    next: [40],
    x: -40,
    y: 65
},

{
    id: 40,
    type: "money",
    next: [41],
    x: -40,
    y: 50
},
{
    id: 41,
    type: "monster",
    next: [42],
    x: -32,
    y: 50
},
{
    id: 42,
    type: "job",
    jobId: 1,
    next: [43],
    x: -24,
    y: 50
},
{
    id: 43,
    type: "shop",
    typeId: 1,
    next: [44],
    x: -16,
    y: 50
},
{
    id: 44,
    type: "monster",
    next: [45],
    x: -8,
    y: 50
},

{
    id: 45,
    type: "magic_shop",
    typeId: 1,
    next: [46, 50],
    x: -8,
    y: 35
},
{
    id: 46,
    type: "money",
    next: [47],
    x: -16,
    y: 35
},
{
    id: 47,
    type: "asset",
    typeIds: [1],
    next: [48],
    x: -24,
    y: 35
},
{
    id: 48,
    type: "worst",
    next: [49],
    x: -32,
    y: 35
},
{
    id: 49,
    type: "monster",
    next: [54],
    x: -40,
    y: 35
},

{
    id: 50,
    type: "treasure",
    treasureBoxId: 1,
    next: [51],
    x: -8,
    y: 20
},
{
    id: 51,
    type: "job",
    jobId: 1,
    next: [52],
    x: -16,
    y: 20
},
{
    id: 52,
    type: "asset",
    typeIds: [2],
    next: [53],
    x: -24,
    y: 20
},
{
    id: 53,
    type: "shop",
    typeId: 1,
    next: [54],
    x: -32,
    y: 20
},
{
    id: 54,
    type: "monster",
    next: [55],
    x: -40,
    y: 20
},

{
    id: 55,
    type: "asset",
    typeIds: [3],
    next: [56],
    x: -40,
    y: 5
},
{
    id: 56,
    type: "job",
    jobId: 1,
    next: [57],
    x: -32,
    y: 5
},
{
    id: 57,
    type: "shop",
    typeId: 1,
    next: [58],
    x: -24,
    y: 5
},
{
    id: 58,
    type: "treasure",
    treasureBoxId: 1,
    next: [],
    x: -16,
    y: 5
}

];
