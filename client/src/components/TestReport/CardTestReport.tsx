import { ExpandMore } from "@mui/icons-material";
import {
    Card,
    CardActions,
    CardHeader,
    Collapse,
    Tab,
    Tabs,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
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

export default function CardTestReport({
    testReport: {
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
    const [expanded, setExpanded] = useState(false);
    const getTimeStr = (time: number) => {
        const secs = Number.parseInt((time % 60).toString());
        const mins = Number.parseInt(((time % 3600) / 60).toString());
        const hrs = Number.parseInt((time / 3600).toString());

        return ` ${hrs > 0 ? hrs + " hrs " : ""}${
            mins > 0 ? mins + " mins " : ""
        }${secs} secs`;
    };
    return (
        <div className="p-6 max-w-full">
            <Card className="p-8 mx-auto max-w-full">
                <CardHeader
                    title={`Exam: ${examName}`}
                    titleTypographyProps={{
                        variant: "h6",
                        color: "indigo",
                    }}
                />
                <hr className="mb-8" />
                <div className="flex justify-between mx-auto">
                    <div className={styles["top-divs"]}>
                        <span>Attempted On:</span>
                        <span>{new Date(attemptedOn).toString()}</span>
                        <span> Time taken:</span>
                        <span> {getTimeStr(timeTaken)}</span>
                        <span>Attempted:</span>
                        <span>
                            {attemptedQuestions} / {totalQuestions}
                        </span>
                    </div>
                    <div className={styles["top-divs"]}>
                        <span>Correct:</span>
                        <span>
                            {correct} / {totalQuestions}
                        </span>
                        <span>Rank:</span>
                        <span>
                            <span className="bg-cyan-400 rounded w-[70px] inline-block text-center">
                                {rank}
                            </span>
                        </span>
                        <span>Percentile:</span>
                        <span> {percentile}</span>
                    </div>
                </div>
                <CardActions>
                    <ExpandMore
                        onClick={() => setExpanded(!expanded)}
                        className="ml-auto"
                    >
                        <ExpandMoreIcon />
                    </ExpandMore>
                </CardActions>
                <Collapse in={expanded} unmountOnExit timeout="auto">
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
                            <div className={styles["bottom-div"]}>
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
                </Collapse>
            </Card>
        </div>
    );
}
