import axios from "axios";
import config from "../config";
import { AnyMap } from "./types";

export function request({ method, data }: { method: string; data?: AnyMap }): Promise<any> {
    const origin = `http://${config.server}:${config.port}`;
    return axios
        .post(
            `${origin}/${method}`,
            {
                data
            },
            {
                withCredentials: false
            }
        )
        .then(result => {
            return result.data;
        });
}
