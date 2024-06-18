import React, { PropsWithChildren, useEffect, useRef, useState } from "react";

import BentoGrid, { BentoGridConfig } from "./BentoGrid";
import GridItem from "./GridItem";

export { default as GridItem } from "./GridItem";

type BentoGridProps = {
    className?: string;
    config?: BentoGridConfig;
};

const ReactBentoGrid: React.FC<PropsWithChildren<BentoGridProps>> = ({
    config,
    className,
    children,
}) => {
    const [bentoGridInstance, setBentoGridInstance] =
        useState<BentoGrid | null>(null);

    const gridContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (gridContainerRef.current) {
            if (!bentoGridInstance) {
                setBentoGridInstance(
                    new BentoGrid(config, gridContainerRef.current)
                );
            } else {
                bentoGridInstance.recalculate();
            }
        }
    }, [gridContainerRef, children, config]);

    const hasInvalidChildren = React.Children.toArray(children).some(
        (child) => !React.isValidElement(child) || child.type !== GridItem
    );

    if (hasInvalidChildren) {
        console.error("[ReactBentoGrid Error]: ReactBentoGrid children must be GridItems")
        return null;
    }

    return (
        <div ref={gridContainerRef} className={className}>
            {children}
        </div>
    );
};

export default ReactBentoGrid;

export type { BentoGridConfig };
