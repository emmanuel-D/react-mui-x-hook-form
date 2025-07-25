import * as React from "react";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Control } from "react-hook-form";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker as MuiDateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { Calendar } from "react-feather";
import dayjs, { Dayjs } from "dayjs";
import { APP_DATE_FORMAT, APP_TIME_FORMAT } from "../../constants/dates.constant";
import {DateTimePickerProps} from "@mui/x-date-pickers/DateTimePicker/DateTimePicker.types";

interface Props {
    id: string;
    name: string;
    defaultDateTime?: Dayjs | Date | string;
    required?: boolean;
    type?: React.InputHTMLAttributes<unknown>["type"];
    label: string;
    variant?: "outlined" | "standard";
    control: Control<{ [p: string]: any }, any>;
    rules?: any;
    errors?: any;
    Icon?: React.ReactNode;
    formControlProps?: FormControlProps;
    muiDateTimePickerProps?: DateTimePickerProps;
}

/**
 * Usage:
 * ```tsx
 * <DateTimePicker
 *   id="eventStart"
 *   name="eventStart"
 *   label="Event Start Time"
 *   control={control}
 *   rules={{ required: "Start time is required" }}
 *   errors={errors}
 * />
 * ```
 * @param id
 * @param name
 * @param defaultDateTime
 * @param required
 * @param type
 * @param label
 * @param variant
 * @param control
 * @param rules
 * @param errors
 * @param Icon
 * @param formControlProps
 * @param muiDateTimePickerProps
 * @constructor
 */
export const DateTimePicker = ({
                                   id,
                                   name,
                                   defaultDateTime,
                                   required,
                                   type,
                                   label,
                                   variant = "outlined",
                                   control,
                                   rules,
                                   errors,
                                   Icon,
                                   formControlProps,
                                   muiDateTimePickerProps
                               }: Props) => {
    const [value, setValue] = React.useState<Dayjs | null>(
        defaultDateTime ? dayjs(defaultDateTime) : null
    );

    const renderIcon = () => Icon || <Calendar size={16} />;

    return (
        <FormControl fullWidth margin="normal" {...formControlProps}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field: { onChange, ref }, fieldState }) => (
                        <MuiDateTimePicker
                            label={label}
                            value={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                                onChange(newValue);
                            }}
                            format={`${APP_DATE_FORMAT} ${APP_TIME_FORMAT}`}
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
                            {...muiDateTimePickerProps}
                        />
                    )}
                />
            </LocalizationProvider>
        </FormControl>
    );
};
