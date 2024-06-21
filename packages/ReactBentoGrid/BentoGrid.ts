/**
 * This code is adapted from the original JavaScript implementation found at:
 * https://github.com/mariohamann/bentogrid.js/blob/main/packages/core/BentoGrid.js
 *
 * Thank you, Mario Hamann, for the original implementation and inspiration!
 */

export interface BentoGridConfig {
    minCellWidth?: number;
    columns?: number;
    cellGap?: number;
    aspectRatio?: number;
    breakpoints?: Record<number, Breakpoint>;
    breakpointReference?: "target" | "window";
    balanceFillers?: boolean;
    fillerClassName?: string;
}

interface Breakpoint {
    minCellWidth?: number;
    cellGap?: number;
    columns?: number;
    aspectRatio?: number;
}

class BentoGrid {
    private config: BentoGridConfig;
    private gridContainer: HTMLElement;
    private gridItems: HTMLElement[] | undefined;
    private fillers: HTMLElement[] | undefined;
    private prevTotalColumns: number | null;
    private prevColumnCount: number | null;
    private resizeObserver:
        | ResizeObserver
        | { observe: () => void; unobserve: () => void };
    private resizeTimeoutId: number | null;

    constructor(bentoGridConfig: BentoGridConfig, target: HTMLElement) {
        this.config = {
            minCellWidth: 100,
            cellGap: 0,
            aspectRatio: 1 / 1,
            breakpoints: {},
            balanceFillers: false,
            breakpointReference: "target",
            fillerClassName: "bento-filler",
            ...bentoGridConfig,
        };

        this.gridContainer = target;

        this.gridItems = undefined;
        this.fillers = undefined;
        this.prevTotalColumns = null;
        this.prevColumnCount = null;
        this.resizeTimeoutId = null;

        this.setElements();
        this.hideOriginalFillers();
        this.setupGrid();
        this.updateGrid();
        this.handleResponsiveBehavior();
    }

    private setElements() {
        console.log(this.gridContainer.querySelectorAll(":scope > *"));
        this.gridItems = Array.from(
            this.gridContainer.querySelectorAll(":scope > *")
        )
            .filter((item: HTMLElement) => item.hasAttribute("data-bento"))
            .filter(
                (item: HTMLElement) => item.offsetParent !== null
            ) as HTMLElement[];

        this.fillers = Array.from(
            this.gridContainer.querySelectorAll(":scope > *")
        )
            .filter((filler: HTMLElement) => !filler.hasAttribute("data-bento"))
            .filter(
                (filler: HTMLElement) => !filler.style.gridColumn
            ) as HTMLElement[];
    }

    private getBreakpoint(): BentoGridConfig {
        const width =
            this.config.breakpointReference === "target"
                ? this.gridContainer.clientWidth
                : window.innerWidth;

        let activeBreakpoint: BentoGridConfig = { ...this.config };

        const cleanupBreakpoint = (breakpoint: BentoGridConfig) => {
            if (breakpoint.columns) {
                delete activeBreakpoint.minCellWidth;
            } else if (breakpoint.minCellWidth) {
                delete activeBreakpoint.columns;
            }
        };

        cleanupBreakpoint(activeBreakpoint);

        const breakpointKeys = Object.keys(this.config.breakpoints!)
            .map(Number)
            .sort((a, b) => a - b);

        for (const breakpointKey of breakpointKeys) {
            if (width >= breakpointKey) {
                activeBreakpoint = {
                    ...activeBreakpoint,
                    ...this.config.breakpoints![breakpointKey],
                };
                cleanupBreakpoint(this.config.breakpoints![breakpointKey]);
            }
        }

        return activeBreakpoint;
    }

    private setupGrid(): number {
        const breakpoint = this.getBreakpoint();

        const totalColumns =
            breakpoint.columns ||
            Math.floor(
                (this.gridContainer.clientWidth + (breakpoint.cellGap || 0)) /
                    ((breakpoint.minCellWidth || 100) +
                        (breakpoint.cellGap || 0))
            );

        this.gridContainer.style.display = "grid";
        this.gridContainer.style.gridTemplateColumns = `repeat(${totalColumns}, minmax(${breakpoint.minCellWidth}px, 1fr))`;
        this.gridContainer.style.gap = `${breakpoint.cellGap}px`;

        const containerWidth = this.gridContainer.clientWidth;
        const cellWidth =
            (containerWidth - (totalColumns - 1) * (breakpoint.cellGap || 0)) /
            totalColumns;
        const rowHeight = cellWidth / (breakpoint.aspectRatio || 1);

        this.gridContainer.style.setProperty(
            "--bento-row-height",
            `${rowHeight}px`
        );

        return totalColumns;
    }

    private hideOriginalFillers() {
        this.fillers!.forEach((filler) => {
            filler.style.display = "none";
        });
    }

    private removeClonedFillers() {
        Array.from(this.gridContainer.querySelectorAll(":scope > *"))
            .filter((item) => !item.hasAttribute("data-bento"))
            .filter((filler: HTMLElement) => !!filler.style.gridColumn)
            .forEach((filler) => {
                filler.remove();
            });
    }

