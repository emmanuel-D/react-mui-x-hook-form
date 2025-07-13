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
    horizontalScroll?: boolean,
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
 *         <FileUpload
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
 * @param horizontalScroll
 * @constructor
 */
export const FileUpload: React.FC<FileUploadLibraryProps> = ({
                                                                 title = 'Upload Files',
                                                                 config,
                                                                 callbacks = {},
                                                                 onFilesChange,
                                                                 value = [],
                                                                 horizontalScroll = false,

                                                             }) => {
    const [files, setFiles] = useState<FileToUpload[]>(value);
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string>('');
    const [notification, setNotification] = useState<{
        message: string;
        severity: 'success' | 'warning' | 'error' | 'info'
    }>({
        message: '',
        severity: 'info'
    });

    const showNotification = useCallback((message: string, severity: 'success' | 'warning' | 'error' | 'info') => {
        setNotification({message, severity});
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
                    const position = currentFileCount + i;
                    const processedFile = await FileUtils.processFile(
                        file,
                        config.autoGenerateMetadata ? position : undefined,
                        config.metadataUseCaseType
                    );

                    // Generate metadata callback
                    if (processedFile.metadata) {
                        callbacks.onMetadataGenerated?.(processedFile, processedFile.metadata);
                    }

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

                // Update positions for all files if auto-generate metadata is enabled
                const finalFiles = config.autoGenerateMetadata ?
                    FileUtils.updateFilePositions(newFiles, config.metadataUseCaseType) :
                    newFiles;

                setFiles(finalFiles);
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

        // Revoke object URL to prevent memory leaks
        URL.revokeObjectURL(files[index].fileUrl);

        // Update positions for remaining files if auto-generate metadata is enabled
        const finalFiles = config.autoGenerateMetadata ?
            FileUtils.updateFilePositions(newFiles, config.metadataUseCaseType) :
            newFiles;

        setFiles(finalFiles);
        showNotification('File removed', 'info');
    }, [files, config, showNotification]);

    const handleClearAll = useCallback(() => {
        // Revoke all object URLs
        files.forEach(file => URL.revokeObjectURL(file.fileUrl));
        setFiles([]);
        showNotification('All files cleared', 'info');
    }, [files, showNotification]);

    // Method to manually generate metadata for all files
    const generateMetadata = useCallback(() => {
        const filesWithMetadata = FileUtils.generateMetadataForFiles(files, config.metadataUseCaseType);
        setFiles(filesWithMetadata);

        // Trigger metadata callbacks for all files
        filesWithMetadata.forEach(file => {
            if (file.metadata) {
                callbacks.onMetadataGenerated?.(file, file.metadata);
            }
        });

        showNotification('Metadata generated for all files', 'success');
    }, [files, config.metadataUseCaseType, callbacks, showNotification]);

    // Method to get all files with their metadata
    const getFilesWithMetadata = useCallback(() => {
        return files.map(file => ({
            ...file,
            metadata: file.metadata || FileUtils.createFileMetadata(file, file.position || 0, config.metadataUseCaseType)
        }));
    }, [files, config.metadataUseCaseType]);

    useEffect(() => {
        onFilesChange(files);
    }, [files, onFilesChange]);

    return (
        <Box sx={{width: '100%'}}>
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
                <Box sx={{mt: 3}}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{mb: 2}}>
                        <Typography variant="h6">
                            Selected Files ({files.length}/{config.maxFiles})
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            {!config.autoGenerateMetadata && (
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={generateMetadata}
                                    disabled={isProcessing}
                                >
                                    Generate Metadata
                                </Button>
                            )}
                            <Button
                                variant="outlined"
                                color="error"
                                onClick={handleClearAll}
                                disabled={isProcessing}
                            >
                                Clear All
                            </Button>
                        </Stack>
                    </Stack>

                    {
                        horizontalScroll ?
                            <Box
                                sx={{
                                    display: 'flex',
                                    gap: 2,
                                    overflowX: 'auto',
                                    overflowY: 'hidden',
                                    width: '100%',
                                    paddingBottom: 1,
                                    '&::-webkit-scrollbar': {
                                        height: '8px',
                                    },
                                    '&::-webkit-scrollbar-track': {
                                        backgroundColor: '#f1f1f1',
                                        borderRadius: '4px',
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: '#c1c1c1',
                                        borderRadius: '4px',
                                        '&:hover': {
                                            backgroundColor: '#a8a8a8',
                                        },
                                    },
                                }}
                            >
                                {files.map((file, index) => (
                                    <Box
                                        key={index}
                                        sx={{
                                            flexShrink: 0,
                                            minWidth: config.previewDimensions?.width,
                                        }}
                                    >
                                        <FilePreview
                                            file={file}
                                            index={index}
                                            onRemove={handleRemoveFile}
                                            dimensions={config.previewDimensions}
                                        />
                                    </Box>
                                ))}
                            </Box>
                            :
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
                    }
                </Box>
            )}

            <Snackbar
                open={!!notification.message}
                autoHideDuration={4000}
                onClose={() => setNotification({message: '', severity: 'info'})}
            >
                <Alert
                    severity={notification.severity}
                    onClose={() => setNotification({message: '', severity: 'info'})}
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};

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
    position?: number
}

export interface FileUploadCallbacks {
    onSuccess?: (files: FileToUpload[]) => void;
    onError?: (error: string) => void;
    onWarning?: (message: string) => void;
    onProgress?: (progress: number) => void;
    onMetadataGenerated?: (file: FileToUpload, metadata: FileMetadataDto) => void;
}

export interface FileUploadConfig {
    maxFiles: number;
    maxFileSize?: number; // in bytes
    acceptedTypes?: Record<string, string[]>;
    allowedExtensions?: string[];
    enablePreview?: boolean;
    previewDimensions?: { width: number; height: number };
    autoGenerateMetadata?: boolean;
    metadataUseCaseType?: any;
}