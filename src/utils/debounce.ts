/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export function debounce(func: Function, wait: number = 750) {
    let timeout: number | undefined
    return function (this: any, ...args: any[]) {
        clearTimeout(timeout)
        timeout = window.setTimeout(() => func.apply(this, args), wait)
    }
}
