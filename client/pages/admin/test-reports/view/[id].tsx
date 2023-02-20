import axios from "@/src/axios";
import SingleTestReport, {
    TestReport,
} from "@/src/components/TestReport/SingleTestReport";
import { GetServerSideProps } from "next";

const ViewTestReport = ({ testReport }: { testReport: TestReport }) => {
    return <SingleTestReport testReport={testReport} />;
};

export default ViewTestReport;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookie = ctx.req.headers.cookie;
    const id = ctx.params?.id;
    try {
        const testReportsRes = await axios(`/api/test-report/${id}`, {
            headers: { cookie },
        });

        const testReport = testReportsRes.data;

        return {
            props: { testReport },
        };
    } catch (e: any) {
        console.log(e.response.data);
    }

    return { props: {} };
};
