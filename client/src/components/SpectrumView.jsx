export default function SpectrumView({ spectrum = [] }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "2px", height: "60px" }}>
      {spectrum.map((height, index) => (
        <div
          key={index}
          style={{
            width: "10px",
            height: `${height * 3}px`,
            background: "red",
            border: "1px solid #222",
          }}
        />
      ))}
    </div>
  )
}