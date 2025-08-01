import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import {useTheme} from '@mui/material/styles';
import {X} from 'react-feather';

export type ModalSize = 'xs' | 's' | 'm' | 'l' | 'fullscreen';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string | React.ReactNode;
    subtitle?: string | React.ReactNode;
    size?: ModalSize;
    showCloseButton?: boolean;
    actions?: React.ReactNode;
    children?: React.ReactNode;
    disableEscapeKeyDown?: boolean;
    disableBackdropClick?: boolean;
}

const getMaxWidth = (size: ModalSize): false | 'xs' | 'sm' | 'md' | 'lg' | 'xl' => {
    switch (size) {
        case 'xs':
            return 'xs';
        case 's':
            return 'sm';
        case 'm':
            return 'md';
        case 'l':
            return 'lg';
        case 'fullscreen':
            return false;
        default:
            return 'md';
    }
};

export const Modal: React.FC<ModalProps> = ({
                                                isOpen,
                                                onClose,
                                                title,
                                                subtitle,
                                                size = 'm',
                                                showCloseButton = true,
                                                actions,
                                                children,
                                                disableEscapeKeyDown = false,
                                                disableBackdropClick = false,
                                            }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const isFullscreen = size === 'fullscreen' || isMobile;

    const handleClose = (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
        if (reason === 'backdropClick' && disableBackdropClick) return;
        if (reason === 'escapeKeyDown' && disableEscapeKeyDown) return;
        onClose();
    };

    const titleId = `modal-title-${Math.random().toString(36).slice(2, 9)}`;
    const contentId = `modal-content-${Math.random().toString(36).slice(2, 9)}`;

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth={getMaxWidth(size)}
            fullWidth
            fullScreen={isFullscreen}
            aria-labelledby={title ? titleId : undefined}
            aria-describedby={children ? contentId : undefined}
            sx={{
                '& .MuiDialog-paper': {
                    ...(size === 'fullscreen' && !isMobile && {
                        height: '100vh',
                        maxHeight: '100vh',
                    }),
                },
            }}
        >
            {(title || subtitle || showCloseButton) && (
                <DialogTitle
                    id={titleId}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start',
                        position: 'relative',
                        pb: subtitle ? 1 : 2,
                    }}
                >
                    {showCloseButton && (
                        <IconButton
                            aria-label="close"
                            onClick={onClose}
                            sx={{
                                position: 'absolute',
                                right: 8,
                                top: 8,
                            }}
                        >
                            <X size={20}/>
                        </IconButton>
                    )}

                    {title && (
                        <Typography
                            component="div"
                            variant="h6"
                            sx={{
                                pr: showCloseButton ? 5 : 0,
                                mb: subtitle ? 0.5 : 0,
                            }}
                        >
                            {title}
                        </Typography>
                    )}

                    {subtitle && (
                        <Typography
                            component="div"
                            variant="body2"
                            color="text.secondary"
                            sx={{
                                pr: showCloseButton ? 5 : 0,
                            }}
                        >
                            {subtitle}
                        </Typography>
                    )}
                </DialogTitle>
            )}

            {children && (
                <DialogContent
                    id={contentId}
                    sx={{
                        ...(!(title || subtitle || showCloseButton) && {
                            pt: 3,
                        }),
                    }}
                >
                    {children}
                </DialogContent>
            )}

            {actions && (
                <DialogActions
                    sx={{
                        p: 2,
                        gap: 1,
                    }}
                >
                    {actions}
                </DialogActions>
            )}
        </Dialog>
    );
};