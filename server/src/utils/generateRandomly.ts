import { QuestionDoc } from "../models/Question";

export const generateRandomly = (arr: QuestionDoc[], no: number) => {
    const temp = [...arr];
    const resp = [];

    for (let i = 0; i < no; i++) {
        const ind = randomIndex(temp.length);
        resp.push(temp[ind]);
        temp.splice(ind, 1);
    }

    return resp;
};

const randomIndex = (length: number) => Math.floor(Math.random() * length);
