import { Grid, type CellComponentProps } from "react-window";
import { LocalSvg } from "local-svg";

function GridCell({ style }: CellComponentProps) {
  return (
    <div style={style}>
      <LocalSvg name="vite" width={32} height={32} />
    </div>
  );
}

function App() {
  return (
    <Grid
      cellComponent={GridCell}
      cellProps={{}}
      columnCount={18}
      columnWidth={80}
      rowCount={1_000_000}
      rowHeight={80}
      style={{
        width: "100vw",
        height: "100vh",
      }}
    />
  );
}

export default App;
