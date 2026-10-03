import { CSSProperties } from "react";
import RiseLoader from "react-spinners/RiseLoader";

const override: CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "red",
};

const Loader = () => {
  return (
    <div className="sweet-loading">
      <RiseLoader
        color={"#0012c4"}
        cssOverride={override}
        size={20}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};

export default Loader;
