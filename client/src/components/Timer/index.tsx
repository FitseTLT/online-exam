export const Timer = ({ timer }: { timer: number }) => {
    const getTimeStr = (timer: number) => {
        const secs = String(timer % 60).padStart(2, "0");
        const mins = String(
            Number.parseInt(((timer % 3600) / 60).toString())
        ).padStart(2, "0");
        const hrs = String(Number.parseInt((timer / 3600).toString())).padStart(
            2,
            "0"
        );
        return ` ${hrs}:${mins}:${secs}`;
    };

    return (
        <span className="block-inline">
            <h2 className="bg-gray-400 text-md p-2">
                Time Left: {getTimeStr(timer)}
            </h2>
        </span>
    );
};
