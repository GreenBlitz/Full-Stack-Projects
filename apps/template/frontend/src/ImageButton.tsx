const Buttons = () => {
  return (
    <div style={styles.container}>
      <input type="text" placeholder="טקסט 1" style={styles.input} />
      <input type="text" placeholder="טקסט 2" style={styles.input} />
      <input type="text" placeholder="טקסט 3" style={styles.input} />
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
    width: "250px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "2px solid #22c55e", // ירוק
    backgroundColor: "#000", // שחור
    color: "#22c55e",
    fontSize: "14px",
    outline: "none",
  },
};

export default Buttons;
