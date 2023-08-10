type DataAttribute<T> =`data-${T extends string ? T : string}`;
type DataAttributeQuery<T extends string, V, K extends string = DataAttribute<T>> = `[${K}="${V extends string ? V: string}"]`;

interface DomObjectsOptions<T extends string> {
    /**
     * This attribute will be passed as [data-{attributeName}].
     * Ex: [data-cy], [data-test-id] and etc.
     */
    attributeName: T;
}

interface DomObjectsResult<T extends string, V extends string> {
    add<V1 extends string>(name: V1): DomObjectsResult<T, V1>;
    attr?: {
        [K in DataAttribute<T>]: V;
    };
    query: DataAttributeQuery<T, V>;
}

export const configureDomObjects = <T extends string>({ attributeName }: DomObjectsOptions<T>) => {
    return <V extends string>(name: V) => {
        const dataAttr = `data-${attributeName}`;
        const queue: string[] = [name];

        const getMethods = (currentQueue: string[]) => ({
            get attr() {
                return process.env.NODE_ENV === "production"
                    ? undefined
                    : {
                          [dataAttr]: currentQueue[currentQueue.length - 1],
                      };
            },

            get query() {
                return currentQueue.map((s) => `[${dataAttr}="${s}"]`).join(" ");
            },
            add(name: string) {
                const nextQueue = currentQueue.concat(name);

                return getMethods(nextQueue);
            },
        });

        return getMethods(queue) as DomObjectsResult<T, V>;
    };
};
