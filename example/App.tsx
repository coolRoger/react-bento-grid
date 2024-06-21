import { useState } from "react";
import "./App.css";
import ReactBentoGrid, {
    BentoGridConfig,
    GridFiller,
    GridItem,
} from "../packages/ReactBentoGrid";
import CodeDisplay from "./components/CodeDisplay";

function App() {
    const config: BentoGridConfig = {
        cellGap: 16,
        balanceFillers: true,
        columns: 2,
        aspectRatio: 0,
        breakpoints: {
            400: {
                minCellWidth: 188,
                cellGap: 24,
                aspectRatio: 4 / 3,
            },
            680: {
                aspectRatio: 1,
            },
        },
        breakpointReference: "target",
    };

    const code = `
    const config: BentoGridConfig = {
        cellGap: 16,
        balanceFillers: true,
        columns: 2,
        aspectRatio: 0,
        breakpoints: {
            400: {
                minCellWidth: 188,
                cellGap: 24,
                aspectRatio: 4 / 3,
            },
            680: {
                aspectRatio: 1,
            },
        },
        breakpointReference: "target",
    };

    <ReactBentoGrid
        config={config}
        style={{ backgroundColor: "#fff", padding: 20 }}
        className="react-bento-grid"
    >
        <GridItem className="grid-item item" columnSpan={2} rowSpan={2}>
            Item 1
        </GridItem>
        <GridItem className="grid-item item" columnSpan={2} rowSpan={1}>
            Item 2
        </GridItem>
        <GridItem className="grid-item item" columnSpan={1} rowSpan={2}>
            Item 3
        </GridItem>
        <GridItem className="grid-item item" columnSpan={1} rowSpan={2}>
            Item 4
        </GridItem>
        <GridItem className="grid-item item" columnSpan={2} rowSpan={1}>
            Item 5
        </GridItem>
        <GridItem className="grid-item item" columnSpan={1} rowSpan={1}>
            Item 6
        </GridItem>
        <GridFiller className="filler" style={{ background: "orange" }}>
            Filler
        </GridFiller>
    </ReactBentoGrid>
    `;

    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "end",
                }}
            >
                <a href="https://github.com/coolRoger/react-bento-grid" style={{ color: "inherit", textDecoration: "none" }}>
                    Github
                </a>
            </div>
            <h1>React Bento Grid</h1>
            <ReactBentoGrid
                config={config}
                style={{ backgroundColor: "#fff", padding: 20 }}
                className="react-bento-grid"
            >
                <GridItem className="grid-item item" columnSpan={2} rowSpan={2}>
                    Item 1
                </GridItem>
                <GridItem className="grid-item item" columnSpan={2} rowSpan={1}>
                    Item 2
                </GridItem>
                <GridItem className="grid-item item" columnSpan={1} rowSpan={2}>
                    Item 3
                </GridItem>
                <GridItem className="grid-item item" columnSpan={1} rowSpan={2}>
                    Item 4
                </GridItem>
                <GridItem className="grid-item item" columnSpan={2} rowSpan={1}>
                    Item 5
                </GridItem>
                <GridItem className="grid-item item" columnSpan={1} rowSpan={1}>
                    Item 6
                </GridItem>
                <GridFiller className="filler" style={{ background: "orange" }}>
                    Filler
                </GridFiller>
            </ReactBentoGrid>
            <h3 style={{ textAlign: "left", margin: "0 20px" }}>Basic Usage</h3>
            <CodeDisplay code={code}></CodeDisplay>
        </>
    );
}

export default App;
