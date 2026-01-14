import { Grid, type CellComponentProps } from "react-window";
import { LocalSvg } from "../../src/LocalSvg";

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
      columnCount={20}
      columnWidth={80}
      rowCount={1_000_000}
      rowHeight={80}
      style={{ width: "100vw", height: "100vh" }}
    />
    // <div className="">
    //   <LocalSvg key={"big"} name="test" width="100vw" height="100vh" />
    //   <Grid
    //     cellComponent={GridCell}
    //     cellProps={{}}
    //     columnCount={20}
    //     columnWidth={80}
    //     rowCount={100}
    //     rowHeight={80}
    //     style={{ width: "100vw", height: "100vh" }}
    //   />
    // </div>
  );
}

export default App;
