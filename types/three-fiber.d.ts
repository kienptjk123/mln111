import { extend } from "@react-three/fiber";
import { Object3D } from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Three.js primitives
      mesh: any;
      group: any;
      boxGeometry: any;
      planeGeometry: any;
      circleGeometry: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      directionalLight: any;
      spotLight: any;
      ambientLight: any;
      text: any;
    }
  }
}

export {};
