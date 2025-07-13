import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Box, Button, Grid, Snackbar, Stack, Typography} from '@mui/material';
import {MediaUriTypeEnum} from "./media-uri-type-enum";
import {FileUtils} from "./file-utils";
import {FilePreview} from "./FilePreview";
import {FileDropzone} from "./FileDropzone";


interface FileUploadLibraryProps {
    title?: string;
    config: FileUploadConfig;
    callbacks?: FileUploadCallbacks;
    onFilesChange: (files: FileToUpload[]) => void;
    value?: FileToUpload[];
}

/**
 * Example usage
 *
 * ```tsx
 * const ExampleUsage = () => {
 *     const [uploadedFiles, setUploadedFiles] = useState<FileToUpload[]>([]);
 *
 *     const config: FileUploadConfig = {
 *         maxFiles: 5,
 *         maxFileSize: 10 * 1024 * 1024, // 10MB
 *         acceptedTypes: {
 *             'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
 *             'video/*': ['.mp4', '.mov']
 *         },
 *         enablePreview: true,
 *         previewDimensions: { width: 150, height: 200 }
 *     };
 *
 *     const callbacks: FileUploadCallbacks = {
 *         onSuccess: (files) => console.log('Files uploaded:', files),
 *         onError: (error) => console.error('Upload error:', error),
 *         onWarning: (message) => console.warn('Upload warning:', message),
 *         onProgress: (progress) => console.log('Progress:', progress + '%')
 *     };
 *
 *     return (
 *         <FileUploadLibrary
 *             title="Upload Media Files"
 *             config={config}
 *             callbacks={callbacks}
 *             onFilesChange={setUploadedFiles}
 *             value={uploadedFiles}
 *         />
 *     );
 * };
 * ```
 *
 * @param title
 * @param config
 * @param callbacks
 * @param onFilesChange
 * @param value
 * @constructor
 */
