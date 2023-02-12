import axios from "@/src/axios";
import TableList from "@/src/components/TableList";
import { Divider } from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import buttonStyles from "../../../styles/button.module.css";

interface Props {
    categories: { name: string; code: string; id: string }[];
}

const categoryCols = [
    {
        label: "Name",
        key: "name",
        isLink: true,
    },
    {
        label: "Code",
        key: "code",
    },
];

const Categories: NextPage<Props> = function ({ categories }) {
    return (
        <div>
            <div className="p-10 flex justify-end">
                <Link
                    href="/admin/categories/create"
                    className={`bg-blue-500 mr-auto p ${buttonStyles.btn}`}
                >
                    Create New
                </Link>
            </div>
            <Divider />
            <TableList
                link="/admin/categories/edit"
                list={categories}
                cols={categoryCols}
            />
        </div>
    );
};

export default Categories;

export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const cookie = ctx.req.headers.cookie;

    try {
        const res = await axios("/api/categories", { headers: { cookie } });
        const categories = res.data;

        return { props: { categories } };
    } catch (e: any) {
        console.log(e?.response);
    }

    return { props: { categories: [] } };
};
