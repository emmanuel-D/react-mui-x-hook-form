import {useEffect, useState} from "react";
import Fab from "@mui/material/Fab";
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import {SxProps} from "@mui/system";
import {Theme} from "@mui/material/styles";

interface Props {
    onScrollToTop?: () => any;
    distanceToShowButton?: number;
    sx?: SxProps<Theme>;
}

export const ScrollToTopButton = (props: Props) => {

    const {
        onScrollToTop = () => {
        },
        distanceToShowButton = 300,
        sx
    } = props;

    const [visible, setVisible] = useState(false);

    const toggleVisible = () => {
        const scrolled = document.documentElement.scrollTop;
        if (scrolled > distanceToShowButton) {
            setVisible(true)
        } else if (scrolled <= distanceToShowButton) {
            setVisible(false);
        }
    };

    const scrollToTop = () => {
        window?.scrollTo({
            top: 0,
            behavior: 'smooth'
            /* you can also use 'auto' behaviour
               in place of 'smooth' */
        });
        props.onScrollToTop && props.onScrollToTop();
    };

    useEffect(() => {
        window?.addEventListener('scroll', toggleVisible);
    }, []);

    return (
        <Fab
            color="secondary" aria-label="scroll-to-top"
            onClick={scrollToTop}
            sx={{
                display: visible ? 'block' : 'none',
                position: 'absolute', bottom: 50, zIndex: 1000,
                backgroundColor: 'secondary.main',
                ...sx
            }}
        >
            <ArrowUpwardIcon/>
        </Fab>
    );
}