export const FileUpload: React.FC<FileUploadLibraryProps> = ({
                                                                        title = 'Upload Files',
                                                                        config,
                                                                        callbacks = {},
                                                                        onFilesChange,
                                                                        value = []
                                                                    }) => {
    const [files, setFiles] = useState<FileToUpload[]>(value);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string>('');
    const [notification, setNotification] = useState<{ message: string; severity: 'success' | 'warning' | 'error' | 'info' }>({
        message: '',
        severity: 'info'
    });

    const showNotification = useCallback((message: string, severity: 'success' | 'warning' | 'error' | 'info') => {
        setNotification({ message, severity });
    }, []);

    const handleDrop = useCallback(async (droppedFiles: File[]) => {
        setIsProcessing(true);
        setError('');

        try {
            const currentFileCount = files.length;
            const totalFiles = currentFileCount + droppedFiles.length;

            if (totalFiles > config.maxFiles) {
                const allowedFiles = config.maxFiles - currentFileCount;
                if (allowedFiles <= 0) {
                    callbacks.onWarning?.(`Maximum ${config.maxFiles} files allowed`);
                    showNotification(`Maximum ${config.maxFiles} files allowed`, 'warning');
                    return;
                }
                droppedFiles = droppedFiles.slice(0, allowedFiles);
                callbacks.onWarning?.(`Only ${allowedFiles} files added (max ${config.maxFiles} total)`);
                showNotification(`Only ${allowedFiles} files added (max ${config.maxFiles} total)`, 'warning');
            }

            const processedFiles: FileToUpload[] = [];

            for (let i = 0; i < droppedFiles.length; i++) {
                const file = droppedFiles[i];

                if (config.maxFileSize && file.size > config.maxFileSize) {
                    callbacks.onWarning?.(`File ${file.name} exceeds maximum size of ${FileUtils.formatFileSize(config.maxFileSize)}`);
                    showNotification(`File ${file.name} exceeds maximum size`, 'warning');
                    continue;
                }

                try {
                    const processedFile = await FileUtils.processFile(file);
                    processedFiles.push(processedFile);
                    callbacks.onProgress?.(((i + 1) / droppedFiles.length) * 100);
                } catch (error) {
                    console.error('Error processing file:', file.name, error);
                    callbacks.onError?.(`Error processing ${file.name}`);
                    showNotification(`Error processing ${file.name}`, 'error');
                }
            }

            if (processedFiles.length > 0) {
                const newFiles = [...files, ...processedFiles];
                setFiles(newFiles);
                callbacks.onSuccess?.(processedFiles);
                showNotification(`Successfully added ${processedFiles.length} file(s)`, 'success');
            }

        } catch (error) {
            const errorMessage = 'Failed to process files';
            setError(errorMessage);
            callbacks.onError?.(errorMessage);
            showNotification(errorMessage, 'error');
        } finally {
            setIsProcessing(false);
        }
    }, [files, config, callbacks, showNotification]);

    const handleRemoveFile = useCallback((index: number) => {
        const newFiles = files.filter((_, i) => i !== index);
        setFiles(newFiles);

        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(files[index].fileUrl);

        showNotification('File removed', 'info');
    }, [files, showNotification]);

    const handleClearAll = useCallback(() => {
        // Revoke all object URLs
        files.forEach(file => URL.revokeObjectURL(file.fileUrl));
        setFiles([]);
        showNotification('All files cleared', 'info');
    }, [files, showNotification]);

    useEffect(() => {
        onFilesChange(files);
    }, [files, onFilesChange]);

    // Cleanup URLs on unmount
    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.fileUrl));
        };
    }, []);

    return (
        <Box sx={{ width: '100%' }}>
            <Typography variant="h5" gutterBottom>
                {title}
            </Typography>

            <FileDropzone
                config={config}
                onDrop={handleDrop}
                isProcessing={isProcessing}
                error={error}
            />

            {files.length > 0 && (
                <Box sx={{ mt: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h6">
                            Selected Files ({files.length}/{config.maxFiles})
                        </Typography>
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={handleClearAll}
                            disabled={isProcessing}
                        >
                            Clear All
                        </Button>
                    </Stack>

                    <Grid container spacing={2}>
                        {files.map((file, index) => (
                            <Grid key={index}>
                                <FilePreview
                                    file={file}
                                    index={index}
                                    onRemove={handleRemoveFile}
                                    dimensions={config.previewDimensions}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            <Snackbar
                open={!!notification.message}
                autoHideDuration={4000}
                onClose={() => setNotification({ message: '', severity: 'info' })}
            >
                <Alert
                    severity={notification.severity}
                    onClose={() => setNotification({ message: '', severity: 'info' })}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

// Example usage:
/*
const ExampleUsage = () => {
    const [uploadedFiles, setUploadedFiles] = useState<FileToUpload[]>([]);

    const config: FileUploadConfig = {
        maxFiles: 5,
        maxFileSize: 10 * 1024 * 1024, // 10MB
        acceptedTypes: {
            'image/*': ['.jpg', '.jpeg', '.png', '.gif'],
            'video/*': ['.mp4', '.mov']
        },
        enablePreview: true,
        previewDimensions: { width: 150, height: 200 }
    };

    const callbacks: FileUploadCallbacks = {
        onSuccess: (files) => console.log('Files uploaded:', files),
        onError: (error) => console.error('Upload error:', error),
        onWarning: (message) => console.warn('Upload warning:', message),
        onProgress: (progress) => console.log('Progress:', progress + '%')
    };

    return (
        <FileUploadLibrary
            title="Upload Media Files"
            config={config}
            callbacks={callbacks}
            onFilesChange={setUploadedFiles}
            value={uploadedFiles}
        />
    );
};
*/

export interface FileMetadataDto<T = any> {
    mediaUriType?: MediaUriTypeEnum;
    mediaUriUseCaseType?: T;
    height?: number;
    width?: number;
    duration?: number;
    size?: number;
    position?: number;
    mimeType?: string;
    originalName?: string;
}

export interface FileToUpload {
    file: File;
    fileUrl: string;
    width?: number;
    height?: number;
    duration?: number;
    mediaUriType: MediaUriTypeEnum;
    metadata?: FileMetadataDto;
}

export interface FileUploadCallbacks {
    onSuccess?: (files: FileToUpload[]) => void;
    onError?: (error: string) => void;
    onWarning?: (message: string) => void;
    onProgress?: (progress: number) => void;
}

export interface FileUploadConfig {
    maxFiles: number;
    maxFileSize?: number; // in bytes
    acceptedTypes?: Record<string, string[]>;
    allowedExtensions?: string[];
    enablePreview?: boolean;
    previewDimensions?: { width: number; height: number };
}