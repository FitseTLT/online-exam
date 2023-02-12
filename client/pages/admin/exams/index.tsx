import axios from "@/src/axios";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import buttonStyles from "../../../styles/button.module.css";
import MUIDataTable, {
    Display,
    FilterType,
    MUIDataTableMeta,
    MUIDataTableState,
} from "mui-datatables";
import { tableStates } from "@/src/constants";
import { Types } from "./create";
import { Section } from "@/src/components/Exam/SingleExam";

interface Exam {
    id?: string;
    name: string;
    sections: Section[];
    totalEasy: number;
    totalMedium: number;
    totalHard: number;
    createdAt: string;
    updatedAt: string;
}

interface Props {
    exams: Exam[];
    count: number;
}

const examCols = [
    {
        name: "id",
        options: { display: "excluded" as Display, filter: false, sort: false },
    },
    {
        name: "name",
        label: "Name",
        options: {
            filter: false,
            sort: false,
            customBodyRender(value: string, tableMeta: MUIDataTableMeta) {
                const id = tableMeta.rowData[0];

                return <Link href={`/admin/exams/edit/${id}`}>{value}</Link>;
            },
        },
    },
    {
        name: "totalEasy",
        label: "No Easy Questions",
        options: { filter: false, sort: false },
    },
    {
        name: "totalMedium",
        label: "No Medium Questions",
        options: { filter: false, sort: false },
    },
    {
        name: "totalHard",
        label: "No Medium Questions",
        options: { filter: false, sort: false },
    },
    {
        name: "createdAt",
        label: "Created at",
        options: { filter: false, sort: false },
    },
    {
        name: "updatedAt",
        label: "Last Updated at",
        options: { filter: false, sort: false },
    },
];

const Exams: NextPage<Props> = function ({ exams, count: initialCount }) {
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState(exams);
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
                    href="/admin/exams/create"
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

export default Exams;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookie = ctx.req.headers.cookie;

    try {
        const resp = await axios("/api/exam", {
            headers: { cookie },
        });
        const { exams, count } = resp.data;

        exams.forEach((exam: any) => {
            exam.createdAt = new Date(exam.createdAt)
                .toLocaleString()
                .split(",")[0];
            exam.updatedAt = new Date(exam.updatedAt)
                .toLocaleString()
                .split(",")[0];
        });

        return {
            props: { exams, count },
        };
    } catch (e: any) {
        console.log(e);
    }

    return { props: { exams: [], count: 0 } };
};
