import { Tab, Tabs } from "@mui/material";
import { useState } from "react";
import Button from "../Button";
import { Category } from "../Category/SingleCategory";
import { Section } from "../Exam/SingleExam";

const initialSection = {
    easy: 0,
    medium: 0,
    hard: 0,
};

export const Sections = ({ onChange, value, categories }: any) => {
    const [tabIndex, setTabIndex] = useState(0);

    const addSection = () => {
        onChange([...value, { ...initialSection, category: categories[0].id }]);
    };

    const setSection = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
        ind: number
    ) => {
        const sections = [...value];

        sections[ind][e.target.name] = e.target.value;
        onChange(sections);
    };

    return (
        <>
            <label htmlFor="choices">Choices</label>
            <Button
                disabled={value?.length > 6}
                onClick={addSection}
                type="button"
            >
                Add Section
            </Button>
            <Tabs
                className="btn self-center  col-start-1 col-end-3"
                value={tabIndex}
                scrollButtons="auto"
                variant="scrollable"
                allowScrollButtonsMobile={true}
                onChange={(e, index) => setTabIndex(index)}
            >
                {value.map((_: any, i: number) => (
                    <Tab key={i} label={`Section${i + 1}`}></Tab>
                ))}
            </Tabs>
            {value.map(
                (section: Section, ind: number) =>
                    ind === tabIndex && (
                        <div
                            hidden={ind !== tabIndex}
                            key={ind}
                            className="col-start-1 col-end-3 grid grid-cols-2"
                        >
                            <label htmlFor="category">Category</label>
                            <select
                                name="category"
                                value={section.category}
                                onChange={(e) => setSection(e, ind)}
                                id="category"
                                className="py-2 px-4 text-sm"
                            >
                                {categories.map(
                                    ({ name, id }: Category, i: number) => (
                                        <option key={id} value={id}>
                                            {name}
                                        </option>
                                    )
                                )}
                            </select>
                            {["easy", "medium", "hard"].map((difficulty) => (
                                <>
                                    <label htmlFor={difficulty}>
                                        {difficulty[0].toUpperCase() +
                                            difficulty.slice(1)}
                                    </label>
                                    <input
                                        id={difficulty}
                                        type="number"
                                        min={0}
                                        name={difficulty}
                                        value={
                                            section[difficulty as keyof Section]
                                        }
                                        onChange={(e) => setSection(e, ind)}
                                        className="p-2 text-sm"
                                    />
                                </>
                            ))}
                        </div>
                    )
            )}
        </>
    );
};
