import axios from "@/src/axios";
import { CircularProgress, Divider, Typography } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import MUIDataTable, {
    Display,
    FilterType,
    MUIDataTableColumn,
    MUIDataTableMeta,
    MUIDataTableState,
} from "mui-datatables";
import { tableStates } from "@/src/constants";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { TestReport } from "@/src/components/TestReport/SingleTestReport";

interface Props {
    testReports: TestReport[];
    count: number;
}

const testReportCols = [
    {
        name: "_id",
        options: { display: "excluded" as Display, filter: false, sort: false },
    },
    {
        label: "User Name",
        name: "user",
        options: {
            filter: false,
            sort: false,
            filterType: "textField" as FilterType,

            customBodyRender(value: string, tableMeta: MUIDataTableMeta) {
                const id = tableMeta.rowData[0];
                const name = tableMeta.rowData[1].name;

                return (
                    <Link href={`/admin/test-reports/view/${id}`}>{name}</Link>
                );
            },
        },
    },
    {
        label: "Exam Name",
        name: "exam",
        options: {
            filter: true,
            sort: false,
            filterType: "textField" as FilterType,

            customBodyRender(value: string, tableMeta: MUIDataTableMeta) {
                const id = tableMeta.rowData[0];
                const name = tableMeta.rowData[2].name;

                return (
                    <Link href={`/admin/test-reports/view/${id}`}>{name}</Link>
                );
            },
        },
    },
    {
        label: "Attempted On",
        name: "attemptedOn",
        options: {
            filter: true,
            sort: false,
            filterType: "custom" as FilterType,
            customBodyRender(value: string, tableMeta: MUIDataTableMeta) {
                try {
                    return new Date(value).toLocaleString();
                } catch (e) {
                    return value;
                }
            },
            filterOptions: {
                fullWidth: true,
                display: (
                    filterList: any,
                    onChange: Function,
                    index: number,
                    column: MUIDataTableColumn
                ) => {
                    return (
                        <DateRangePicker
                            className="mt-4 self-center  col-start-1 col-end-3"
                            ranges={[
                                {
                                    startDate: new Date(
                                        filterList[index]?.[0] ?? new Date()
                                    ),
                                    endDate: new Date(
                                        filterList[index]?.[1] ?? new Date()
                                    ),
                                },
                            ]}
                            onChange={({ range1: { startDate, endDate } }) => {
                                filterList[index] = [
                                    startDate?.toLocaleDateString(),
                                    endDate?.toLocaleDateString(),
                                ];
                                onChange(filterList[index], index, column);
                            }}
                        />
                    );
                },
            },
        },
    },
    {
        label: "Rank",
        name: "rank",
        options: { filter: false, sort: false },
    },
    {
        label: "Percentile ( % )",
        name: "percentile",
        options: { filter: false, sort: false },
    },
];

const TestReports: NextPage<Props> = function ({
    testReports,
    count: initialCount,
}) {
    const [isLoading, setIsLoading] = useState(false);

    const [data, setData] = useState(testReports);
    const [count, setCount] = useState(initialCount);

    const onFilter = async (tableState: MUIDataTableState) => {
        setIsLoading(true);

        try {
            let query = "?page=" + tableState.page;
            query +=
                tableState.searchText !== null
                    ? "&user=" + tableState.searchText
                    : "";

            tableState.filterList.forEach((value, i) => {
                if (value.length) {
                    const key = tableState.columns[i].name;

                    switch (key) {
                        case "exam":
                            query += `&${key}=${value?.[0]}`;
                            break;
                        case "attemptedOn":
                            value[0] && (query += `&from=${value?.[0]}`);
                            value[1] && (query += `&to=${value?.[1]}`);
                            break;
                    }
                }
            });

            const res = await axios(`/api/test-report${query}`);

            const { testReports, count } = res.data;

            setData(testReports);
            setCount(count);
        } catch (e: any) {
            console.log(e);
        }
        setIsLoading(false);
    };

    return (
        <div>
            <div className="p-10 flex justify-start">
                <h1 className="font-bold">View Test Reports</h1>
            </div>
            <Divider />
            <MUIDataTable
                title={
                    <Typography>
                        Questions {isLoading && <CircularProgress />}
                    </Typography>
                }
                data={data}
                columns={testReportCols}
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

export default TestReports;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookie = ctx.req.headers.cookie;

    try {
        const testReportsRes = await axios("/api/test-report", {
            headers: { cookie },
        });

        const { testReports, count } = testReportsRes.data;

        return {
            props: { testReports, count },
        };
    } catch (e: any) {
        console.log(e);
    }

    return { props: { questions: [], count: 0 } };
};
