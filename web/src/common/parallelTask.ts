export async function parallelTask2Map<
    F,
    T extends { key: string; value: F } = { key: string; value: F }
>(
    task: (index: number) => Promise<T>,
    shouldEnd: (index: number) => boolean,
    max: number
): Promise<Record<string, F>> {
    const result = await parallelTask<T>(task, shouldEnd, max);
    return result.reduce((p, v) => {
        if (v?.key) {
            p[v.key] = v.value;
        }
        return p;
    }, {});
}

export default function parallelTask<T>(
    task: (index: number) => Promise<T>,
    shouldEnd: (index: number) => boolean,
    max: number
): Promise<T[]> {
    let i = 0;
    const all = {};
    let runningCnt = 0;
    return new Promise((resolve, reject) => {
        const ret: T[] = [];
        function check() {
            if (shouldEnd(i)) {
                return;
            }
            if (runningCnt > max) {
                return;
            }
            const promise = task(i);
            const index = i;
            all[index] = true;
            i++;
            runningCnt++;
            promise
                .then(result => {
                    ret[index] = result;
                    delete all[index];
                    runningCnt--;

                    check();
                    if (runningCnt === 0) {
                        resolve(ret);
                    }
                })
                .catch(function (e) {
                    console.log(e);
                    reject(e);
                });
            check();
        }
        check();
    });
}
