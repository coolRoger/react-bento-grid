import React, { useEffect } from "react";
import { Viewer, Entity, CameraFlyHome } from "resium";

import { Cartesian3 } from "cesium";

const position = Cartesian3.fromDegrees(-74.0707383, 40.7117244, 100);
const pointGraphics = { pixelSize: 10 };

const CesiumBox: React.FC = () => {
    return (
        <div
            style={{
                backgroundColor: "#fff",
                width: "100%",
                height: "100%",
                position: "relative",
            }}
        >
            <Viewer full timeline={false} animation={false} >
                <CameraFlyHome duration={5} />
                <Entity position={position} point={pointGraphics} name="Tokyo" description="Hello, world."/>
            </Viewer>
        </div>
    );
};

export default CesiumBox;
