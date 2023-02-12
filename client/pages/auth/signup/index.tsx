import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FieldValues } from "react-hook-form/dist/types/fields";
import { useRouter } from "next/router";
import axios from "@/src/axios";
import styles from "./../../../styles/account.module.css";
import { Paper } from "@mui/material";

const SignUpPage = () => {
    const [backendErrors, setBackendErrors] = useState<any>(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const signUp = async (data: FieldValues) => {
        const { name, email, password } = data;
        try {
            const res = await axios.post("/api/signup", {
                name,
                email,
                password,
            });

            if (res.status === 200) router.replace("/");
        } catch (e: any) {
            const errorMsgs = e?.response?.data;

            if (!errorMsgs) {
                setBackendErrors({
                    password: "Error Occurred",
                });
            } else
                setBackendErrors(
                    errorMsgs.reduce(
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
        <Paper className="mt-16 mx-auto sm:w-full md:w-[350px] p-2">
            <form
                onSubmit={handleSubmit(signUp)}
                className={`${styles.form} flex flex-col px-12 py-11 rounded`}
            >
                <Input
                    id="name"
                    label="Name"
                    register={register("name", {
                        required: true,
                    })}
                    errors={errors}
                    backendError={backendErrors?.name}
                />
                <Input
                    id="email"
                    label="Email"
                    type="email"
                    register={register("email", {
                        required: true,
                        pattern:
                            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                    })}
                    errors={errors}
                    backendError={backendErrors?.email}
                />
                <Input
                    id="password"
                    type="password"
                    label="Password"
                    register={register("password", {
                        required: true,
                        pattern: {
                            value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/,
                            message:
                                "Password should be between 8 and 20 characters with at least one uppercase, lowercase letters and digit",
                        },
                    })}
                    errors={errors}
                    backendError={backendErrors?.password}
                />
                <Button className="mt-6" type="submit">
                    Signup
                </Button>
            </form>
        </Paper>
    );
};

export default SignUpPage;
