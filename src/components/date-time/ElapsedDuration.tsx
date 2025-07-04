import React, { useEffect, useState } from 'react';
import Typography from "@mui/material/Typography";
import {TypographyProps} from "@mui/material/Typography/Typography";

interface Props extends TypographyProps {
    startedAt: Date | null; // Accepts a `Date` object or `null` for no active call
}

export const ElapsedDuration: React.FC<Props> = (props: Props) => {
    const {startedAt} = props;

    const [duration, setDuration] = useState<string>('00:00');

    useEffect(() => {
        if (!startedAt) {
            setDuration('00:00'); // Reset to zero when no call is active
            return;
        }

        const calculateDuration = () => {
            const now = new Date();
            const elapsedSeconds = Math.floor((now.getTime() - startedAt.getTime()) / 1000);
            const minutes = Math.floor(elapsedSeconds / 60).toString().padStart(2, '0');
            const seconds = (elapsedSeconds % 60).toString().padStart(2, '0');
            return `${minutes}:${seconds}`;
        };

        const updateDuration = () => setDuration(calculateDuration());

        updateDuration(); // Set the initial duration
        const interval = setInterval(updateDuration, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup on unmount
    }, [startedAt]);

    return <Typography {...props}>{duration}</Typography>;
};
