import formStyles from "../../../styles/form.module.css";
import axios from "@/src/axios";
import Input from "@/src/components/Input";
import { useRouter } from "next/router";
import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { AxiosError } from "axios";

export interface Category {
    name: string;
    code: string;
    id: string;
}

interface Props {
    type?: "edit" | "create";
    category?: Category;
}

export default function SingleCategory({ type = "create", category }: Props) {
    const [disabled, setDisabled] = useState(false);
    const [backendErrors, setBackendErrors] = useState<any>(null);
    const [backendError, setBackendError] = useState<AxiosError | undefined>();

    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm(
        type === "edit" ? { defaultValues: { ...category } } : undefined
    );

    const createCategory = async (data: FieldValues) => {
        const method = type === "create" ? "post" : "put";
        const url =
            type === "create"
                ? "/api/category"
                : `/api/category/${category?.id}`;

        setBackendError(undefined);
        const { name, code } = data;
        try {
            setDisabled(true);
            const res = await axios[method](url, {
                name,
                code,
            });
            setDisabled(false);

            if (res.status === 200) router.replace("/admin/categories");
        } catch (e: any) {
            setDisabled(false);

            setBackendError(e);

            const errorMsgs = e.response?.data;
            setBackendErrors(
                errorMsgs?.reduce(
                    (
                        prev: object,
                        {
                            field,
                            message,
                        }: {
                            field: string;
                            message: string;
                        }
                    ) => ({ ...prev, [field]: message }),
                    {}
                )
            );
        }
    };

    return (
        <div className={`${formStyles.form} px-12 py-11`}>
            <h1>{type === "create" ? "Create New " : "Edit "} Category</h1>
            <hr />
            <ErrorDisplay error={backendError} onlySingleError />
            <form onSubmit={handleSubmit(createCategory)}>
                <Input
                    id="name"
                    label="Name"
                    register={register("name", {
                        required: true,
                        minLength: 2,
                        maxLength: 20,
                    })}
                    errors={errors}
                    backendError={backendErrors?.name}
                />
                <Input
                    id="code"
                    label="Code"
                    type="code"
                    register={register("code", {
                        required: true,
                        minLength: 2,
                        maxLength: 20,
                    })}
                    errors={errors}
                    backendError={backendErrors?.code}
                />
                <button
                    className={`btn self-center inline-block ${
                        disabled ? "bg-blue-300" : "bg-blue-500"
                    }`}
                    type="submit"
                    disabled={disabled}
                >
                    {type === "create" ? "Create" : "Edit"}
                </button>
            </form>
        </div>
    );
}
