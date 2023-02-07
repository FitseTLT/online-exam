import errorStyles from "../../../styles/errors.module.css";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types";
import { FieldErrors } from "react-hook-form/dist/types/errors";
import inputStyles from "./inputs.module.css";

interface Props {
    id?: string;
    type?: string;
    label: string;
    register: UseFormRegisterReturn;
    errors: FieldErrors;
    backendError?: string;
    autoComplete?: string;
}

export default function Input({
    id,
    type,
    label,
    register,
    errors,
    backendError,
    autoComplete,
}: Props) {
    return (
        <>
            <label htmlFor={id || register.name}>{label}</label>
            <input
                id={id || register.name}
                type={type || "text"}
                {...register}
                autoComplete={autoComplete}
            />

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
