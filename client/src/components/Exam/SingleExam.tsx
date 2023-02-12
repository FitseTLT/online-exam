import formStyles from "../../../styles/form.module.css";
import axios from "@/src/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { AxiosError } from "axios";
import { Types } from "@/pages/admin/questions/create";
import Input from "../Input";
import { Sections } from "../Sections";
import errorStyles from "../../../styles/errors.module.css";

export interface Exam {
    id?: string;
    name: string;
    sections: Section[];
}

export interface Section {
    category: string;
    easy?: number;
    medium?: number;
    hard?: number;
}

interface Props {
    type?: "edit" | "create";
    exam?: Exam;
    types: Types;
}

export default function SingleExam({
    type = "create",
    exam = {
        name: "",
        sections: [],
    },
    types,
}: Props) {
    const [disabled, setDisabled] = useState(false);
    const [backendErrors, setBackendErrors] = useState<any>(null);
    const [backendError, setBackendError] = useState<AxiosError | undefined>();

    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
    } = useForm({ defaultValues: { ...exam } });

    const createExam = async (data: FieldValues) => {
        const method = type === "create" ? "post" : "put";
        const url = type === "create" ? "/api/exam" : `/api/exam/${exam?.id}`;

        setBackendError(undefined);

        try {
            setDisabled(true);

            const res = await axios[method](url, data);
            setDisabled(false);

            if (res.status === 200) router.replace("/admin/exams");
        } catch (e: any) {
            console.log(e);

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
            <h1>{type === "create" ? "Create New " : "Edit "} Exam</h1>
            <hr />
            <ErrorDisplay error={backendError} onlySingleError />
            <form onSubmit={handleSubmit(createExam)} className="ml-10">
                <Input
                    register={register("name", {
                        required: true,
                        minLength: 2,
                        maxLength: 20,
                    })}
                    label="Name"
                    errors={errors}
                    backendError={backendErrors?.name}
                />
                {errors?.sections && errors.sections?.type === "required" && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-1 col-end-3`}
                    >
                        Sections is required
                    </p>
                )}
                {backendErrors?.sections && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-1 col-end-3 justify-self-center`}
                    >
                        {backendErrors.sections}
                    </p>
                )}
                <Controller
                    control={control}
                    name="sections"
                    render={({ field: { onChange, value } }) => (
                        <Sections
                            value={value}
                            onChange={onChange}
                            categories={types.categories}
                        />
                    )}
                />
                <button
                    className={`btn mt-12 ml-6 self-center  col-start-1 col-end-3 ${
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
