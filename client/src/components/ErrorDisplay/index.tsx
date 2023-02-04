import errorStyles from "../../../styles/errors.module.css";
import React from "react";
import { AxiosError } from "axios";

interface Props {
    error: AxiosError | undefined;
}

export default function ErrorDisplay({ error }: Props) {
    if (!error) return null;

    if (!error.response)
        return (
            <div>
                {
                    <p
                        className={`${errorStyles["error-message"]}  col-start-1 col-end-3 mx-auto`}
                    >
                        {error.message}
                    </p>
                }
            </div>
        );

    return (
        <div>
            <ul className="list-disc  col-start-1 col-end-3 mx-auto">
                {(error.response.data as Array<{ message: string }>).map(
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
