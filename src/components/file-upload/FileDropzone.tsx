import React, {useCallback, useMemo} from "react";
import {Upload} from "react-feather";
import {useDropzone} from "react-dropzone";
import {Alert, Box, CircularProgress, Stack, Typography} from "@mui/material";
import {FileUtils} from "./file-utils";
import {FileUploadConfig} from "./FileUpload";

interface FileDropzoneProps {
    config: FileUploadConfig;
    onDrop: (files: File[]) => void;
    isProcessing?: boolean;
    error?: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
                                                              config,
                                                              onDrop,
                                                              isProcessing = false,
                                                              error
                                                          }) => {
    const {
        maxFiles,
        maxFileSize,
        acceptedTypes = {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
            'video/*': ['.mp4', '.mov', '.avi'],
            'audio/*': ['.mp3', '.wav', '.ogg'],
            'application/*': ['.pdf', '.doc', '.docx']
        }
    } = config;

    const onDropCallback = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;
        onDrop(acceptedFiles);
    }, [onDrop]);

    const {getRootProps, getInputProps, isDragActive, isDragReject} = useDropzone({
        onDrop: onDropCallback,
        accept: acceptedTypes,
        maxFiles,
        maxSize: maxFileSize,
        disabled: isProcessing
    });

    const acceptedTypesText = useMemo(() => {
        const types = Object.keys(acceptedTypes);
        return types.map(type => type.split('/')[0]).join(', ');
    }, [acceptedTypes]);

    return (
        <Box>
            <Stack
                {...getRootProps()}
                sx={{
                    minHeight: 120,
                    p: 3,
                    border: 2,
                    borderStyle: 'dashed',
                    borderColor: isDragReject ? 'error.main' :
                        isDragActive ? 'primary.main' : 'grey.300',
                    borderRadius: 2,
                    bgcolor: isDragReject ? 'error.light' :
                        isDragActive ? 'primary.light' : 'grey.50',
                    cursor: isProcessing ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease-in-out',
                    opacity: isProcessing ? 0.6 : 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    '&:hover': {
                        borderColor: 'primary.main',
                        bgcolor: 'primary.light'
                    }
                }}
            >
                <input {...getInputProps()} />

                {isProcessing ? (
                    <Stack alignItems="center" spacing={2}>
                        <CircularProgress size={32}/>
                        <Typography color="text.secondary">
                            Processing files...
                        </Typography>
                    </Stack>
                ) : (
                    <Stack alignItems="center" spacing={1}>
                        <Upload size={32}/>
                        <Typography variant="h6">
                            {isDragActive ? 'Drop files here' : 'Drop files or click to browse'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Supports: {acceptedTypesText}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            Max {maxFiles} files{maxFileSize && ` • Max ${FileUtils.formatFileSize(maxFileSize)} per file`}
                        </Typography>
                    </Stack>
                )}
            </Stack>

            {error && (
                <Alert severity="error" sx={{mt: 2}}>
                    {error}
                </Alert>
            )}
        </Box>
    );
};