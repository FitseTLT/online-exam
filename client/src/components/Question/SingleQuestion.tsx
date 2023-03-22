import formStyles from "../../../styles/form.module.css";
import axios from "@/src/axios";
import { useRouter } from "next/router";
import { useState } from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { AxiosError } from "axios";
import { Types } from "@/pages/admin/questions/create";
import Select from "../Select";
import TextArea from "../TextArea";
import { Choices } from "../Choices";
import { FormControlLabel, Radio, RadioGroup } from "@mui/material";
import Input from "../Input";
import errorStyles from "../../../styles/errors.module.css";

export interface Question {
    id?: string;
    category: string;
    type: string;
    difficulty: string;
    question: string;
    choices?: string[];
    answer: string;
    allottedTime?: number;
}

interface Props {
    type?: "edit" | "create";
    question?: Question;
    types: Types;
}

export default function SingleQuestion({
    type = "create",
    question = {
        category: "",
        type: "",
        difficulty: "",
        question: "",
        choices: ["", ""],
        answer: "",
        allottedTime: 60,
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
        setValue,
        watch,
    } = useForm({ defaultValues: { ...question } });

    const createQuestion = async (data: FieldValues) => {
        const method = type === "create" ? "post" : "put";
        const url =
            type === "create"
                ? "/api/question"
                : `/api/question/${question?.id}`;

        setBackendError(undefined);

        try {
            setDisabled(true);

            const res = await axios[method](url, data);
            setDisabled(false);

            if (res.status === 200) router.replace("/admin/questions");
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
            <h1>{type === "create" ? "Create New " : "Edit "} Question</h1>
            <hr />
            <ErrorDisplay error={backendError} onlySingleError />
            <form onSubmit={handleSubmit(createQuestion)} className="ml-10">
                <Select
                    id="category"
                    label="Category"
                    options={types.categories.map((category) => [
                        category.name,
                        category.id,
                    ])}
                    register={register("category", {
                        required: true,
                    })}
                    errors={errors}
                    backendError={backendErrors?.category}
                />
                <Select
                    id="type"
                    label="Question Type"
                    options={types.questionTypes}
                    register={register("type", {
                        required: true,
                    })}
                    errors={errors}
                    backendError={backendErrors?.type}
                />
                <Select
                    id="difficulty"
                    label="Difficulty"
                    options={types.questionDifficulty}
                    register={register("difficulty", {
                        required: true,
                    })}
                    errors={errors}
                    backendError={backendErrors?.difficulty}
                />
                <Input
                    type="number"
                    register={register("allottedTime", {
                        required: true,
                        min: 15,
                    })}
                    label="Allotted Time (secs)"
                    errors={errors}
                    backendError={backendErrors?.allottedTime}
                />
                <TextArea
                    id="question"
                    label="Question"
                    register={register("question", {
                        required: true,
                    })}
                    errors={errors}
                    backendError={backendErrors?.question}
                />
                {watch("type") === "mcq" && (
                    <Controller
                        name="choices"
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Choices
                                onChange={onChange}
                                value={value}
                                answer={watch("answer")}
                                setValue={setValue}
                            />
                        )}
                    />
                )}
                {watch("type") === "true-false" && (
                    <RadioGroup
                        onChange={(e) => setValue("answer", e.target.value)}
                    >
                        <FormControlLabel
                            value="true"
                            label="True"
                            control={<Radio />}
                        />
                        <FormControlLabel
                            value="false"
                            label="False"
                            control={<Radio />}
                        />
                    </RadioGroup>
                )}
                {watch("type") === "write-answer" && (
                    <TextArea
                        id="answer"
                        label="Answer"
                        register={register("answer", {
                            required: true,
                        })}
                        errors={errors}
                        backendError={backendErrors?.answer}
                    />
                )}
                {errors?.answer && errors.answer?.type === "required" && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-1 col-end-3`}
                    >
                        Answer is required
                    </p>
                )}
                {backendErrors?.answer && (
                    <p
                        className={`${errorStyles["error-message"]} col-start-1 col-end-3 justify-self-center`}
                    >
                        {backendErrors.answer}
                    </p>
                )}
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
