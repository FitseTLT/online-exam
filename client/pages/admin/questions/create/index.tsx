import axios from "@/src/axios";
import { Category } from "@/src/components/Category/SingleCategory";
import SingleQuestion from "@/src/components/Question/SingleQuestion";
import { GetServerSideProps } from "next";

export default function CreateQuestion(types: Types) {
    return <SingleQuestion types={types} />;
}

export interface Types {
    categories: Category[];
    questionDifficulty: string[][];
    questionTypes: string[][];
}

export const getServerSideProps: GetServerSideProps<Types> = async (ctx) => {
    try {
        const resp = await axios("/api/types", {
            headers: {
                cookie: ctx.req.headers.cookie,
            },
        });

        return { props: resp.data };
    } catch (e) {
        console.log(e);
    }

    return {
        props: { categories: [], questionDifficulty: [], questionTypes: [] },
    };
};