    private updateGrid() {
        const totalColumns = this.setupGrid();

        if (this.prevTotalColumns !== totalColumns) {
            this.removeClonedFillers();
        }

        const gridMatrix: boolean[][] = [];
        let maxRow = 0;

        for (let i = 0; i < totalColumns; i++) {
            gridMatrix[i] = [];
        }

        const getNextAvailablePosition = (
            gridColumnSpan: number,
            gridRowSpan: number
        ) => {
            let foundPosition = false;
            let column = 0;
            let row = 0;

            while (!foundPosition) {
                if (
                    isPositionAvailable(
                        column,
                        row,
                        gridColumnSpan,
                        gridRowSpan
                    )
                ) {
                    foundPosition = true;
                } else {
                    column++;
                    if (column + gridColumnSpan > totalColumns) {
                        column = 0;
                        row++;
                    }
                }
            }

            return { column, row };
        };

        const isPositionAvailable = (
            column: number,
            row: number,
            gridColumnSpan: number,
            gridRowSpan: number
        ) => {
            for (let c = column; c < column + gridColumnSpan; c++) {
                for (let r = row; r < row + gridRowSpan; r++) {
                    if (gridMatrix[c] && gridMatrix[c][r]) {
                        return false;
                    }
                }
            }
            return true;
        };

        const occupyPosition = (
            column: number,
            row: number,
            gridColumnSpan: number,
            gridRowSpan: number
        ) => {
            for (let c = column; c < column + gridColumnSpan; c++) {
                for (let r = row; r < row + gridRowSpan; r++) {
                    if (!gridMatrix[c]) {
                        gridMatrix[c] = [];
                    }
                    gridMatrix[c][r] = true;
                }
            }
        };

        this.gridItems!.forEach((item) => {
            const bento = item.getAttribute("data-bento")!.split("x");
            const gridColumnSpan = parseInt(bento[0]);
            const gridRowSpan = parseInt(bento[1]);

            const position = getNextAvailablePosition(
                gridColumnSpan,
                gridRowSpan
            );
            item.style.gridColumn = `${
                position.column + 1
            } / span ${gridColumnSpan}`;
            item.style.gridRow = `${position.row + 1} / span ${gridRowSpan}`;

            occupyPosition(
                position.column,
                position.row,
                gridColumnSpan,
                gridRowSpan
            );

            maxRow = Math.max(maxRow, position.row + gridRowSpan);
        });

        this.gridContainer.style.gridTemplateRows = `repeat(${maxRow}, minmax(var(--bento-row-height), 1fr))`;

        this.gridItems!.forEach((item) => {
            const gridRowStart = parseInt(item.style.gridRow.split(" / ")[0]);
            const gridRowSpan = parseInt(
                item.style.gridRow.split(" / ")[1].split(" ")[1]
            );
            maxRow = Math.max(maxRow, gridRowStart + gridRowSpan - 1);
        });

        const addFillers = () => {
            let fillerIndex = 0;
            let lastFillerPositions: { column: number; row: number }[] = [];

            for (let row = 0; row < maxRow; row++) {
                for (let column = 0; column < totalColumns; column++) {
                    if (!gridMatrix[column][row]) {
                        let gridColumnSpan = 1;
                        let gridRowSpan = 1;

                        while (
                            column + gridColumnSpan < totalColumns &&
                            !gridMatrix[column + gridColumnSpan][row]
                        ) {
                            gridColumnSpan++;
                        }

                        for (let r = row + 1; r < maxRow; r++) {
                            let rowSpanValid = true;
                            for (
                                let c = column;
                                c < column + gridColumnSpan;
                                c++
                            ) {
                                if (gridMatrix[c][r]) {
                                    rowSpanValid = false;
                                    break;
                                }
                            }
                            if (!rowSpanValid) {
                                break;
                            }
                            gridRowSpan++;
                        }

                        let filler: HTMLElement;

                        if (this.fillers!.length > 0) {
                            filler = this.fillers![fillerIndex].cloneNode(
                                true
                            ) as HTMLElement;

                            fillerIndex =
                                (fillerIndex + 1) % this.fillers!.length;

                            console.log(filler.style.display);

                            // let config.fillerClassName to handle ths display style:
                            filler.style.display = null;
                        } else {
                            filler = document.createElement("div");
                        }

                        filler.classList.add(this.config.fillerClassName);
                        filler.style.gridColumn = `${
                            column + 1
                        } / span ${gridColumnSpan}`;
                        filler.style.gridRow = `${
                            row + 1
                        } / span ${gridRowSpan}`;

                        let swapPerformed = false;

                        if (this.config.balanceFillers) {
                            const availableSwaps = Array.from(this.gridItems!)
                                .filter(
                                    (item) =>
                                        !item.hasAttribute("data-bento-no-swap")
                                )
                                .filter((item) => {
                                    const gridColumnStart = parseInt(
                                        item.style.gridColumn.split(" / ")[0]
                                    );
                                    const gridRowStart = parseInt(
                                        item.style.gridRow.split(" / ")[0]
                                    );
                                    const gridColumnEnd = parseInt(
                                        item.style.gridColumn
                                            .split(" / ")[1]
                                            .split(" ")[1]
                                    );
                                    const gridRowEnd = parseInt(
                                        item.style.gridRow
                                            .split(" / ")[1]
                                            .split(" ")[1]
                                    );

                                    return (
                                        gridColumnEnd === gridColumnSpan &&
                                        gridRowEnd === gridRowSpan &&
                                        (gridColumnStart !== column + 1 ||
                                            gridRowStart !== row + 1)
                                    );
                                });

                            if (availableSwaps.length > 0) {
                                const getNextPositionDistance = (
                                    current: { column: number; row: number },
                                    next: { column: number; row: number }
                                ) => {
                                    return (
                                        Math.abs(current.column - next.column) +
                                        Math.abs(current.row - next.row)
                                    );
                                };

                                const getAverageSwapsDistance = (
                                    swaps: { column: number; row: number }[],
                                    newSwap: { column: number; row: number }
                                ) => {
                                    if (swaps.length === 0) return 0;
                                    const totalDistance = swaps.reduce(
                                        (sum, swap) => {
                                            return (
                                                sum +
                                                getNextPositionDistance(
                                                    swap,
                                                    newSwap
                                                )
                                            );
                                        },
                                        0
                                    );
                                    return totalDistance / swaps.length;
                                };

                                const bestSwap = availableSwaps.reduce(
                                    (best, current) => {
                                        const currentAvgDistance =
                                            getAverageSwapsDistance(
                                                lastFillerPositions,
                                                {
                                                    column:
                                                        parseInt(
                                                            current.style.gridColumn.split(
                                                                " / "
                                                            )[0]
                                                        ) - 1,
                                                    row:
                                                        parseInt(
                                                            current.style.gridRow.split(
                                                                " / "
                                                            )[0]
                                                        ) - 1,
                                                }
                                            );

                                        const bestAvgDistance =
                                            getAverageSwapsDistance(
                                                lastFillerPositions,
                                                {
                                                    column:
                                                        parseInt(
                                                            best.style.gridColumn.split(
                                                                " / "
                                                            )[0]
                                                        ) - 1,
                                                    row:
                                                        parseInt(
                                                            best.style.gridRow.split(
                                                                " / "
                                                            )[0]
                                                        ) - 1,
                                                }
                                            );

                                        return currentAvgDistance >
                                            bestAvgDistance
                                            ? current
                                            : best;
                                    },
                                    availableSwaps[0]
                                );

                                const originalGridColumn =
                                    bestSwap.style.gridColumn;
                                const originalGridRow = bestSwap.style.gridRow;
                                bestSwap.style.gridColumn =
                                    filler.style.gridColumn;
                                bestSwap.style.gridRow = filler.style.gridRow;
                                filler.style.gridColumn = originalGridColumn;
                                filler.style.gridRow = originalGridRow;

                                lastFillerPositions.push({
                                    column:
                                        parseInt(
                                            filler.style.gridColumn.split(
                                                " / "
                                            )[0]
                                        ) - 1,
                                    row:
                                        parseInt(
                                            filler.style.gridRow.split(" / ")[0]
                                        ) - 1,
                                });
                                swapPerformed = true;
                            }
                        }

                        occupyPosition(
                            column,
                            row,
                            gridColumnSpan,
                            gridRowSpan
                        );

                        this.gridContainer.appendChild(filler);
                    }
                }
            }
        };

        addFillers();

        this.prevTotalColumns = totalColumns;

        this.emitCalculationDoneEvent();
    }

    private handleResponsiveBehavior() {
        const onResize = () => {
            if (this.resizeTimeoutId) {
                clearTimeout(this.resizeTimeoutId);
            }
            this.resizeTimeoutId = window.setTimeout(() => {
                const currentColumnCount = this.setupGrid();
                if (currentColumnCount !== this.prevColumnCount) {
                    this.updateGrid();
                }
                this.prevColumnCount = currentColumnCount;
            }, 10);
        };

        if (this.config.breakpointReference === "window") {
            this.resizeObserver = {
                observe: () => {
                    window.addEventListener("resize", onResize);
                },
                unobserve: () => {
                    window.removeEventListener("resize", onResize);
                },
            };
        } else {
            this.resizeObserver = new ResizeObserver(onResize);
        }

        this.resizeObserver.observe(this.gridContainer);
    }

    recalculate() {
        this.setElements();
        this.updateGrid();
    }

    private emitCalculationDoneEvent() {
        const calculationDoneEvent = new CustomEvent("calculationDone", {
            detail: {
                gridContainer: this.gridContainer,
            },
        });
        this.gridContainer.dispatchEvent(calculationDoneEvent);
    }
}

export default BentoGrid;
