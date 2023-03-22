import styles from "./profile.module.css";
import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import axios from "@/src/axios";
import { FieldValues, useForm } from "react-hook-form";
import Input from "@/src/components/Input";
import ErrorDisplay from "@/src/components/ErrorDisplay";
import { AxiosError } from "axios";

interface Props {
    name: string;
    avatar: string;
    updateProfile: (profile: { name: string; avatar: string }) => void;
}

const Profile = ({ name, avatar, updateProfile }: Props) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            name: name,
            password: "",
            new_password: "",
            confirm_password: "",
        },
    });

    const [backendError, setBackendError] = useState<AxiosError | undefined>();
    const [selectedFile, setSelectedFile] = useState<Blob | undefined>();
    const [selectedFilePath, setSelectedFilePath] = useState<string>(avatar);

    const onAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] as Blob;
        if (!file) return;
        setSelectedFile(file);
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onloadend = function () {
            setSelectedFilePath(reader.result as string);
        };
    };

    const onSubmit = async (data: FieldValues) => {
        try {
            const formData = new FormData();

            formData.append("avatar", selectedFile!);
            formData.set("name", data.name);
            formData.set("password", data.password);
            formData.set("new_password", data.new_password);
            formData.set("confirm_password", data.confirm_password);

            const res = await axios.put("/api/profile", formData);
            const { name, avatar } = res.data;
        } catch (e: any) {
            setBackendError(e);
            console.log(e);
        }
    };

    useEffect(() => {
        setValue("name", name);
    }, []);

    return (
        <form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            autoComplete="off"
        >
            <ErrorDisplay error={backendError} />
            <Input
                label="Name"
                type="text"
                autoComplete="off"
                register={register("name", {})}
                errors={errors}
            />
            <Input
                label="Previous Password"
                type="password"
                register={register("password", {})}
                errors={errors}
            />
            <Input
                label="New Password"
                type="password"
                register={register("new_password", {
                    validate: (value, formValues) => {
                        if (
                            value &&
                            !/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9]).{8,20}$/.test(
                                value
                            )
                        )
                            return "Password should be between 8 and 20 characters with at least one uppercase, lowercase letters and digit";
                        return true;
                    },
                })}
                errors={errors}
            />
            <Input
                label="Confirm Password"
                type="password"
                register={register("confirm_password", {
                    validate: (value, formValues) => {
                        if (
                            formValues.new_password &&
                            formValues.new_password !== value
                        )
                            return "New and confirm password are not equal";
                        return true;
                    },
                })}
                errors={errors}
            />
            <label>Avatar</label>
            <label
                htmlFor="avatar-selector"
                className="cursor-pointer justify-self-center"
            >
                <input
                    type="file"
                    className="hidden"
                    name="avatar"
                    accept="image/*"
                    id="avatar-selector"
                    onChange={onAvatarSelect}
                />
                <Avatar className="w-24 h-24" src={selectedFilePath} />
            </label>
            <input
                type="submit"
                value="Change Profile"
                className="cursor-pointer btn mx-auto mt-16 block bg-blue-500 p-2 text-white rounded-lg"
            />
        </form>
    );
};

export default Profile;
