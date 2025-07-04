import React, {useState, useCallback, useRef, useEffect, JSX} from 'react';
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import { X } from "react-feather";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemText from "@mui/material/ListItemText";
import debounce from 'lodash.debounce';

interface Props<T> {
    // Modal configuration
    isOpen: boolean;
    onClose: () => void;
    modalTitle: string;

    HeaderComponent?: JSX.Element;

    // Input configuration
    inputLabel: string;
    inputPlaceholder: string;

    // Data and selection handling
    loadOptionsOnInputChanged: (inputValue: string) => Promise<T[]>;
    onLoadOptionsFailed: () => any;
    onSelectOption: (option: T) => any;
    formatOptionLabel: (option: T) => string;

    // Optional customization
    renderOption?: (option: T) => JSX.Element;
    defaultOptions?: T[];
    debounceTimeout?: number;
}

export function AutoCompleteSearchModal<T>(props: Props<T>) {
    // Destructure props with defaults
    const {
        isOpen,
        onClose,
        modalTitle,
        inputLabel,
        inputPlaceholder,
        onSelectOption,
        formatOptionLabel,
        renderOption,
        defaultOptions = [],
        loadOptionsOnInputChanged,
        onLoadOptionsFailed,
        debounceTimeout = 1_000
    } = props;

    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<T[]>(defaultOptions);
    const [isLoading, setIsLoading] = useState(false);

    // Create a stable debounced function using useRef.
    const debouncedLoadOptions = useRef(
        debounce(async (value: string) => {
            if (value.trim().length > 2) {
                setIsLoading(true);
                try {
                    const fetchedOptions = await loadOptionsOnInputChanged(value);

                    // Filter out default options
                    const filteredOptions = fetchedOptions.filter(
                        option => !defaultOptions.some(
                            defaultOption => JSON.stringify(defaultOption) === JSON.stringify(option)
                        )
                    );

                    setOptions(filteredOptions);
                } catch (error) {
                    onLoadOptionsFailed();
                    setOptions([]);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setOptions(defaultOptions);
            }
        }, debounceTimeout)
    ).current;

    // Cleanup the debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedLoadOptions.cancel();
        };
    }, [debouncedLoadOptions]);

    // Input change handler
    const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value;
        setInputValue(value);
        debouncedLoadOptions(value);
    }, [debouncedLoadOptions]);

    // Option selection handler
    const handleSelectOption = useCallback((option: T) => {
        debouncedLoadOptions.cancel();
        onSelectOption(option);
        onClose();
        setInputValue('');
        setOptions(defaultOptions);
    }, [onSelectOption, onClose, defaultOptions, debouncedLoadOptions]);

    // Styles for the modal
    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 500,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '80vh',
        overflow: 'auto'
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="modal-modal-auto-complete"
        >
            <Box sx={modalStyle}>
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography id="modal-modal-auto-complete" variant="h5" component="h2">
                        {modalTitle}
                    </Typography>
                    <IconButton onClick={onClose} aria-label="close">
                        <X/>
                    </IconButton>
                </Box>

                {props.HeaderComponent}

                <TextField
                    fullWidth
                    label={inputLabel}
                    placeholder={inputPlaceholder}
                    variant="outlined"
                    value={inputValue}
                    onChange={handleInputChange}
                    sx={{ mb: 2 }}
                />

                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                        <CircularProgress />
                    </Box>
                ) : options.length > 0 ? (
                    <Paper elevation={0} sx={{ maxHeight: 300, overflow: 'auto' }}>
                        <List>
                            {options.map((option, index) => (
                                // @ts-ignore
                                <ListItem
                                    key={index}
                                    button
                                    onClick={() => handleSelectOption(option)}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: 'action.hover'
                                        }
                                    }}
                                >
                                    {renderOption ? (
                                        renderOption(option)
                                    ) : (
                                        <ListItemText primary={formatOptionLabel(option)} />
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                ) : inputValue && !isLoading ? (
                    <Typography variant="body2" color="text.secondary" align="center">
                        No options found
                    </Typography>
                ) : null}
            </Box>
        </Modal>
    );
}
