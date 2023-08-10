interface DomObjectsOptions {
    /**
     * This attribute will be passed as [data-{attributeName}].
     * Ex: [data-cy], [data-test-id] and etc.
     */
    attributeName: string;
}

export const configureDomObjects = ({ attributeName }: DomObjectsOptions) => {
    return (name: string) => {
        const dataAttr = `data-${attributeName}`;
        const queue: string[] = [name];
        const attrs = () => {
            return process.env.NODE_ENV === "production"
                ? {}
                : {
                      [dataAttr]: queue[queue.length - 1],
                  };
        };
        const query = () => queue.map((s) => `[${dataAttr}="${s}"]`).join(" ");
        const add = (name: string) => {
            queue.push(name);

            return {
                add,
                get attr() {
                    return attrs();
                },
                get query() {
                    return query();
                },
            };
        };

        return {
            add,
            get attr() {
                return attrs();
            },
            get query() {
                return query();
            },
        };
    };
};
