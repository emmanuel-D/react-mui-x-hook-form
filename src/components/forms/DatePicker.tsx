import * as React from "react";
import { Controller } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { Control } from "react-hook-form";
import FormControl, { FormControlProps } from "@mui/material/FormControl";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker as MuiDatePicker, DatePickerProps} from "@mui/x-date-pickers/DatePicker";
import { Calendar } from "react-feather";
import dayjs, { Dayjs } from "dayjs";
import { APP_DATE_FORMAT } from "../../constants/dates.constant";

interface Props {
    id: string;
    name: string;
    defaultDate?: Dayjs | Date | string;
    required?: boolean;
    type?: React.InputHTMLAttributes<unknown>["type"];
    label: string;
    variant?: "outlined" | "standard";
    control: Control<{ [p: string]: any }, any>;
    rules?: any;
    errors?: any;
    Icon?: React.ReactNode;
    formControlProps?: FormControlProps;
    muiDatePickerProps?: DatePickerProps;
}

/**
 * Usage:
 * ```tsx
 * <DatePicker
 *   id="startDate"
 *   name="startDate"
 *   label="Start Date"
 *   control={control}
 *   rules={{ required: "Start date is required" }}
 *   errors={errors}
 * />
 * ```
 * @param id
 * @param name
 * @param defaultDate
 * @param required
 * @param type
 * @param label
 * @param variant
 * @param control
 * @param rules
 * @param errors
 * @param Icon
 * @param formControlProps
 * @param muiDatePickerProps
 * @constructor
 */
export const DatePicker = ({
                               id,
                               name,
                               defaultDate,
                               required,
                               type,
                               label,
                               variant = "outlined",
                               control,
                               rules,
                               errors,
                               Icon,
                               formControlProps,
                               muiDatePickerProps
                           }: Props) => {
    const [value, setValue] = React.useState<Dayjs | null>(
        defaultDate ? dayjs(defaultDate) : null
    );

    const renderIcon = () => Icon || <Calendar />;

    return (
        <FormControl fullWidth margin="normal" {...formControlProps}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field: { onChange, ref }, fieldState }) => (
                        <MuiDatePicker
                            label={label}
                            value={value}
                            defaultValue={value}
                            onChange={(newValue) => {
                                setValue(newValue);
                                onChange(newValue);
                            }}
                            format={APP_DATE_FORMAT}
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
                                        endAdornment: renderIcon(),
                                    },
                                },
                            }}
                            {...muiDatePickerProps}
                        />
                    )}
                />
            </LocalizationProvider>
        </FormControl>
    );
};
