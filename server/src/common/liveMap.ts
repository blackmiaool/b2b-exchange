import { EventEmitter } from "events";

interface MapInfo<T> {
    id: string;
    data: T;
    time: number;
    timeout: NodeJS.Timeout;
}

export default class LiveMap<T> extends EventEmitter {
    private all = new Map<string, MapInfo<T>>();
    lastTimeout: NodeJS.Timer;
    timeout: number;
    constructor({ timeout }: { timeout: number }) {
        super();
        this.timeout = timeout;
    }
    get(id: string): T {
        return this.all.get(id)?.data;
    }
    getAll() {
        return this.all;
    }
    delete(id: string) {
        this.all.delete(id);
        this.emit("delete", id);
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
