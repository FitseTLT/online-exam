import axios from "@/src/axios";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import buttonStyles from "../../../styles/button.module.css";
import MUIDataTable, {
    Display,
    MUIDataTableMeta,
    MUIDataTableState,
} from "mui-datatables";
import { tableStates } from "@/src/constants";
import { Test } from "@/src/components/Test/SingleTest";
import buttonStyle from "../../../styles/button.module.css";

interface Props {
    tests: Test[];
    count: number;
}

const sendTest = async (e: React.MouseEvent<HTMLButtonElement>, id: string) => {
    e.currentTarget.disabled = true;
    e.currentTarget.innerText = "Sending ...";
    try {
        const resp = await axios.post("/api/send-test", { id });
        e.currentTarget.innerText = "Email Sent";
    } catch (ev) {}
};

const examCols = [
    {
        name: "id",
        options: { display: "excluded" as Display, filter: false, sort: false },
    },
    {
        name: "userEmail",
        label: "User Email",
        options: {
            filter: false,
            sort: false,
            customBodyRender(value: string, tableMeta: MUIDataTableMeta) {
                const id = tableMeta.rowData[0];

                return <Link href={`/admin/tests/edit/${id}`}>{value}</Link>;
            },
        },
    },
    { name: "exam", label: "Exam", options: { filter: true, sort: false } },
    {
        name: "from",
        label: "From",
        options: { filter: true, sort: false },
    },
    {
        name: "to",
        label: "To",
        options: { filter: false, sort: false },
    },
    {
        name: "emailSent",
        label: "Send Email",
        options: {
            customBodyRender(value: string, tableMeta: MUIDataTableMeta) {
                const id = tableMeta.rowData[0];
                const emailSent = tableMeta.rowData[5];
                return (
                    <button
                        className={buttonStyle["list-btn"]}
                        disabled={emailSent}
                        onClick={(e) => sendTest(e, id)}
                    >
                        {emailSent ? "Email Sent" : "Send Test"}
                    </button>
                );
            },
        },
    },
];

const Tests: NextPage<Props> = function ({ tests, count: initialCount }) {
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState(tests);
    const [count, setCount] = useState(initialCount);

    const onFilter = async (tableState: MUIDataTableState) => {
        setIsLoading(true);
        try {
            let query = "?page=" + tableState.page;
            query +=
                tableState.searchText !== null
                    ? "&name=" + tableState.searchText
                    : "";

            const res = await axios(`/api/exam${query}`);

            const { exams, count } = res.data;
            exams.forEach((exam: any) => {
                exam.createdAt = new Date(exam.createdAt)
                    .toLocaleString()
                    .split(", ")[0];
                exam.updateAt = new Date(exam.updateAt)
                    .toLocaleString()
                    .split(", ")[0];
            });
            setData(exams);
            setCount(count);
        } catch (e: any) {
            console.log(e);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <div className="p-10 flex justify-end">
                <Link
                    href="/admin/tests/create"
                    className={`bg-blue-500 mr-auto p ${buttonStyles.btn}`}
                >
                    Create New
                </Link>
            </div>
            <Divider />
            <MUIDataTable
                title={
                    <Typography>
                        Exams {isLoading && <CircularProgress />}
                    </Typography>
                }
                data={data}
                columns={examCols}
                options={{
                    count,
                    serverSide: true,
                    rowsPerPageOptions: [],
                    filter: true,
                    async onTableChange(action, tableState) {
                        if (tableStates.includes(action))
                            await onFilter(tableState);
                    },
                }}
            />
        </div>
    );
};

export default Tests;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookie = ctx.req.headers.cookie;

    try {
        const resp = await axios("/api/test", {
            headers: { cookie },
        });
        const { tests, count } = resp.data;

        tests.forEach((test: any) => {
            test.exam = test.exam.name;
            test.from &&
                (test.from = new Date(test.from)
                    .toLocaleString()
                    .split(",")[0]);
            test.to &&
                (test.to = new Date(test.to).toLocaleString().split(",")[0]);
        });

        return {
            props: { tests, count },
        };
    } catch (e: any) {
        console.log(e);
    }

    return { props: { tests: [], count: 0 } };
};
