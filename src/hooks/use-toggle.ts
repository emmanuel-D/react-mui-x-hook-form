import {useState} from "react";

export const useToggle = (initialState: boolean = false) => {
    const [state, setState] = useState<boolean>(initialState);

    const setTrue = () => {
        setState(true);
    }
    const setFalse = () => {
        setState(false);
    }

    const toggle = () => {
        setState(prevState => !prevState);
    }

    return {
        isToggle: state,
        setToggleTrue: setTrue,
        setToggleFalse: setFalse,
        toggle
    };
}
