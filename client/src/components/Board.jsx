import { getPieceMatrix, isPieceCell } from "../engine/pieces"

export default function BoardView({ board, piece }) {
  const matrix = getPieceMatrix(piece)

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(10, 30px)`,
        gap: "1px",
      }}
    >
      {board.map((row, y) =>
        row.map((cell, x) => {
          const isLockedBlock = cell !== 0
          const isActiveBlock = isPieceCell(piece, x, y, matrix)

          let color = "#111"

          if (isLockedBlock) {
            color = "red"
          } else if (isActiveBlock) {
            color = "cyan"
          }

          return (
            <div
              key={`${x}-${y}`}
              style={{
                width: 30,
                height: 30,
                background: color,
                border: "1px solid #222",
              }}
            />
          )
        })
      )}
    </div>
  )
}