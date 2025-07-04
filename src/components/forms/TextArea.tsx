import * as React from "react";
import {forwardRef, JSX, KeyboardEventHandler} from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form/dist/types";
import FormControl from "@mui/material/FormControl";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import {TextFieldProps} from "@mui/material/TextField/TextField";
import {InputProps as StandardInputProps} from "@mui/material/Input/Input";

interface Props<T> {
    id: string;
    name: string;
    minRows?: number;
    maxRows?: number;
    required?: boolean;
    type?: React.InputHTMLAttributes<unknown>['type'];
    label?: string;
    variant?: 'outlined' | 'standard';
    control: Control<{ [p: string]: string }, any>;
    rules: any;
    errors: any;
    onChange?: StandardInputProps['onChange'];
    Icon?: JSX.Element;
    EndIcon?: JSX.Element;
    textFieldProps: TextFieldProps;
    onKeyDown?: KeyboardEventHandler<T> | undefined;
}

export const TextArea = forwardRef((props: Props<any>, ref: React.Ref<any>) => {

    const handleOnChange = (e: any, field: any) => {
        props.onChange && props.onChange(e);
        return field.onChange(e);
    };

    const assignRef = (input: any, fieldRef: (instance: any) => void) => {
        fieldRef(input); // Assign the input element to field.ref
        if (ref) {
            // Forward the ref to the parent
            if (typeof ref === 'function') {
                ref(input);
            } else if (ref && 'current' in ref) {
                // @ts-ignore
                ref.current = input;
            }
        }
    };

    return (
        <FormControl margin="normal" fullWidth>
            <Controller
                name={props.name}
                control={props.control}
                rules={props.rules}
                render={({field, fieldState}) => (
                    <TextField
                        {...field}
                        ref={(input) => assignRef(input, field.ref)}
                        multiline
                        minRows={props.minRows || 1}
                        maxRows={props.maxRows || 5}
                        id={props.id}
                        label={props.label}
                        variant="outlined"
                        required={props.required}
                        error={!!fieldState.error}
                        helperText={<ErrorMessage errors={props.errors} name={props.name}/>}
                        type={props.type}
                        onChange={(e) => handleOnChange(e, field)}
                        onKeyDown={props.onKeyDown}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    {props.Icon}
                                </InputAdornment>
                            ),
                            endAdornment: props.EndIcon ? (
                                <InputAdornment position="end">{props.EndIcon}</InputAdornment>
                            ) : undefined,
                        }}
                        {...props.textFieldProps}
                    />
                )}
            />
        </FormControl>
    );
});

