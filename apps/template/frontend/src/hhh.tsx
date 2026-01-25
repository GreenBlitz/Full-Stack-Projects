const Buttons = () => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "200px" }}>
      <input
        type="text"
        placeholder="טקסט 1"
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="טקסט 2"
        style={inputStyle}
      />
      <input
        type="text"
        placeholder="טקסט 3"
        style={inputStyle}
      />
    </div>
  );
};

const inputStyle = {
  padding: "8px",
  backgroundColor: "black",
  color: "lime",
  border: "1px solid lime",
  borderRadius: "6px",
};

export default Buttons;
