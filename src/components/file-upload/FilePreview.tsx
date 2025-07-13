import React from "react";
import {MediaUriTypeEnum} from "./media-uri-type-enum";
import {Box, Card, CardContent, Chip, IconButton, Stack, Typography} from "@mui/material";
import {File, Image as ImageIcon, Music, Trash2, Video} from "react-feather";
import {FileUtils} from "./file-utils";
import {FileToUpload} from "./FileUpload";

const getMediaIcon = (type: MediaUriTypeEnum) => {
    switch (type) {
        case MediaUriTypeEnum.IMAGE:
        case MediaUriTypeEnum.GIF:
            return <ImageIcon size={20}/>;
        case MediaUriTypeEnum.VIDEO:
            return <Video size={20}/>;
        case MediaUriTypeEnum.AUDIO:
            return <Music size={20}/>;
        default:
            return <File size={20}/>;
    }
};

const getMediaTypeColor = (type: MediaUriTypeEnum): 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info' => {
    switch (type) {
        case MediaUriTypeEnum.IMAGE:
        case MediaUriTypeEnum.GIF:
            return 'primary';
        case MediaUriTypeEnum.VIDEO:
            return 'secondary';
        case MediaUriTypeEnum.AUDIO:
            return 'success';
        default:
            return 'info';
    }
};

interface FilePreviewProps {
    file: FileToUpload;
    index: number;
    onRemove: (index: number) => void;
    dimensions?: { width: number; height: number };
    showMetadata?: boolean;
}

export const FilePreview: React.FC<FilePreviewProps> = ({
                                                            file,
                                                            index,
                                                            onRemove,
                                                            dimensions = {width: 120, height: 160},
                                                            showMetadata = true
                                                        }) => {
    const {mediaUriType, fileUrl, duration} = file;
    const isVisualMedia = [MediaUriTypeEnum.IMAGE, MediaUriTypeEnum.GIF, MediaUriTypeEnum.VIDEO].includes(mediaUriType);

    return (
        <Card
            sx={{
                width: dimensions.width + 24,
                minHeight: dimensions.height + 60,
                position: 'relative',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: (theme) => theme.shadows[8]
                }
            }}
        >
            <Box sx={{position: 'relative'}}>
                {isVisualMedia ? (
                    <Box
                        sx={{
                            width: dimensions.width,
                            height: dimensions.height,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            overflow: 'hidden',
                            borderRadius: 1,
                            bgcolor: 'grey.100'
                        }}
                    >
                        {mediaUriType === MediaUriTypeEnum.VIDEO ? (
                            <video
                                src={fileUrl}
                                controls
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        ) : (
                            <img
                                src={fileUrl}
                                alt={`Preview ${index}`}
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'contain'
                                }}
                            />
                        )}
                    </Box>
                ) : (
                    <Box
                        sx={{
                            width: dimensions.width,
                            height: dimensions.height,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            bgcolor: 'grey.50'
                        }}
                    >
                        {getMediaIcon(mediaUriType)}
                        <Typography variant="caption" sx={{mt: 1, textAlign: 'center'}}>
                            {file.file.name}
                        </Typography>
                    </Box>
                )}

                <IconButton
                    onClick={() => onRemove(index)}
                    sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'error.main',
                        color: 'error.contrastText',
                        '&:hover': {
                            bgcolor: 'error.dark'
                        },
                        width: 28,
                        height: 28
                    }}
                    size="small"
                >
                    <Trash2 size={14}/>
                </IconButton>
            </Box>

            {showMetadata && (
                <CardContent sx={{p: 1, '&:last-child': {pb: 1}}}>
                    <Stack spacing={0.5}>
                        <Chip
                            icon={getMediaIcon(mediaUriType)}
                            label={mediaUriType}
                            size="small"
                            color={getMediaTypeColor(mediaUriType)}
                            variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                            {FileUtils.formatFileSize(file.file.size)}
                        </Typography>
                        {duration && (
                            <Typography variant="caption" color="text.secondary">
                                {FileUtils.formatDuration(duration)}
                            </Typography>
                        )}
                        {file.metadata?.position !== undefined && (
                            <Typography variant="caption" color="primary">
                                Position: {file.metadata.position}
                            </Typography>
                        )}
                    </Stack>
                </CardContent>
            )}
        </Card>
    );
};