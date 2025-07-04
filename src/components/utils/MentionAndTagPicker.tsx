import React, {JSX} from "react";
import Box from "@mui/material/Box";
import Popover from "@mui/material/Popover";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

interface MentionAndTagPickerProps<T> {
    triggerCharacter: string; // Character to trigger the popover (e.g., '@', '#')
    inputId: string; // ID of the input element
    options: {value: T, label: string}[]; // List of selectable options
    isVisible: boolean; // Visibility state of the popover
    onClose: () => void; // Close handler for the popover
    setValue: (newValue: string) => void; // Function to update the text state in the parent
    renderItem?: (item: T) => JSX.Element;
    onSelect?: (value: string) => void; // Callback when an item is selected
}

export const MentionAndTagPicker: React.FC<MentionAndTagPickerProps<any>> = ({
                                                                            triggerCharacter,
                                                                            inputId,
                                                                            onSelect,
                                                                            options = [],
                                                                            isVisible,
                                                                            onClose,
                                                                            setValue,
                                                                            renderItem
                                                                        }) => {

    const handleOptionClick = (option: string) => {
        const inputElement = document.getElementById(inputId) as HTMLTextAreaElement | null;
        if (inputElement) {
            const cursorPos = inputElement.selectionStart || 0;
            const messageText = inputElement.value;

            // Find the start and end of the mention being typed
            const beforeCursor = messageText.slice(0, cursorPos);
            const afterCursor = messageText.slice(cursorPos);

            const mentionStart = beforeCursor.lastIndexOf(triggerCharacter);
            const mentionEnd = afterCursor.search(/\s|$/) + cursorPos;

            // Replace the mention with the selected option
            const newText =
                messageText.slice(0, mentionStart) +
                `${triggerCharacter}${option}` +
                messageText.slice(mentionEnd);

            // Update the parent state
            setValue(newText);
            onSelect && onSelect(option);
        }

        onClose(); // Close the popover
    };

    return (
        <Popover
            open={isVisible}
            anchorEl={document.getElementById(inputId)}
            onClose={onClose}
            anchorOrigin={{vertical: "top", horizontal: "center"}}
            transformOrigin={{vertical: "bottom", horizontal: "center"}}
            PaperProps={{
                sx: {
                    width: "200px",
                    maxHeight: "400px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                },
            }}
        >
            <Stack direction="column" p={1}>
                {options.map((option, index) => (
                    <Box
                        key={index}
                        sx={{
                            cursor: "pointer",
                            "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.1)" },
                        }}
                        onClick={() => handleOptionClick(option?.label)}
                    >
                        {
                            renderItem && typeof renderItem === "function" ?
                                renderItem(option.value)
                                :
                                <Typography
                                    p={1} borderRadius={2}
                                >
                                    {triggerCharacter}
                                    {option?.label}
                                </Typography>
                        }
                    </Box>
                ))}
            </Stack>
        </Popover>
    );
};

// utils/mentionUtils.ts
export const handleMentionAndTagInputChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    triggerCharacter: string,
    setValue: (value: string) => void,
    onTriggerDetected: () => void,
    onTriggerCleared: () => void,
) => {
    const value = e.target.value;
    const cursorPos = e.target.selectionStart || 0;
    const beforeCursor = value.slice(0, cursorPos);
    const lastWord = beforeCursor.split(/\s/).pop();

    // Update the form value
    setValue(value);

    // Detect the trigger character
    if (lastWord && lastWord.startsWith(triggerCharacter)) {
        onTriggerDetected();
    } else {
        onTriggerCleared();
    }
};

export const handleMentionSelect = (
    mention: string,
    inputId: string,
    triggerCharacter: string,
    setValue: (key: string, value: string) => void,
    formKey: string
) => {
    const inputElement = document.getElementById(inputId) as HTMLTextAreaElement | null;

    if (inputElement) {
        const cursorPos = inputElement.selectionStart || 0;
        const messageText = inputElement.value;

        const beforeCursor = messageText.slice(0, cursorPos);
        const afterCursor = messageText.slice(cursorPos);

        const mentionStart = beforeCursor.lastIndexOf(triggerCharacter);
        const mentionEnd = afterCursor.search(/\s|$/) + cursorPos;

        const newText =
            messageText.slice(0, mentionStart) +
            `${triggerCharacter}${mention} ` +
            messageText.slice(mentionEnd);

        setValue(formKey, newText);
    }
};
