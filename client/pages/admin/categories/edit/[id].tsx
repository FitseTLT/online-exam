import axios from "@/src/axios";
import SingleCategory, {
    Category,
} from "@/src/components/Category/SingleCategory";
import { GetServerSideProps } from "next";

const EditCategory = ({ category }: { category: Category }) => {
    return <SingleCategory type="edit" category={category} />;
};

export const getServerSideProps: GetServerSideProps<
    {},
    { id: string }
> = async (ctx) => {
    try {
        const id = ctx.params?.id;

        const resp = await axios(`/api/category/${id}`, {
            headers: {
                cookie: ctx.req.headers.cookie,
            },
        });

        const category = resp.data;

        return { props: { category } };
    } catch (e) {
        console.log(e);
    }

    return {
        props: {},
    };
};

export default EditCategory;
