import React, {useState, useCallback, useRef, useEffect, JSX} from 'react';
import Modal from "@mui/material/Modal";
import Box from '@mui/material/Box';
import Typography from "@mui/material/Typography";
import IconButton from '@mui/material/IconButton';
import {CheckCircle, X} from "react-feather";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import List from '@mui/material/List';
import ListItem from "@mui/material/ListItem";
import CircularProgress from "@mui/material/CircularProgress";
import ListItemText from "@mui/material/ListItemText";
import Chip from '@mui/material/Chip';
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import debounce from "lodash.debounce";

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
    onSelectionChanged: (selectedOptions: T[]) => void;
    formatOptionLabel: (option: T) => string;

    // Optional customization
    loadDefaultOptions?: () => Promise<T[]>;
    renderOption?: (option: T) => JSX.Element;
    renderChip?: (option: T, handleDelete: () => void) => JSX.Element;
    defaultOptions?: T[];
    debounceTimeout?: number;
    maxSelections?: number;
    initialSelectedOptions?: T[];

    // Option identification
    getOptionKey?: (option: T) => string | number;
}

export function AutoCompleteWithMultiSelectSearchModal<T>(props: Props<T>) {
    // Destructure props with defaults
    const {
        isOpen,
        onClose,
        modalTitle,
        inputLabel,
        inputPlaceholder,
        onSelectionChanged,
        formatOptionLabel,
        renderOption,
        renderChip,
        defaultOptions = [],
        loadOptionsOnInputChanged,
        onLoadOptionsFailed,
        loadDefaultOptions,
        debounceTimeout = 1_000,
        maxSelections,
        initialSelectedOptions = [],
        getOptionKey = (option: T) => JSON.stringify(option),
    } = props;

    const [inputValue, setInputValue] = useState('');
    const [options, setOptions] = useState<T[]>(defaultOptions);
    const [selectedOptions, setSelectedOptions] = useState<T[]>(initialSelectedOptions);
    const [isLoading, setIsLoading] = useState(false);
    const selectedOptionsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        handleLoadDefaultOptions();
    }, []);

    // Reset selected options when modal opens with initialSelectedOptions
    useEffect(() => {
        if (isOpen) {
            setSelectedOptions(initialSelectedOptions);
        }
    }, [isOpen, initialSelectedOptions]);

    const handleLoadDefaultOptions = async () => {
        if (loadDefaultOptions) {
            try {
                const fetchedOptions = await loadDefaultOptions();

                // Filter out already selected options and default options
                const filteredOptions = fetchedOptions.filter(
                    option => !selectedOptions.some(
                        selected => getOptionKey(selected) === getOptionKey(option)
                    ) && !defaultOptions.some(
                        defaultOption => getOptionKey(defaultOption) === getOptionKey(option)
                    )
                );

                setOptions(filteredOptions);
            } catch (e) {
            }
        }
    }

    // Create a stable debounced function using useRef
    const debouncedLoadOptions = useRef(
        debounce(async (value: string) => {
            if (value.trim().length > 1) {
                setIsLoading(true);
                try {
                    const fetchedOptions = await loadOptionsOnInputChanged(value);

                    // Filter out already selected options and default options
                    const filteredOptions = fetchedOptions.filter(
                        option => !selectedOptions.some(
                            selected => getOptionKey(selected) === getOptionKey(option)
                        ) && !defaultOptions.some(
                            defaultOption => getOptionKey(defaultOption) === getOptionKey(option)
                        )
                    );

                    setOptions(filteredOptions);
                } catch (error) {
                    onLoadOptionsFailed();
                    setOptions([]);
                } finally {
                    setIsLoading(false);
                }
            } else if (value.trim().length === 0) {
                await handleLoadDefaultOptions();
            }  else {
                // Filter default options to exclude selected ones
                const filteredDefaults = defaultOptions.filter(
                    option => !selectedOptions.some(
                        selected => getOptionKey(selected) === getOptionKey(option)
                    )
                );
                setOptions(filteredDefaults);
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
        if (maxSelections && selectedOptions.length >= maxSelections) {
            console.warn(`Maximum of ${maxSelections} selections allowed`);
            return;
        }

        // Add option to selected options
        const newSelectedOptions = [...selectedOptions, option];
        setSelectedOptions(newSelectedOptions);
        onSelectionChanged(newSelectedOptions);

        // Remove the selected option from the options list
        setOptions(prevOptions => {
                const remainingOptions = prevOptions.filter(opt => getOptionKey(opt) !== getOptionKey(option));
                if (remainingOptions.length === 0) {
                    // Clear input
                    setInputValue('');
                }
                return remainingOptions;
            }
        );
    }, [selectedOptions, maxSelections, onSelectionChanged, debouncedLoadOptions, getOptionKey]);

    // Handle removing a selected option
    const handleRemoveOption = useCallback((optionToRemove: T) => {
        // Remove option from selected options
        const newSelectedOptions = selectedOptions.filter(
            option => getOptionKey(option) !== getOptionKey(optionToRemove)
        );

        setSelectedOptions(newSelectedOptions);
        onSelectionChanged(newSelectedOptions);

        // Add the option back to options list if it's a default option
        const isDefaultOption = defaultOptions.some(
            option => getOptionKey(option) === getOptionKey(optionToRemove)
        );

        if (isDefaultOption && inputValue.trim().length <= 2) {
            setOptions(prevOptions => [...prevOptions, optionToRemove]);
        }
    }, [selectedOptions, defaultOptions, onSelectionChanged, inputValue, getOptionKey]);

    // Handle modal close
    const handleClose = useCallback(() => {
        setInputValue('');
        onClose();
    }, [onClose]);

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
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden'
    };

    return (
        <Modal
            open={isOpen}
            disableEscapeKeyDown
            aria-labelledby="modal-modal-auto-complete-multi"
        >
            <Box sx={modalStyle}>
                <Box
                    display="flex"
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={2}
                >
                    <Typography id="modal-modal-auto-complete-multi" variant="h5" component="h2">
                        {modalTitle}
                    </Typography>
                    <IconButton onClick={handleClose} aria-label="close">
                        <X/>
                    </IconButton>
                </Box>

                {props.HeaderComponent}

                {/* Selected options chips area - fixed at top */}
                {selectedOptions.length > 0 && (
                    <Box
                        ref={selectedOptionsRef}
                        sx={{
                            display: 'flex',
                            flexWrap: 'nowrap',
                            gap: 1,
                            mb: 2,
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: 'background.default',
                            border: '1px solid',
                            borderColor: 'divider',
                            overflowX: 'auto',
                            justifyContent: 'start',
                            '&::-webkit-scrollbar': {
                                height: 6,
                            },
                            '&::-webkit-scrollbar-thumb': {
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                borderRadius: 3,
                            },
                        }}
                    >
                        {selectedOptions.map((option, index) => (
                            renderChip ? (
                                renderChip(option, () => handleRemoveOption(option))
                            ) : (
                                <Chip
                                    key={`${getOptionKey(option)}-${index}`}
                                    label={formatOptionLabel(option)}
                                    onDelete={() => handleRemoveOption(option)}
                                    color="primary"
                                    variant="outlined"
                                    sx={{
                                        m: 0.5,
                                        transition: 'all 0.2s',
                                    }}
                                />
                            )
                        ))}
                    </Box>
                )}

                <TextField
                    fullWidth
                    label={inputLabel}
                    placeholder={inputPlaceholder}
                    variant="outlined"
                    value={inputValue}
                    onChange={handleInputChange}
                    sx={{mb: 2}}
                />

                {/* Content area - scrollable */}
                <Box sx={{flex: 1, overflow: 'auto', minHeight: 100, maxHeight: 300}}>
                    {isLoading ? (
                        <Box display="flex" justifyContent="center" alignItems="center" height={200}>
                            <CircularProgress/>
                        </Box>
                    ) : options.length > 0 ? (
                        <Paper elevation={0} sx={{height: '100%'}}>
                            <List disablePadding>
                                {options.map((option, index) => (
                                    // @ts-ignore
                                    <ListItem
                                        key={`${getOptionKey(option)}-${index}`}
                                        button
                                        onClick={() => handleSelectOption(option)}
                                        sx={{
                                            borderRadius: 1,
                                            mb: 0.5,
                                            '&:hover': {
                                                backgroundColor: 'action.hover'
                                            }
                                        }}
                                    >
                                        {renderOption ? (
                                            renderOption(option)
                                        ) : (
                                            <ListItemText primary={formatOptionLabel(option)}/>
                                        )}
                                    </ListItem>
                                ))}
                            </List>
                        </Paper>
                    ) : inputValue && !isLoading ? (
                        <Typography variant="body2" color="text.secondary" align="center" sx={{mt: 2}}>
                            No options found
                        </Typography>
                    ) : null}
                </Box>

               <Stack direction={"row"} alignItems={"center"} justifyContent={'space-between'} sx={{mt: 2}}>
                   {/* Selection counter */}
                   {maxSelections && (
                       <Typography
                           variant="caption"
                           color="text.secondary"
                           align="right"
                       >
                           {selectedOptions.length} of {maxSelections} selected
                       </Typography>
                   )}

                   {
                       selectedOptions?.length > 0 &&
                       <Button
                           type={'button'} variant={'contained'}
                           endIcon={<CheckCircle/>}
                           onClick={handleClose}
                       >
                           Proceed with selection
                       </Button>
                   }
               </Stack>
            </Box>
        </Modal>
    );
}