import * as React from "react";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Control } from "react-hook-form";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker as MuiTimePicker } from "@mui/x-date-pickers/TimePicker";
import { Clock } from "react-feather";
import dayjs, { Dayjs } from "dayjs";
import { APP_TIME_FORMAT } from "../../constants/dates.constant";
import {TimePickerProps} from "@mui/x-date-pickers/TimePicker/TimePicker.types";

interface Props {
    id: string;
    name: string;
    defaultTime?: Dayjs | Date | string;
    required?: boolean;
    type?: React.InputHTMLAttributes<unknown>["type"];
    label: string;
    variant?: "outlined" | "standard";
    control: Control<{ [p: string]: any }, any>;
    rules?: any;
    errors?: any;
    Icon?: React.ReactNode;
    formControlProps?: FormControlProps;
    muiTimePickerProps?: TimePickerProps
}

export const TimePicker = ({
                               id,
                               name,
                               defaultTime,
                               required,
                               type,
                               label,
                               variant = "outlined",
                               control,
                               rules,
                               errors,
                               Icon,
                               formControlProps,
                               muiTimePickerProps
                           }: Props) => {
    const [value, setValue] = React.useState<Dayjs | null>(
        defaultTime ? dayjs(defaultTime) : null
    );

    const renderIcon = () => Icon || <Clock size={16} />;

    return (
        <FormControl fullWidth margin="normal" {...formControlProps}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field: { onChange, ref }, fieldState }) => (
                        <MuiTimePicker
                            label={label}
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                                onChange(newValue);
                            }}
                            format={APP_TIME_FORMAT}
                            slotProps={{
                                textField: {
                                    inputRef: ref,
                                    id,
                                    required,
                                    type,
                                    variant,
                                    error: !!fieldState.error,
                                    helperText: <ErrorMessage errors={errors} name={name} />,
                                    InputProps: {
                                        startAdornment: renderIcon(),
                                    },
                                },
                            }}
                            {...muiTimePickerProps}
                        />
                    )}
                />
            </LocalizationProvider>
        </FormControl>
    );
};
