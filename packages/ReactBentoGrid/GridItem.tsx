import React, { CSSProperties, PropsWithChildren } from "react";

type GridItemProps = {
    columnSpan?: number;
    rowSpan?: number;
    className?: string;
    style?: CSSProperties;
};

const GridItem: React.FC<PropsWithChildren<GridItemProps>> = ({
    children,
    columnSpan,
    rowSpan,
    style,
    className,
}) => {
    if (typeof columnSpan === "number" && typeof rowSpan === "number") {
        return (
            <div
                className={className}
                style={style}
                data-bento={`${columnSpan}x${rowSpan}`}
            >
                {children}
            </div>
        );
    } else {
        return (
            <div className={className} style={style}>
                {children}
            </div>
        );
    }
};

export default GridItem;
