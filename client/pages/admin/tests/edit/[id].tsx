import axios from "@/src/axios";
import SingleTest, { Test } from "@/src/components/Test/SingleTest";
import { GetServerSideProps } from "next";

const EditTest = ({ test }: { test: Test }) => {
    return <SingleTest type="edit" test={test} />;
};

export const getServerSideProps: GetServerSideProps<
    {},
    { id: string }
> = async (ctx) => {
    try {
        const id = ctx.params?.id;

        const resp = await axios(`/api/test/${id}`, {
            headers: {
                cookie: ctx.req.headers.cookie,
            },
        });
        const test = resp.data;

        return {
            props: {
                test,
            },
        };
    } catch (e) {
        console.log(e);
    }

    return {
        props: {},
    };
};

export default EditTest;
