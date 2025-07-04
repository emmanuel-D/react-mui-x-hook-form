import React from 'react';
import { motion } from 'framer-motion';
import Stack from "@mui/material/Stack";
import Box from '@mui/material/Box';
import {useTheme} from "@mui/material";
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles/createTheme";

interface TypingAnimationProps {
    isSomeoneTyping: boolean;
    sxContainer?: SxProps<Theme>;
    sxDot?: SxProps<Theme>;
}

const TypingAnimationInternal: React.FC<TypingAnimationProps> = ({ isSomeoneTyping, sxContainer, sxDot}) => {
    const theme = useTheme();

    // Dot animation variants with staggered sine wave effect
    const dotVariants = {
        typing: (i: number) => ({
            y: [0, -10, 0],
            transition: {
                duration: 0.6,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2 // Stagger delay based on dot index
            }
        }),
        hidden: { opacity: 0 }
    };

    if (!isSomeoneTyping) return null;

    return (
        // @ts-ignore
        <Stack
            component={motion.div}
            initial={{
                opacity: 0,
                scale: 0.9,
                boxShadow: 'none'
            }}
            animate={{
                opacity: 1,
                scale: 1,
                boxShadow: theme.shadows[1] // Light elevation
            }}
            whileHover={{
                boxShadow: theme.shadows[2], // Slightly more elevation on hover
                scale: 1.02
            }}
            exit={{
                opacity: 0,
                scale: 0.9,
                boxShadow: 'none'
            }}
            sx={{
                backgroundColor: theme.palette.secondary.main,
                borderRadius: theme.spacing(2),
                p: 1,
                pt: 1.5,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: theme.spacing(1),
                width: 'fit-content',
                mx: 'auto',
                my: theme.spacing(1),
                cursor: 'default', // Optional: shows it's an interactive element
                transition: {
                    boxShadow: { duration: 0.2 },
                    scale: { duration: 0.2 }
                },
                ...sxContainer
            }}
        >
            {[0, 1, 2].map((i) => (
                // @ts-ignore
                <Box
                    key={i}
                    component={motion.div}
                    custom={i}
                    variants={dotVariants}
                    animate="typing"
                    sx={{
                        width: theme.spacing(1.5),
                        height: theme.spacing(1.5),
                        borderRadius: '50%',
                        backgroundColor: theme.palette.common.white,
                        ...sxDot
                    }}
                />
            ))}
        </Stack>
    );
};

export const TypingAnimation = React.memo(TypingAnimationInternal);