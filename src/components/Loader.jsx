import LottieModule from "lottie-react";
import loadingAnimation from "../assets/animations/loading3.json";

const Lottie = LottieModule.default ?? LottieModule;

import "./Loader.css";

function Loader() {
  return (
    <div className="loader-container">
      <Lottie
        animationData={loadingAnimation}
        loop
        className="loader-animation"
      />
    </div>
  );
}

export default Loader;