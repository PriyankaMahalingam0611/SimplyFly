const LAYOUTS = {
  Economy: { seatsPerRow: 6, letters: ['A', 'B', 'C', 'D', 'E', 'F'], aisleAfter: 3 },
  'Premium Economy': { seatsPerRow: 6, letters: ['A', 'B', 'C', 'D', 'E', 'F'], aisleAfter: 3 },
  'Business Class': { seatsPerRow: 4, letters: ['A', 'B', 'C', 'D'], aisleAfter: 2 },
  'First Class': { seatsPerRow: 4, letters: ['A', 'B', 'C', 'D'], aisleAfter: 2 },
};

export function buildSeatGrid(cabinType, totalCount, bookedSeatNumbers = []) {
  const layout = LAYOUTS[cabinType] || LAYOUTS.Economy;
  const { seatsPerRow, letters } = layout;
  const rows = Math.ceil(totalCount / seatsPerRow);
  const bookedSet = new Set(bookedSeatNumbers);

  const grid = [];
  let seatCount = 0;

  for (let r = 1; r <= rows; r++) {
    const row = [];
    for (let c = 0; c < seatsPerRow; c++) {
      if (seatCount >= totalCount) break;
      const seatNumber = `${r}${letters[c]}`;
      row.push({
        seatNumber,
        isBooked: bookedSet.has(seatNumber),
      });
      seatCount++;
    }
    grid.push(row);
  }

  return { grid, aisleAfter: layout.aisleAfter };
}