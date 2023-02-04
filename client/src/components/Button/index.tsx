import React from "react";
import styles from "./Button.module.css";

export default function Button({
    className,
    ...restProps
}: React.ComponentPropsWithoutRef<"button">) {
    return (
        <button
            className={`${styles.button} ${className || ""}`}
            {...restProps}
        ></button>
    );
}
