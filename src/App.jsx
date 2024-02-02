import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { Physics, RigidBody } from "@react-three/rapier";
import "./App.css";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  KeyboardControls,
  OrbitControls,
} from "@react-three/drei";
import Light from "./Components/Light";
import { MetaWorld } from "./Components/MetaWorld";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Canvas shadows>
        {/* <Perf position="top-left"/> */}
        <Environment background files="/spree_bank_2k.hdr" />
        <Light />
        <Physics timeStep="vary">
          <MetaWorld />
        </Physics>

        <OrbitControls />
      </Canvas>
    </>
  );
}

export default App;
