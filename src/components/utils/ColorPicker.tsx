import React, {useState} from 'react';
import {
    Box, Fab, Tooltip, Stack, ClickAwayListener, Paper, IconButton, alpha
} from '@mui/material';
import {Droplet, Check} from 'react-feather';
import {motion, AnimatePresence} from 'motion/react';

interface AppColorPickerProps {
    colors: string[];
    selectedColor: string;
    onColorChange: (color: string) => void;
}

// Color Picker Component
export const ColorPicker: React.FC<AppColorPickerProps> = ({
                                                                  colors,
                                                                  selectedColor,
                                                                  onColorChange
                                                              }) => {
    const [open, setOpen] = useState(false);

    const handleToggle = () => {
        setOpen(prev => !prev);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleColorSelect = (color: string) => {
        onColorChange(color);
        handleClose();
    };

    return (
        <Box sx={{position: 'relative'}}>
            <Tooltip title="Change background color" placement="top">
                <Fab
                    type={'button'} size="medium" color="primary"
                    onClick={handleToggle}
                    sx={{
                        boxShadow: 3,
                        bgcolor: selectedColor,
                        '&:hover': {
                            bgcolor: alpha(selectedColor, 0.85)
                        }
                    }}
                    component={motion.button}
                    whileHover={{rotate: 90, scale: 1.1}}
                    whileTap={{scale: 0.9}}
                >
                    <Droplet size={20} color="#fff"/>
                </Fab>
            </Tooltip>

            <AnimatePresence>
                {open && (
                    <ClickAwayListener onClickAway={handleClose}>
                        <Paper
                            component={motion.div}
                            initial={{opacity: 0, y: 10, scale: 0.95}}
                            animate={{opacity: 1, y: 0, scale: 1}}
                            exit={{opacity: 0, y: 10, scale: 0.9}}
                            transition={{type: 'spring', stiffness: 400, damping: 30}}
                            sx={{
                                position: 'absolute',
                                bottom: '100%',
                                left: 0,
                                mb: 1,
                                p: 1,
                                borderRadius: 2,
                                boxShadow: 3,
                                zIndex: 10,
                                maxWidth: '100%',  // Limit width to 80% of viewport
                                maxHeight: '40vh'  // Limit height to 40% of viewport
                            }}
                        >
                            <Box
                                sx={{
                                    overflowX: 'auto',
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': {
                                        height: 6,
                                        width: 6,
                                    },
                                    '&::-webkit-scrollbar-thumb': {
                                        backgroundColor: 'rgba(0,0,0,0.2)',
                                        borderRadius: 3,
                                    }
                                }}
                            >
                                <Stack direction="row" spacing={1} sx={{p: 1}}>
                                    {colors.map((color) => (
                                        <Box
                                            component={motion.div}
                                            whileHover={{scale: 1.2}}
                                            whileTap={{scale: 0.9}}
                                        >
                                            <IconButton
                                                size="small"
                                                onClick={() => handleColorSelect(color)}
                                                sx={{
                                                    bgcolor: color,
                                                    width: 36,
                                                    height: 36,
                                                    '&:hover': {
                                                        bgcolor: alpha(color, 0.85)
                                                    },
                                                    position: 'relative',
                                                    flexShrink: 0 // Prevent shrinking
                                                }}
                                            >
                                                {selectedColor === color && (
                                                    <Check size={16} color="#ffffff"/>
                                                )}
                                            </IconButton>
                                        </Box>
                                    ))}
                                </Stack>
                            </Box>
                        </Paper>
                    </ClickAwayListener>
                )}
            </AnimatePresence>
        </Box>
    );
};