import { useState } from "react";
import "./App.css";
import ReactBentoGrid, {
    BentoGridConfig,
    GridItem,
} from "../packages/ReactBentoGrid";

function App() {
    const config: BentoGridConfig = {
        minCellWidth: 100,
        cellGap: 10,
        aspectRatio: 1,
        breakpoints: {
            768: { minCellWidth: 150, cellGap: 15 },
            1024: { columns: 4, cellGap: 20 },
        },
        breakpointReference: "target",
        balanceFillers: true,
    };

    return (
        <>
            <h1>React Bento Grid</h1>
            <ReactBentoGrid config={config}>
                <GridItem className="grid-item item" columnSpan={1} rowSpan={3}>
                    Item 1
                </GridItem>
                <GridItem className="grid-item item" columnSpan={2} rowSpan={1}>
                    Item 2
                </GridItem>
            </ReactBentoGrid>
        </>
    );
}

export default App;
