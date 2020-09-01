const bookmarkers = [{
        id: 1,
        name: "10Bet"
    },
    {
        id: 2,
        name: "Marathonbet"
    },
    {
        id: 3,
        name: "Betfair"
    },
    {
        id: 4,
        name: "Pinnacle"
    },
    {
        id: 5,
        "name": "SBO"
    },
    {
        "id": 6,
        "name": "Bwin"
    }
];


module.exports = {
    numbersOfPlayPerWeek: 4,
    numbersOfPlayPerDay: 1,
    amountPerWin: 10 * 100,
    lowestOdd: 1.5,
    bookmarker: bookmarkers[0]
}