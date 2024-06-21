import { useState } from "react";
import "./App.css";
import ReactBentoGrid, {
    BentoGridConfig,
    GridFiller,
    GridItem,
} from "../packages/ReactBentoGrid";

function App() {
    const config: BentoGridConfig = {
        cellGap: 6,
        columns: 8,
        aspectRatio: 1,
        breakpointReference: "target",
        balanceFillers: false,
        // fillerClassName: "filler"
    };

    return (
        <>
            <h1>React Bento Grid</h1>
            <ReactBentoGrid
                config={config}
                style={{ border: "1px solid #333" }}
                className="react-bento-grid"
            >
                <GridItem className="grid-item item" columnSpan={2} rowSpan={2}>
                    Item 1
                </GridItem>
                <GridItem className="grid-item item" columnSpan={1} rowSpan={1}>
                    Item 2
                </GridItem>
                <GridItem className="grid-item item" columnSpan={2} rowSpan={3}>
                    Item 3
                </GridItem>
                <GridItem className="grid-item item" columnSpan={2} rowSpan={1}>
                    Item 4
                </GridItem>
                <GridItem className="grid-item item" columnSpan={3} rowSpan={3}>
                    Item 5
                </GridItem>
                <GridItem className="grid-item item" columnSpan={1} rowSpan={4}>
                    Item 6
                </GridItem>
                <GridItem className="grid-item item" columnSpan={2} rowSpan={2}>
                    Item 7
                </GridItem>
                <GridFiller className="filler" style={{borderStyle: "dashed"}}>
                    Filler
                </GridFiller>
            </ReactBentoGrid>
        </>
    );
}

export default App;
