type DataAttribute<T> = `data-${T extends string ? T : string}`;
type DataAttributeQuery<T extends string, V, K extends string = DataAttribute<T>> = `[${K}="${V extends string
    ? V
    : string}"]`;

interface DomObjectsOptions<T extends string> {
    /**
     * This attribute will be passed as [data-{attributeName}].
     * Ex: [data-cy], [data-test-id] and etc.
     */
    attributeName: T;
}

interface DomObjectsResult<T extends string, V extends string> {
    add<V1 extends string, V2 extends string>(name: V1, selector?: V2): DomObjectsResult<T, V1>;
    attr?: {
        [K in DataAttribute<T>]: V;
    };
    query: DataAttributeQuery<T, V>;
}

enum Type {
    "main",
    "child",
}

type Node = {
    type: Type;
    name: string;
};

export const configureDomObjects = <T extends string>({ attributeName }: DomObjectsOptions<T>) => {
    return <V extends string>(name: V) => {
        const dataAttr = `data-${attributeName}`;
        const queue: Node[] = [
            {
                type: Type.main,
                name,
            },
        ];

        const getMethods = (currentQueue: Node[], node: Node) => ({
            get attr() {
                return {
                    [dataAttr]: node.name,
                };
            },

            get query() {
                return currentQueue.map((s) => (s.type === Type.main ? `[${dataAttr}="${s.name}"]` : s.name)).join(" ");
            },
            add(name: string, select: string) {
                const nextNode = {
                    type: Type.main,
                    name,
                };
                const nextQueue = currentQueue.concat(nextNode);

                if (select) {
                    nextQueue.push({
                        type: Type.child,
                        name: select,
                    });
                }

                return getMethods(nextQueue, nextNode);
            },
        });

        return getMethods(queue, queue[0]) as DomObjectsResult<T, V>;
    };
};
