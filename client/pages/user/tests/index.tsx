import axios from "@/src/axios";
import { Test } from "@/src/components/Test/SingleTest";
import {
    Box,
    Card,
    CardActionArea,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from "@mui/material";
import { GetServerSideProps } from "next";
import Link from "next/dist/client/link";
import { useState } from "react";

const Tests = ({ tests }: { tests: Test[] }) => {
    const [open, setOpen] = useState(false);
    const [currTestId, setCurrTestId] = useState("");

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
                    <Box className="flex justify-end p-6">
                        <Dialog open={open} onClose={() => setOpen(false)}>
                            <DialogTitle>
                                Are you sure you want to start the test?
                            </DialogTitle>
                            <DialogContent>
                                Once you start the test you cannot quit.
                            </DialogContent>
                            <DialogActions>
                                <Link
                                    href={`/user/tests/start/${currTestId}`}
                                    className="btn m-2 bg-blue-400"
                                >
                                    Yeah Start Test
                                </Link>
                                <button
                                    onClick={() => setOpen(false)}
                                    className="p-2 text-sm rounded bg-gray-200 text-black"
                                >
                                    Cancel
                                </button>
                            </DialogActions>
                        </Dialog>
                        <button
                            className="btn bg-blue-400 ml-auto my-2 inline-block"
                            onClick={() => {
                                setCurrTestId(test.id as string);
                                setOpen(true);
                            }}
                        >
                            Start Test
                        </button>
                    </Box>
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
