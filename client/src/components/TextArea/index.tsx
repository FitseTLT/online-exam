import errorStyles from "../../../styles/errors.module.css";
import React from "react";
import { UseFormRegisterReturn } from "react-hook-form/dist/types";
import { FieldErrors } from "react-hook-form/dist/types/errors";

interface Props {
    id?: string;
    type?: string;
    label: string;
    register: UseFormRegisterReturn;
    errors: FieldErrors;
    backendError?: string;
    autoComplete?: string;
}

export default function TextArea({
    id,
    type,
    label,
    register,
    errors,
    backendError,
}: Props) {
    return (
        <>
            <label
                htmlFor={id || register.name}
                className="col-start-1 col-end-3"
            >
                {label}
            </label>
            <textarea
                id={id || register.name}
                rows={10}
                {...register}
                className="p-2 text-sm focus:outline-none col-start-1 col-end-3"
            />

            {errors[register.name] &&
                errors[register.name]?.type === "required" && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-1 col-end-3`}
                    >
                        {register.name} is required
                    </p>
                )}
            {errors[register.name] &&
                errors[register.name]?.type !== "required" && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-1 col-end-3`}
                    >
                        {errors[register.name]?.message?.toString() ||
                            `enter proper ${register.name}`}
                    </p>
                )}
            {backendError && (
                <p
                    className={`${errorStyles["error-message"]} col-start-1 col-end-3`}
                >
                    {backendError}
                </p>
            )}
        </>
    );
}
