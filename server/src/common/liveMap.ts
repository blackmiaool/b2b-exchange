interface MapInfo<T> {
    id: string;
    data: T;
    time: number;
    timeout: NodeJS.Timeout;
}
export default class LiveMap<T> {
    private all = new Map<string, MapInfo<T>>();
    lastTimeout: NodeJS.Timer;
    timeout: number;
    constructor({ timeout }: { timeout: number }) {
        this.timeout = timeout;
    }
    getAll() {
        return this.all;
    }
    delete(id: string) {
        // console.log("delete", id, new Date().format("hh:mm:ss"));
        this.all.delete(id);
    }
    update(id: string, data: T) {
        // console.log("update", id, new Date().format("hh:mm:ss"));
        let prevInfo: Partial<MapInfo<T>> = {};
        if (this.all.has(id)) {
            prevInfo = this.all.get(id) || {};
            clearTimeout(this.all.get(id).timeout);
        }
        const t = setTimeout(() => {
            this.delete(id);
        }, this.timeout);
        this.all.set(id, {
            id,
            data: Object.assign({}, prevInfo.data, data),
            time: Date.now(),
            timeout: t,
        });
    }
}
