import React, { useEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

// Customize the relative time thresholds to match Twitter's display
dayjs.updateLocale('en', {
    relativeTime: {
        future: 'in %s',
        past: '%s ago',
        s: 'seconds',
        m: '1m',
        mm: '%dm',
        h: '1h',
        hh: '%dh',
        d: '1d',
        dd: '%dd',
        M: '1mo',
        MM: '%dmo',
        y: '1y',
        yy: '%dy'
    }
});

export interface TimeAgoProps {
    date?: Date | string;
    /**
     * In milliseconds
     */
    refreshInterval?: number;
}

const TimeAgoInternal: React.FC<TimeAgoProps> = ({ date, refreshInterval = 60000 }) => {
    const [currentDate, setCurrentDate] = useState(new Date());

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentDate(new Date());
        }, refreshInterval);

        return () => clearInterval(intervalId);
    }, [refreshInterval]);

    const timeAgo = useMemo(() => {
        const now = dayjs();
        const inputDate = dayjs(date);

        if (now.diff(inputDate, 'seconds') < 60) {
            return inputDate.fromNow(); // seconds
        } else if (now.diff(inputDate, 'minutes') < 60) {
            return inputDate.fromNow(); // minutes
        } else if (now.diff(inputDate, 'hours') < 24) {
            return inputDate.fromNow(); // hours
        } else if (now.diff(inputDate, 'days') < 7) {
            return inputDate.fromNow(); // days
        } else if (now.diff(inputDate, 'years') < 1) {
            return inputDate.format('MMM D'); // date without year
        } else {
            return inputDate.format('MMM D, YYYY'); // date with year
        }
    }, [date, currentDate]);

    return <>{timeAgo}</>;
};

export const TimeAgo = React.memo(TimeAgoInternal);

