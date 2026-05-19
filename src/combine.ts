export function combine(...fns: (() => void)[]) {
    return () => {
        for (const fn of fns) fn();
    };
}
