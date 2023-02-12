import axios from "@/src/axios";
import SingleQuestion, {
    Question,
} from "@/src/components/Question/SingleQuestion";
import { GetServerSideProps } from "next";
import { Types } from "../create";

const EditQuestion = ({
    question,
    types,
}: {
    question: Question;
    types: Types;
}) => {
    return <SingleQuestion type="edit" question={question} types={types} />;
};

export const getServerSideProps: GetServerSideProps<
    {},
    { id: string }
> = async (ctx) => {
    try {
        const id = ctx.params?.id;

        const questionReq = axios(`/api/question/${id}`, {
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
                question: resp[0].data,
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

export default EditQuestion;
