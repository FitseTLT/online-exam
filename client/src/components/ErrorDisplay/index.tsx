import errorStyles from "../../../styles/errors.module.css";
import React from "react";
import { AxiosError } from "axios";

interface Props {
    error: AxiosError | undefined;
    onlySingleError?: boolean;
}

export default function ErrorDisplay({ error, onlySingleError }: Props) {
    if (!error) return null;

    if (!error.response)
        return (
            <div className=" col-start-1 col-end-3">
                {
                    <p
                        className={`${errorStyles["error-message"]} mx-auto text-center`}
                    >
                        {error.message}
                    </p>
                }
            </div>
        );

    if (
        onlySingleError &&
        (error?.response?.data as Array<any>).some((e: any) => Boolean(e.field))
    )
        return null;

    return (
        <div className="col-start-1 col-end-3">
            <ul className="list-none mx-auto text-center">
                {(error?.response?.data as Array<{ message: string }>).map(
                    (error, i) => (
                        <li
                            className={`${errorStyles["error-message"]}`}
                            key={i}
                        >
                            {error.message}
                        </li>
                    )
                )}
            </ul>
        </div>
    );
}
