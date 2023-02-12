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
import { NextPage } from "next";
import Link from "next/link";
import React, { useState } from "react";

interface Props {
    cols: {
        key: string;
        label: string;
        isLink?: boolean;
        className?: string;
    }[];
    list: any[];
    link: string;
}

const TableList = function ({ cols, list, link }: Props) {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(2);

    const onPageChange = (
        e: React.MouseEvent<HTMLButtonElement> | null,
        page: number
    ) => {
        setPage(page);
    };

    return (
        <TableContainer className="p-4">
            <Table className="font-sans">
                <TableHead>
                    <TableCell>No</TableCell>
                    {cols.map(({ label, key }) => (
                        <TableCell key={key} id={key}>
                            {label}
                        </TableCell>
                    ))}
                </TableHead>
                <TableBody>
                    {list
                        .slice(page * rowsPerPage, rowsPerPage * (page + 1))
                        .map((data, i) => (
                            <TableRow key={data.id}>
                                <TableCell>
                                    {page * rowsPerPage + i + 1}
                                </TableCell>
                                {cols.map(({ key, isLink, className }) =>
                                    isLink ? (
                                        <TableCell key={data.id + key}>
                                            <Link
                                                className={`text-blue-500 ${
                                                    className ?? ""
                                                }`}
                                                href={`${link}/${data.id}`}
                                            >
                                                {data[key]}
                                            </Link>
                                        </TableCell>
                                    ) : (
                                        <TableCell key={data.id + key}>
                                            {data[key]}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        ))}
                </TableBody>
                <TableFooter>
                    <TableCell colSpan={cols.length} className="border-none">
                        <TablePagination
                            component="div"
                            rowsPerPage={rowsPerPage}
                            count={list.length}
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
    );
};

export default TableList;
