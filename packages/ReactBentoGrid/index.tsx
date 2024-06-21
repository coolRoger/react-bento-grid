import React, {
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
    CSSProperties,
} from "react";

import BentoGrid, { BentoGridConfig } from "./BentoGrid";

import { GridFiller, GridItem } from "./components";

type BentoGridProps = {
    className?: string;
    config?: BentoGridConfig;
    style?: CSSProperties;
};

const ReactBentoGrid: React.FC<PropsWithChildren<BentoGridProps>> = ({
    config,
    className,
    children,
    style,
}) => {
    const [bentoGridInstance, setBentoGridInstance] =
        useState<BentoGrid | null>(null);

    const gridContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gridContainerRef.current) {
            new BentoGrid(config, gridContainerRef.current);
        }
    }, [gridContainerRef, children, config]);

    const hasInvalidChildren = React.Children.toArray(children).some(
        (child) =>
            !React.isValidElement(child) ||
            (child.type !== GridItem && child.type !== GridFiller)
    );

    if (hasInvalidChildren) {
        console.error(
            "[ReactBentoGrid Error]: ReactBentoGrid children must be GridItems or GridFillers"
        );
        return null;
    }

    return (
        <div ref={gridContainerRef} className={className} style={style}>
            {children}
        </div>
    );
};

export default ReactBentoGrid;

export type { BentoGridConfig };

export { GridFiller, GridItem };
