import { Radio, RadioGroup } from "@mui/material";
import Button from "../Button";

export const Choices = ({ onChange, value, setValue, answer }: any) => {
    const addChoice = () => {
        onChange([...value, ""]);
    };

    const setChoice = (
        e: React.ChangeEvent<HTMLTextAreaElement>,
        i: number
    ) => {
        const choices = [...value];
        choices[i] = e.target.value;
        onChange(choices);
    };

    const setAnswer = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue("answer", e.target.value);
    };

    return (
        <>
            <label htmlFor="choices">Choices</label>
            <Button
                disabled={value?.length > 6}
                onClick={addChoice}
                type="button"
            >
                Add Choice
            </Button>
            <div id="choices" className="col-start-1 col-end-3">
                <RadioGroup
                    name="mcq-answer"
                    className="block"
                    value={answer}
                    onChange={setAnswer}
                >
                    {value?.map((choice: string, i: number) => (
                        <div key={i}>
                            <label
                                htmlFor={i.toString()}
                                className="mb-2 block"
                            >
                                Choice {String.fromCharCode(65 + i)}:
                            </label>
                            <textarea
                                rows={3}
                                id={i.toString()}
                                className="p-2 text-sm focus:outline-none block w-full"
                                onChange={(e) => setChoice(e, i)}
                            >
                                {choice}
                            </textarea>
                            <div className="flex justify-end">
                                <label className="text-sm font-sans ml-auto">
                                    Is the answer? <Radio value={i} />
                                </label>
                            </div>
                            <hr className="my-4" />
                        </div>
                    ))}
                </RadioGroup>
            </div>
        </>
    );
};
