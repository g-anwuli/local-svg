import { LocalSvg } from "../../src/LocalSvg";

function App() {
  return (
    <div className="">
      {Array.from({ length: 100 }, (_, i) => i).map((i) => (
        <LocalSvg
          key={i}
          // name={i === 0 ? "test" : "vite"}
          name={""}
          baseUrl={
            i % 2
              ? "https://unpkg.com/@tabler/icons@latest/icons/outline/home"
              : "https://unpkg.com/@tabler/icons@latest/icons/outline/heart"
          }
          width={100}
          height={100}
        />
      ))}
    </div>
  );
}

export default App;
