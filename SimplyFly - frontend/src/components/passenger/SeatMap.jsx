import { buildSeatGrid } from '../../utils/seatLayout';

export default function SeatMap({
  cabinType,
  totalSeats,
  bookedSeatNumbers = [],
  maxSelectable,
  selectedSeats,
  onToggleSeat,
}) {
  const { grid, aisleAfter } = buildSeatGrid(cabinType, totalSeats, bookedSeatNumbers);

  const handleClick = (seat) => {
    if (seat.isBooked) return;
    const alreadySelected = selectedSeats.includes(seat.seatNumber);

    if (alreadySelected) {
      onToggleSeat(selectedSeats.filter((s) => s !== seat.seatNumber));
    } 
    else {
      if (selectedSeats.length >= maxSelectable) return;
      onToggleSeat([...selectedSeats, seat.seatNumber]);
    }
  };

  return (
    <div className="seat-map">
      <div className="d-flex gap-3 mb-3 small text-muted">
        <span><span className="seat-legend seat-available" /> Available</span>
        <span><span className="seat-legend seat-selected" /> Selected</span>
        <span><span className="seat-legend seat-booked" /> Booked</span>
      </div>

      {grid.map((row, i) => (
        <div className="d-flex justify-content-center gap-2 mb-2" key={i}>
          {row.map((seat, idx) => {
            const isSelected = selectedSeats.includes(seat.seatNumber);
            return (
              <div key={seat.seatNumber} style={{ display: 'flex' }}>
                <button
                  type="button"
                  className={`seat-btn ${seat.isBooked ? 'seat-booked' : isSelected ? 'seat-selected' : 'seat-available'}`}
                  disabled={seat.isBooked}
                  onClick={() => handleClick(seat)}
                  title={seat.seatNumber}
                >
                  {seat.seatNumber}
                </button>
                {idx + 1 === aisleAfter && <div style={{ width: '20px' }} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}