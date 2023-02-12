import axios from "@/src/axios";
import { Test } from "@/src/components/Test/SingleTest";
import { Card, CardActionArea, CardContent } from "@mui/material";
import { GetServerSideProps } from "next";

const Tests = ({ tests }: { tests: Test[] }) => {
    return (
        <div className="container mx-auto p-12 flex flex-wrap justify-center">
            {tests.map((test) => (
                <Card key={test.id} className="w-[400px] m-8">
                    <CardContent>
                        <h6 className="mb-6 font-bold text-center">
                            {test.exam?.name}
                        </h6>
                        <ul className="ml-6">
                            <li>
                                Active From :{" "}
                                {test.from
                                    ? new Date(test?.from).toDateString()
                                    : "   "}
                            </li>
                            <li>
                                Active To :{" "}
                                {test.to
                                    ? new Date(test.to).toDateString()
                                    : "   "}
                            </li>
                        </ul>
                    </CardContent>
                    <CardActionArea className="flex justify-end p-6">
                        <button className="btn bg-blue-400 ml-auto">
                            Start Test
                        </button>
                    </CardActionArea>
                </Card>
            ))}
        </div>
    );
};

export default Tests;

export const getServerSideProps: GetServerSideProps<{ tests: Test[] }> = async (
    ctx
) => {
    const cookie = ctx.req.headers.cookie;
    try {
        const resp = await axios("/api/test/user", {
            headers: { cookie },
        });

        const { tests } = resp.data as { tests: Test[] };

        return {
            props: { tests },
        };
    } catch (e) {
        console.log(e);
    }

    return { props: { tests: [] } };
};
