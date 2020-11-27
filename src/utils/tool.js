export function debounce(fn, time) {
    var timeout;
    return function (...rest) {
        if (timeout) {
            clearTimeout(timeout);
            timeout = null;
        }
        timeout = setTimeout(fn, time, ...rest)
    }
}
/**
 * @template T
 * @param {(v:T)=>string|number} predicat 
 * @param {T[]} arr
 * @returns {T[]} 
 */
export function unionBy(predicat, arr) {
    let uni = [], result = [];
    for (let i = 0; i < arr.length; i++) {
        const one = arr[i];
        let v = predicat(one)
        if (uni.includes(v)) continue;
        uni.push(v)
        result.push(one)
    }
    return result;
}