import React, { CSSProperties, PropsWithChildren } from "react";

type GridItemProps = {
    columnSpan: number;
    rowSpan: number;
    className?: string;
    style?: CSSProperties;
};

type GridFillerProps = {
    className?: string;
    style?: Omit<CSSProperties, "display">;
};

const GridItem: React.FC<PropsWithChildren<GridItemProps>> = ({
    children,
    columnSpan,
    rowSpan,
    style,
    className,
}) => {
    return (
        <div
            className={className}
            style={style}
            data-bento={`${columnSpan}x${rowSpan}`}
        >
            {children}
        </div>
    );
};

const GridFiller: React.FC<PropsWithChildren<GridFillerProps>> = ({
    className,
    style,
    children,
}) => {
    return (
        <div className={className} style={style}>
            {children}
        </div>
    );
};

export { GridItem, GridFiller };
