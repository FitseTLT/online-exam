import Button from "@/src/components/Button";
import Input from "@/src/components/Input";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { FieldValues } from "react-hook-form/dist/types/fields";
import { useRouter } from "next/router";
import axios from "@/src/axios";
import styles from "./../../../styles/form.module.css";

const SignInPage = () => {
    const [backendErrors, setBackendErrors] = useState<any>(null);
    const router = useRouter();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const signIn = async (data: FieldValues) => {
        const { email, password } = data;
        try {
            const res = await axios.post("/api/signin", {
                email,
                password,
            });

            if (res.status === 200) router.replace("/");
        } catch (e: any) {
            const errorMsgs = e.response.data;
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
        <form
            onSubmit={handleSubmit(signIn)}
            className={`${styles.form} container flex flex-col mx-auto sm:w-full md:w-96 border-2 mt-16 px-12 py-11 rounded`}
        >
            <Input
                id="email"
                label="Email"
                type="email"
                register={register("email", {
                    required: true,
                    pattern: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
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
                })}
                errors={errors}
                backendError={backendErrors?.password}
            />
            <Button className="mt-6" type="submit">
                Signin
            </Button>
        </form>
    );
};

export default SignInPage;
