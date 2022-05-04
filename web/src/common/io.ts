import axios from "axios";
import config from "../config-loader";
import { AnyMap } from "./types";

export function request({
    method,
    data,
    headers,
    responseType
}: {
    method: string;
    headers?: any;
    data?: AnyMap;
    responseType?: any;
}): Promise<any> {
    const origin = config.origin;
    return axios({
        method: "POST",
        url: `${origin}/${method}`,
        headers,
        data,
        responseType
    }).then(result => {
        return result.data;
    });
}
