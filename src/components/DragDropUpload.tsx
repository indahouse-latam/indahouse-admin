'use client';

import React, { useCallback, useState } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import { Upload } from 'lucide-react';

interface DragDropUploadProps {
    onFilesDrop: (files: File[]) => void;
    accept?: Record<string, string[]>;
    maxFiles?: number;
    maxSize?: number;
    title: string;
    description?: string;
    fileTypeDescription?: string;
    className?: string;
    error?: string;
}

export const DragDropUpload = ({
    onFilesDrop,
    accept = {
        'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles = 15,
    maxSize = 10485760, // 10MB by default
    title,
    description = 'o navega en tu ordenador para cargarlos.',
    fileTypeDescription = '(.jpeg, .png, .jpg)',
    className,
    error
}: DragDropUploadProps) => {
    const [isDragging, setIsDragging] = useState(false);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        onFilesDrop(acceptedFiles);
    }, [onFilesDrop]);

    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject,
        fileRejections
    } = useDropzone({
        onDrop,
        accept,
        maxFiles,
        maxSize,
        onDragEnter: () => setIsDragging(true),
        onDragLeave: () => setIsDragging(false)
    });

    const borderColor = isDragAccept
        ? 'border-green-500'
        : isDragReject
            ? 'border-red-500'
            : isDragging
                ? 'border-blue-500' // Changed to blue-500 to match standard tailwind used in admin
                : 'border-border'; // Using border-border from shadcn/ui

    const rejectionErrors = fileRejections.length > 0
        ? fileRejections.map((rejection: FileRejection) => (
            rejection.errors.map(e => `${rejection.file.name}: ${e.message}`).join(', ')
        )).join('; ')
        : '';

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`relative cursor-pointer flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors duration-200 ease-in-out min-h-[160px] text-center ${borderColor} ${isDragActive ? "bg-secondary/20" : "bg-transparent"} ${className}`}
                aria-label="Área para soltar archivos"
                tabIndex={0}
                role="button"
            >
                <input {...getInputProps()} />

                <div className="flex flex-col items-center gap-3">
                    <Upload className="w-7 h-7 text-primary" />
                    <p className="text-sm text-foreground font-semibold">
                        {title}
                    </p>

                    <p className="text-xs text-muted-foreground">
                        Arrastra y suelta tus archivos <span className="text-primary">{fileTypeDescription}</span> {description}
                    </p>
                </div>
            </div>

            {(error || rejectionErrors) && (
                <p className="mt-2 text-xs text-destructive">
                    {error || rejectionErrors}
                </p>
            )}
        </div>
    );
};
