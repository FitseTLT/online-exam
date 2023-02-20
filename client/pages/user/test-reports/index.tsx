import axios from "@/src/axios";
import { GetServerSideProps, NextPage } from "next";
import React, { useState } from "react";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { TestReport } from "@/src/components/TestReport/SingleTestReport";
import CardTestReport from "@/src/components/TestReport/CardTestReport";
import { Pagination } from "@mui/material";
import { Stack } from "@mui/system";

interface Props {
    testReports: TestReport[];
    count: number;
}

const TestReports: NextPage<Props> = function ({
    testReports: initialReports,
    count: initialCount,
}) {
    const [testReports, setTestReports] = useState(initialReports);
    const [count, setCount] = useState(initialCount);

    const onPageChange = async (page: number) => {
        try {
            const res = await axios(`/api/test-report?page=${page - 1}`);
            setTestReports(res.data.testReports);
            setCount(res.data.count);
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <div className="flex flex-col items-center max-w-full">
            {testReports?.map((testReport) => (
                <CardTestReport key={testReport.test} testReport={testReport} />
            ))}
            <Pagination
                count={Math.ceil(count / 10)}
                onChange={(e, page) => onPageChange(page)}
                className="my-7"
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
