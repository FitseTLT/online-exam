import axios from "@/src/axios";
import SingleExam, { Exam } from "@/src/components/Exam/SingleExam";
import { GetServerSideProps } from "next";
import { Types } from "../create";

const EditExam = ({ exam, types }: { exam: Exam; types: Types }) => {
    return <SingleExam type="edit" exam={exam} types={types} />;
};

export const getServerSideProps: GetServerSideProps<
    {},
    { id: string }
> = async (ctx) => {
    try {
        const id = ctx.params?.id;

        const questionReq = axios(`/api/exam/${id}`, {
            headers: {
                cookie: ctx.req.headers.cookie,
            },
        });

        const typesReq = axios("/api/types", {
            headers: {
                cookie: ctx.req.headers.cookie,
            },
        });
        const resp = await Promise.all([questionReq, typesReq]);
        return {
            props: {
                exam: resp[0].data,
                types: resp[1].data,
            },
        };
    } catch (e) {
        console.log(e);
    }

    return {
        props: {},
    };
};

export default EditExam;
