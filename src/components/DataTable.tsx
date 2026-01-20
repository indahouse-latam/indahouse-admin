'use client';

import React from 'react';

interface Column<T> {
    header: string;
    accessor: keyof T | ((item: T) => React.ReactNode);
    className?: string;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    onRowClick?: (item: T) => void;
    isLoading?: boolean;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    onRowClick,
    isLoading
}: DataTableProps<T>) {
    if (isLoading) {
        return (
            <div className="w-full h-64 flex items-center justify-center bg-secondary/10 border border-border rounded-xl">
                <div className="animate-pulse flex space-x-4">
                    <div className="rounded-full bg-zinc-700 h-10 w-10"></div>
                    <div className="flex-1 space-y-6 py-1">
                        <div className="h-2 bg-zinc-700 rounded"></div>
                        <div className="space-y-3">
                            <div className="grid grid-cols-3 gap-4">
                                <div className="h-2 bg-zinc-700 rounded col-span-2"></div>
                                <div className="h-2 bg-zinc-700 rounded col-span-1"></div>
                            </div>
                            <div className="h-2 bg-zinc-700 rounded"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-border rounded-xl bg-secondary/5">
            <table className="w-full text-left border-collapse">
                <thead className="bg-secondary/20 border-b border-border">
                    <tr>
                        {columns.map((column, idx) => (
                            <th
                                key={idx}
                                className={`p-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider ${column.className}`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {data.length > 0 ? (
                        data.map((item) => (
                            <tr
                                key={item.id}
                                onClick={() => onRowClick?.(item)}
                                className={`hover:bg-primary/5 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                            >
                                {columns.map((column, idx) => (
                                    <td key={idx} className={`p-4 text-sm ${column.className}`}>
                                        {typeof column.accessor === 'function'
                                            ? column.accessor(item)
                                            : (item[column.accessor] as React.ReactNode)}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={columns.length} className="p-8 text-center text-muted-foreground italic">
                                No se encontraron registros.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
