import axios from "@/src/axios";
import { Timer } from "@/src/components/Timer";
import {
    Backdrop,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    NoSsr,
    Radio,
    RadioGroup,
    Tab,
    Tabs,
} from "@mui/material";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

interface Props {
    status?: string;
    message?: string;
    test?: Test;
    userAnswer: TestState[];
}

interface TestState {
    category: string;
    questions: { question: string; userAnswer: string | undefined }[];
}
interface Question {
    question: string;
    choices?: string[];
    _id: string;
    difficulty: string;
    type: string;
}

interface Section {
    category: { name: string; id: string };
    questions: Question[];
}

interface Test {
    user: string;
    test: string;
    exam: string;
    attemptedOn: Date;
    sections: Section[];
    totalAllottedTime: number;
}

const StartTest = ({ status, message, test, userAnswer }: Props) => {
    const [testState, setTestState] = useState<TestState[]>(userAnswer);
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [enforceSubmit, setEnforceSubmit] = useState(false);
    const [errorOnSubmit, setErrorOnSubmit] = useState(false);
    const [timeFinished, setTimeFinished] = useState(false);

    const [currQuestion, setCurrQuestion] = useState(
        test?.sections?.map(() => 0) ?? []
    );
    const [tabIndex, setTabIndex] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);

    const calculateTimeLeft = () => {
        if (!test) return 0;
        const secs = Number.parseInt(
            (
                (new Date().getTime() - new Date(test.attemptedOn).getTime()) /
                1000
            ).toString()
        );
        const timeLeft = test ? test.totalAllottedTime - secs : 0;
        if (timeLeft <= 0) return 0;

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        if (timeLeft <= 0) {
            setTimeFinished(true);
            setTimeLeft(0);
            setEnforceSubmit(true);
            setDialogOpen(true);
        }

        if (!timeFinished)
            setTimeout(() => {
                setTimeLeft(timeLeft - 1);
            }, 1000);
    }, [timeLeft]);

    if (status === "error" || !test)
        return (
            <div>
                <h3 className="text-center mt-10 text-red-400">Ooops !!!!</h3>
                <h3 className="text-center mt-10 text-red-400">{message}</h3>
            </div>
        );

    const submitTest = async () => {
        setDialogOpen(false);
        setLoading(true);
        setTimeFinished(true);

        const data = {
            test: test.test,
            attemptedOn: test.attemptedOn,
            timeTaken: test.totalAllottedTime - timeLeft,
            sections: testState,
        };

        try {
            const resp = await axios.post("/api/test/submit", data);
            router.replace("/");
        } catch (e) {
            setDialogOpen(true);
            setLoading(false);
            setEnforceSubmit(true);
            setErrorOnSubmit(true);
            console.log(e);
        }
    };

    const setAnswer = (answer: string) => {
        const test = structuredClone(testState);
        if (test)
            test[tabIndex].questions[currQuestion[tabIndex]].userAnswer =
                answer;

        setTestState(test);
        updateTestState(test);
    };

    const updateTestState = async (testState: TestState[]) => {
        try {
            const resp = await axios.put(`/api/test-state/${test.test}`, {
                userAnswer: testState,
            });
        } catch (e) {
            console.log(e);
        }
    };

    const changeQuestion = (type: "prev" | "next") => {
        const questionIndexes = structuredClone(currQuestion);

        if (type === "prev") {
            if (questionIndexes[tabIndex] > 0) questionIndexes[tabIndex]--;
            else if (tabIndex > 0) setTabIndex(tabIndex - 1);
        } else {
            if (
                questionIndexes[tabIndex] <
                test.sections[tabIndex].questions.length - 1
            )
                questionIndexes[tabIndex]++;
            else if (tabIndex < test.sections.length - 1)
                setTabIndex(tabIndex + 1);
        }

        setCurrQuestion(questionIndexes);
    };

    return (
        <NoSsr>
            <div className="container relative border-2 p-12 max-w-[800px] m-[20px] mx-auto flex flex-col items-center justify-center">
                <Backdrop open={loading}>
                    <CircularProgress />
                </Backdrop>
                <h1 className="text-lg font-bold text-center">
                    Exam: {test?.exam}
                </h1>
                <div className="flex flex-col items-end">
                    <Dialog open={dialogOpen}>
                        <DialogTitle>
                            {!enforceSubmit
                                ? "Are you sure you want to submit the test?"
                                : errorOnSubmit
                                ? "Error occurred on submitting"
                                : "Time is Up!!!!"}
                        </DialogTitle>
                        {!enforceSubmit && (
                            <DialogContent>
                                Once you submit the test you cannot reverse.
                            </DialogContent>
                        )}
                        <DialogActions>
                            <button
                                onClick={submitTest}
                                className="btn m-2 bg-blue-400"
                            >
                                Submit Test
                            </button>
                            {!enforceSubmit && (
                                <button
                                    onClick={() => setDialogOpen(false)}
                                    className="p-2 text-sm rounded bg-gray-200 text-black"
                                >
                                    Cancel
                                </button>
                            )}
                        </DialogActions>
                    </Dialog>
                </div>
                <hr className="w-[80%] my-5" />
                <div className="flex justify-between w-full items-center">
                    <Tabs
                        className="btn self-start"
                        value={tabIndex}
                        scrollButtons="auto"
                        variant="scrollable"
                        allowScrollButtonsMobile={true}
                        onChange={(e, index) => setTabIndex(index)}
                    >
                        {test?.sections?.map((_: any, i: number) => (
                            <Tab key={i} label={`Section${i + 1}`}></Tab>
                        ))}
                    </Tabs>
                    <Timer timer={timeLeft} />
                </div>

                <div className="border-2 w-full p-8 flex flex-col min-h-[400px]">
                    <div className="flex justify-between">
                        <p className="text-right">
                            Category:{" "}
                            <span className="font-bold">
                                {" "}
                                {test.sections[tabIndex].category.name}
                            </span>
                        </p>
                        <p>
                            {currQuestion[tabIndex] + 1}/
                            {test.sections[tabIndex].questions.length}
                        </p>
                    </div>
                    <p className="mt-8 font-bold">Question: </p>
                    <p className="font-serif font-normal pl-5">
                        {
                            test.sections[tabIndex].questions[
                                currQuestion[tabIndex]
                            ]?.question
                        }
                    </p>

                    <hr className="my-6" />
                    {test?.sections?.[tabIndex].questions[
                        currQuestion[tabIndex]
                    ].type === "mcq" && (
                        <RadioGroup
                            name="mcq-answer"
                            key={
                                test.sections[tabIndex].questions[
                                    currQuestion[tabIndex]
                                ]?.question
                            }
                            className="block"
                            value={
                                testState?.[tabIndex].questions[
                                    currQuestion[tabIndex]
                                ].userAnswer
                            }
                            onChange={(e, value) => setAnswer(value)}
                        >
                            {test.sections[tabIndex].questions[
                                currQuestion[tabIndex]
                            ]?.choices?.map((choice: string, i: number) => (
                                <div key={i}>
                                    <div className="flex ml-6">
                                        <label className="text-sm font-sans">
                                            <Radio
                                                value={i}
                                                name="mcq-answer"
                                            />{" "}
                                            {choice}
                                        </label>
                                    </div>
                                </div>
                            ))}
                        </RadioGroup>
                    )}
                    {test?.sections?.[tabIndex].questions[
                        currQuestion[tabIndex]
                    ].type === "true-false" && (
                        <RadioGroup
                            name="answer"
                            className="block"
                            key={
                                test.sections[tabIndex].questions[
                                    currQuestion[tabIndex]
                                ]?.question
                            }
                            value={
                                testState?.[tabIndex].questions[
                                    currQuestion[tabIndex]
                                ].userAnswer
                            }
                            onChange={(e, value) => setAnswer(value)}
                        >
                            <div>
                                <div className="flex ml-6">
                                    <label className="text-sm font-sans">
                                        <Radio value="true" name="answer" />{" "}
                                        True
                                    </label>
                                </div>
                            </div>
                            <div>
                                <div className="flex ml-6">
                                    <label className="text-sm font-sans">
                                        <Radio value="false" name="answer" />{" "}
                                        False
                                    </label>
                                </div>
                            </div>
                        </RadioGroup>
                    )}
                    {test?.sections?.[tabIndex].questions[
                        currQuestion[tabIndex]
                    ].type === "write-answer" && (
                        <input
                            className="p-1"
                            key={
                                test.sections[tabIndex].questions[
                                    currQuestion[tabIndex]
                                ]?.question
                            }
                            value={
                                testState?.[tabIndex].questions[
                                    currQuestion[tabIndex]
                                ].userAnswer
                            }
                            onChange={(e) => setAnswer(e.currentTarget.value)}
                        />
                    )}
                </div>
                <div className="w-full mt-5 mr-4 flex justify-between items-center">
                    <div>
                        <button
                            className="btn bg-blue-400 mr-4 w-[90px]"
                            onClick={() => changeQuestion("prev")}
                            disabled={
                                tabIndex === 0 && currQuestion[tabIndex] === 0
                            }
                        >
                            Previous
                        </button>
                        <button
                            className="btn bg-blue-400 w-[90px]"
                            onClick={() => changeQuestion("next")}
                            disabled={
                                tabIndex === test.sections.length - 1 &&
                                currQuestion[tabIndex] ===
                                    test.sections[tabIndex].questions.length - 1
                            }
                        >
                            Next
                        </button>
                    </div>
                    <button
                        className="btn bg-orange-400"
                        onClick={() => setDialogOpen(true)}
                    >
                        Submit Test
                    </button>
                </div>
            </div>
        </NoSsr>
    );
};

export default StartTest;

export const getServerSideProps: GetServerSideProps<{}> = async (ctx) => {
    try {
        const cookie = ctx.req.headers.cookie;
        const test = ctx.params?.id;

        const resp = await axios.post(
            "/api/test/start",
            { test },
            {
                headers: { cookie },
            }
        );
        const { testData, userAnswer } = resp.data;

        return { props: { test: testData, userAnswer } };
    } catch (e: any) {
        return {
            props: {
                status: "error",
                message:
                    e?.response?.data[0]?.message ?? "Something wrong occurred",
            },
        };
    }
};
