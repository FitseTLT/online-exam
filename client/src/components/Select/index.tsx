import errorStyles from "../../../styles/errors.module.css";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import inputStyles from "./inputs.module.css";

interface Props {
    id?: string;
    options: string[][];
    label: string;
    register: UseFormRegisterReturn;
    errors: FieldErrors;
    backendError?: string;
    autoComplete?: string;
}

export default function Select({
    id,
    options,
    label,
    register,
    errors,
    backendError,
    autoComplete,
}: Props) {
    return (
        <>
            <label htmlFor={id || register.name}>{label}</label>
            <select
                id={id || register.name}
                {...register}
                autoComplete={autoComplete}
                className="py-2 px-4 text-sm"
            >
                {options.map(([label, key], i) => (
                    <option key={key} value={key} selected={i == 0}>
                        {label}
                    </option>
                ))}
            </select>

            {errors[register.name] &&
                errors[register.name]?.type === "required" && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-2 col-end-3`}
                    >
                        {register.name} is required
                    </p>
                )}
            {errors[register.name] &&
                errors[register.name]?.type !== "required" && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-2 col-end-3`}
                    >
                        {errors[register.name]?.message?.toString() ||
                            `enter proper ${register.name}`}
                    </p>
                )}
            {backendError && (
                <p
                    className={`${errorStyles["error-message"]} col-start-2 col-end-3`}
                >
                    {backendError}
                </p>
            )}
        </>
    );
}
