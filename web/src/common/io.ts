import axios from "axios";
import config from "../config";
import { AnyMap } from "./types";

export function request({ method, data }: { method: string; data?: AnyMap }): Promise<any> {
    const origin = "http://localhost:" + config.port;
    return axios
        .post(
            `${origin}/${method}`,
            {
                data
            },
            {
                withCredentials: true
            }
        )
        .then(result => {
            return result.data;
        });
}
