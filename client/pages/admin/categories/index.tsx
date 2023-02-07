import axios from "@/src/axios";
import { ArrowBack } from "@mui/icons-material";
import {
    Divider,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableFooter,
    TableHead,
    TablePagination,
    TableRow,
} from "@mui/material";
import { GetServerSideProps, NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";
import buttonStyles from "../../../styles/button.module.css";

interface Props {
    categories: { name: string; code: string; id: string }[];
}

const Categories: NextPage<Props> = function ({ categories }) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

    const onPageChange = (
        e: React.MouseEvent<HTMLButtonElement> | null,
        page: number
    ) => {
        setPage(page);
    };

    return (
        <div>
            <div className="p-10 flex justify-end">
                <Link
                    href="/admin/categories/create"
                    className={`bg-blue-500 ml-auto p ${buttonStyles.btn}`}
                >
                    Create New
                </Link>
            </div>
            <Divider />
            <TableContainer>
                <Table className="font-sans">
                    <TableHead>
                        <TableCell>No</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Code</TableCell>
                    </TableHead>
                    <TableBody>
                        {categories
                            .slice(page * rowsPerPage, rowsPerPage * (page + 1))
                            .map(({ id, name, code }, i) => (
                                <TableRow key={id}>
                                    <TableCell>
                                        {page * rowsPerPage + i + 1}
                                    </TableCell>
                                    <TableCell>
                                        <Link
                                            className="text-blue-500"
                                            href={`/admin/categories/edit/${id}`}
                                        >
                                            {name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{code}</TableCell>
                                </TableRow>
                            ))}
                    </TableBody>
                    <TableFooter>
                        <TableCell colSpan={3} className="border-none">
                            <TablePagination
                                component="div"
                                rowsPerPage={rowsPerPage}
                                count={categories.length}
                                page={page}
                                onPageChange={onPageChange}
                                onRowsPerPageChange={(
                                    e: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setRowsPerPage(Number(e.target.value));
                                }}
                            ></TablePagination>
                        </TableCell>
                    </TableFooter>
                </Table>
            </TableContainer>
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
