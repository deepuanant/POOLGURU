import React, { useEffect, useRef } from "react";
import globe from "vanta/dist/vanta.globe.min";
import * as THREE from "three";

const Globe = () => {
  const globeRef = useRef(null);
  const vantaEffectRef = useRef(null);

  useEffect(() => {
    if (!vantaEffectRef.current && globeRef.current) {
      vantaEffectRef.current = globe({
        el: globeRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 100,
        minWidth: 100,
        scale: 1,
        scaleMobile: 1,
        color: 0xf97316,
        color2: 0xf59e0b,
        backgroundColor: 0xfafafa,
        pointsColor: 0x9ca3af,
        linesColor: 0x9ca3af,
        materialOptions: {
          vertexColors: true,
        },
      });
    }

    return () => {
      if (vantaEffectRef.current) {
        vantaEffectRef.current.destroy();
        vantaEffectRef.current = null;
      }
    };
  }, []);

  return (
    <div ref={globeRef} className="w-full h-[450px] overflow-hidden z-0" />
  );
};

export default Globe;
