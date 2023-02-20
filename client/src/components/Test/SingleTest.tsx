import formStyles from "../../../styles/form.module.css";
import errorStyles from "../../../styles/errors.module.css";
import axios from "@/src/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { AxiosError } from "axios";
import Input from "../Input";
import { Autocomplete, TextField } from "@mui/material";
import { Exam } from "../Exam/SingleExam";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export interface Test {
    id?: string;
    userEmail: string;
    exam?: Exam;
    from?: string;
    to?: string;
}

interface Props {
    type?: "edit" | "create";
    test?: Test;
    testName?: string;
}

export default function SingleTest({
    type = "create",
    test = {
        userEmail: "",
        from: "",
        to: "",
    },
}: Props) {
    const [disabled, setDisabled] = useState(false);
    const [backendErrors, setBackendErrors] = useState<any>(null);
    const [backendError, setBackendError] = useState<AxiosError | undefined>();
    const [exams, setExams] = useState<Exam[]>(test.exam ? [test?.exam] : []);
    const [range, setRange] = useState<{
        startDate: Date | undefined;
        endDate: Date | undefined;
    }>({
        startDate: test?.from ? new Date(test?.from) : new Date(),
        endDate: test?.to ? new Date(test?.to) : new Date(),
    });

    const searchTests = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            let query = "?name=" + e.target.value ?? "";

            const res = await axios(`/api/exam${query}`);

            const { exams } = res.data;

            setExams(exams);
        } catch (e: any) {
            console.log(e);
        }
    };

    const router = useRouter();
    const {
        register,
        handleSubmit,
        control,
        setValue,
        formState: { errors },
    } = useForm({ defaultValues: { ...test, exam: test.exam?.id } });

    const submitTest = async (data: FieldValues) => {
        const method = type === "create" ? "post" : "put";
        const url = type === "create" ? "/api/test" : `/api/test/${test?.id}`;

        setBackendError(undefined);

        try {
            setDisabled(true);
            const { userEmail, exam, from, to } = data;

            const res = await axios[method](url, {
                userEmail,
                exam,
                ...(from && { from }),
                ...(to && { to }),
            });
            setDisabled(false);

            if (res.status === 200) router.replace("/admin/tests");
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
            <h1>{type === "create" ? "Create New " : "Edit "} Test</h1>
            <hr />
            <ErrorDisplay error={backendError} onlySingleError />
            <form onSubmit={handleSubmit(submitTest)} className="ml-10">
                <Input
                    type="email"
                    register={register("userEmail", {
                        required: true,
                    })}
                    label="User Email"
                    errors={errors}
                    backendError={backendErrors?.userEmail}
                />
                <label htmlFor="exam">Exam</label>
                <Controller
                    name="exam"
                    rules={{ required: true }}
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            options={exams}
                            defaultValue={test?.exam}
                            getOptionLabel={(option) => option.name}
                            size="small"
                            isOptionEqualToValue={(option, value) =>
                                option.name === value.name
                            }
                            onChange={(e, value) => onChange(value?.id)}
                            renderInput={(params) => (
                                <TextField
                                    onChange={searchTests}
                                    {...params}
                                    placeholder="Search for exam"
                                    id="exam"
                                />
                            )}
                        />
                    )}
                />
                {errors.exam && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-2 col-end-3`}
                    >
                        {errors.exam?.message?.toString() ||
                            `enter proper exam`}
                    </p>
                )}
                <DateRangePicker
                    className="mt-4 self-center  col-start-1 col-end-3"
                    ranges={[range]}
                    onChange={({ range1: { startDate, endDate } }) => {
                        setRange({ startDate, endDate });
                        setValue("from", startDate?.toISOString());
                        setValue("to", endDate?.toISOString());
                    }}
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
