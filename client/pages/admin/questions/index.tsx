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

interface Props {
    questions: {
        question: string;
        category: string;
        type: string;
        difficulty: string;
        createdAt: Date;
    }[];
    count: number;
    types: Types;
}

const questionCols = (types: Types) => [
    {
        name: "id",
        options: { display: "excluded" as Display, filter: false, sort: false },
    },
    {
        label: "Question",
        name: "question",
        options: {
            filter: false,
            sort: false,
            filterType: "textField" as FilterType,

            customBodyRender(value: string, tableMeta: MUIDataTableMeta) {
                const id = tableMeta.rowData[0];

                return (
                    <Link href={`/admin/questions/edit/${id}`}>{value}</Link>
                );
            },
        },
    },
    {
        label: "Category",
        name: "category",
        options: {
            filter: true,
            sort: false,
            filterOptions: {
                names: types.categories.map(({ name }) => name),
            },
        },
    },
    {
        label: "Type",
        name: "type",
        options: { filter: true, sort: false },
        filterOptions: {
            names: types.questionTypes.map((type) => type[0]),
        },
    },
    {
        label: "Difficulty",
        name: "difficulty",
        options: { filter: true, sort: false },
        filterOptions: {
            names: types.questionDifficulty.map((difficulty) => difficulty[0]),
        },
    },
    {
        label: "Created at",
        name: "createdAt",
        options: { sort: true, filter: false },
    },
];

const Questions: NextPage<Props> = function ({
    questions,
    count: initialCount,
    types,
}) {
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState(questions);
    const [count, setCount] = useState(initialCount);

    const onFilter = async (tableState: MUIDataTableState) => {
        setIsLoading(true);
        try {
            let query = "?page=" + tableState.page;
            query +=
                tableState.searchText !== null
                    ? "&question=" + tableState.searchText
                    : "";

            tableState.filterList.forEach((value, i) => {
                if (value[0]) {
                    const key = tableState.columns[i].name;
                    let queryValue;

                    switch (key) {
                        case "category":
                            queryValue = types.categories.find(
                                (category) => category.name === value[0]
                            )?.id;
                            break;
                        case "type":
                            queryValue = types.questionTypes.find(
                                (type) => type[0] === value[0]
                            )?.[1];
                            break;
                        case "difficulty":
                            queryValue = types.questionDifficulty.find(
                                (difficulty) => difficulty[0] === value[0]
                            )?.[1];
                            break;
                    }

                    query += `&${key}=${queryValue}`;
                }
            });

            const res = await axios(`/api/question${query}`);

            const { questions, count } = res.data;
            questions.forEach(
                (question: any) =>
                    (question.createdAt = new Date(question.createdAt)
                        .toLocaleString()
                        .split(", ")[0])
            );
            setData(questions);
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
                    href="/admin/questions/create"
                    className={`bg-blue-500 mr-auto p ${buttonStyles.btn}`}
                >
                    Create New
                </Link>
            </div>
            <Divider />
            <MUIDataTable
                title={
                    <Typography>
                        Questions {isLoading && <CircularProgress />}
                    </Typography>
                }
                data={data}
                columns={questionCols(types)}
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

export default Questions;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookie = ctx.req.headers.cookie;

    try {
        const questionsReq = axios("/api/question", {
            headers: { cookie },
        });

        const typesReq = axios("/api/types", {
            headers: {
                cookie,
            },
        });

        const resp = await Promise.all([questionsReq, typesReq]);

        const { questions, count } = resp[0].data;
        const types = resp[1].data;

        questions.forEach(
            (question: any) =>
                (question.createdAt = new Date(question.createdAt)
                    .toLocaleString()
                    .split(", ")[0])
        );

        return {
            props: { questions, count, types },
        };
    } catch (e: any) {
        console.log(e);
    }

    return { props: { questions: [], count: 0 } };
};
