import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import styles from "./styles.module.css";

export interface TestReport {
    user: { name: string; email: string };
    test: string;
    exam: { name: string };
    attemptedOn: Date;
    timeTaken: number;
    totalQuestions: number;
    attemptedQuestions: number;
    correct: number;
    rank: number;
    percentile: number;
    sections: {
        category: { name: string };
        totalQuestions: number;
        attemptedQuestions: number;
        correct: number;
        rank: number;
        percentile: number;
    }[];
}

interface Props {
    testReport: TestReport;
}

export default function SingleTestReport({
    testReport: {
        user: { name: userName, email },
        exam: { name: examName },
        attemptedOn,
        timeTaken,
        totalQuestions,
        attemptedQuestions,
        correct,
        rank,
        percentile,
        sections,
    },
}: Props) {
    const [tabIndex, setTabIndex] = useState(0);
    const getTimeStr = (time: number) => {
        const secs = Number.parseInt((time % 60).toString());
        const mins = Number.parseInt(((time % 3600) / 60).toString());
        const hrs = Number.parseInt((time / 3600).toString());

        return ` ${hrs > 0 ? hrs + " hrs " : ""}${
            mins > 0 ? mins + " mins " : ""
        }${secs} secs`;
    };
    return (
        <div className="px-12">
            <div className="p-10 flex justify-start">
                <h1 className="font-bold">View Test Reports</h1>
            </div>
            <hr />

            <div className="max-w-[800px] p-8 mx-auto">
                <div className="flex justify-between mx-auto">
                    <div className={styles["top-divs"]}>
                        <span>Name:</span>
                        <span> {userName}</span>
                        <span>email: </span>
                        <span>{email}</span>
                        <span>Exam:</span>
                        <span> {examName}</span>
                        <span>Attempted On:</span>
                        <span>{new Date(attemptedOn).toString()}</span>
                    </div>
                    <div className={styles["top-divs"]}>
                        <span> Time taken:</span>
                        <span> {getTimeStr(timeTaken)}</span>
                        <span>Attempted:</span>
                        <span>
                            {attemptedQuestions} / {totalQuestions}
                        </span>
                        <span>Correct:</span>{" "}
                        <span>
                            {correct} / {totalQuestions}
                        </span>
                        <span>Rank:</span>
                        <span className="bg-cyan-400 rounded w-[70px] text-center">
                            {" "}
                            {rank}
                        </span>
                        <span>Percentile:</span>
                        <span> {percentile}</span>
                    </div>
                </div>
                <div className="mt-8">
                    <Tabs
                        scrollButtons="auto"
                        variant="scrollable"
                        value={tabIndex}
                        onChange={(_, value) => setTabIndex(value)}
                    >
                        {sections.map((_, i) => (
                            <Tab key={i} label={`Section ${i + 1}`}></Tab>
                        ))}
                    </Tabs>
                    <div className="p-8 mx-auto">
                        <div className={styles["top-divs"]}>
                            <span>Category:</span>
                            <span> {sections[tabIndex].category.name}</span>
                            <span>Attempted:</span>
                            <span>
                                {sections[tabIndex].attemptedQuestions} /
                                {sections[tabIndex].totalQuestions}
                            </span>
                            <span>Correct:</span>
                            <span>
                                {sections[tabIndex].correct} /
                                {sections[tabIndex].totalQuestions}
                            </span>
                            <span>Rank:</span>
                            <span> {sections[tabIndex].rank}</span>
                            <span>Percentile:</span>
                            <span> {sections[tabIndex].percentile}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
