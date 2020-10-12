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
    bookmarker: 8, // Bet365
    timeGap: 5,
    outcomeToUse: [
        "Match Winner",
        "Both Teams Score",
        "Goals Over/Under",
        "Corners Over Under",
        "Both Teams Score",
        "Handicap Result",
        "Goals Over/Under First Half",
        "Highest Scoring Half",
        "First 10 min Winner",
        "HT/FT Double",
        "Win Both Halves"
    ]
}

// The 10 outcomes are
// 1. 1 x 2 -
// 2. Both teams to score -
// 3. Over 2.5 goals -
// 4. Over 9.5 corners -
// 5. Over 3.5 yellow cards
// 6. 1st half draw
// 7. Under 1.5 first half -
// 8. Handicapped -
// 9. Most scoring half -
// 10. Halftime/fulltime -
// 11. Win Both Halves

