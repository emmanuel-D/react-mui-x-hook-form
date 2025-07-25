import * as React from "react";
import {Controller} from "react-hook-form";
import {ErrorMessage} from "@hookform/error-message";
import {Control} from "react-hook-form";
import FormControl, {FormControlProps} from "@mui/material/FormControl";
import {LocalizationProvider} from "@mui/x-date-pickers/LocalizationProvider";
import {AdapterDayjs} from "@mui/x-date-pickers/AdapterDayjs";
import {DatePicker as MuiDatePicker} from "@mui/x-date-pickers/DatePicker";
import {Dayjs} from "dayjs";
import {Grid, Typography} from "@mui/material";
import {APP_DATE_FORMAT} from "../../constants/dates.constant";
import {Calendar} from "react-feather";

interface Props {
    startName: string;
    endName: string;
    control: Control<{ [key: string]: any }, any>;
    rules?: {
        start?: any;
        end?: any;
    };
    errors?: any;
    label?: string;
    startLabel?: string;
    endLabel?: string;
    required?: boolean;
    formControlProps?: FormControlProps;
    minDate?: Dayjs;
    maxDate?: Dayjs;
}

/**
 * Usage:
 * ```tsx
 * <DateRangePicker
 *   label="Booking Period"
 *   startName="from"
 *   endName="to"
 *   control={control}
 *   errors={errors}
 *   rules={{
 *     start: { required: "Start date is required" },
 *     end: { required: "End date is required" },
 *   }}
 *   minDate={dayjs()}
 *   maxDate={dayjs().add(1, "year")}
 * />
 * ```
 * @param startName
 * @param endName
 * @param control
 * @param rules
 * @param errors
 * @param label
 * @param required
 * @param formControlProps
 * @param minDate
 * @param maxDate
 * @constructor
 */
export const DateRangePicker = ({
                                    startName,
                                    endName,
                                    control,
                                    rules,
                                    errors,
                                    label,
                                    startLabel,
                                    endLabel,
                                    required,
                                    formControlProps,
                                    minDate,
                                    maxDate,
                                }: Props) => {
    const [startDate, setStartDate] = React.useState<Dayjs | null>(null);
    const [endDate, setEndDate] = React.useState<Dayjs | null>(null);

    return (
        <FormControl fullWidth margin="normal" {...formControlProps}>
            {label && (
                <Typography variant="subtitle2" mb={1}>
                    {label} {required && "*"}
                </Typography>
            )}

            <LocalizationProvider dateAdapter={AdapterDayjs}>
                <Grid container spacing={2}>
                    {/* Start Date */}
                    <Grid size={{xs: 6}}>
                        <Controller
                            name={startName}
                            control={control}
                            rules={rules?.start}
                            render={({field: {onChange, ref}, fieldState}) => (
                                <MuiDatePicker
                                    label={startLabel ?? "Start Date"}
                                    value={startDate}
                                    defaultValue={startDate}
                                    onChange={(newValue) => {
                                        setStartDate(newValue);
                                        onChange(newValue);
                                        if (endDate && newValue && endDate.isBefore(newValue)) {
                                            setEndDate(null); // Clear endDate if before start
                                        }
                                    }}
                                    format={APP_DATE_FORMAT}
                                    minDate={minDate}
                                    maxDate={maxDate}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            required,
                                            variant: "outlined",
                                            error: !!fieldState.error,
                                            helperText: (
                                                <ErrorMessage errors={errors} name={startName}/>
                                            ),
                                            /*InputProps: {
                                                endAdornment: <Calendar/>,
                                            },*/
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    {/* End Date */}
                    <Grid size={{xs: 6}}>
                        <Controller
                            name={endName}
                            control={control}
                            rules={rules?.end}
                            render={({field: {onChange, ref}, fieldState}) => (
                                <MuiDatePicker
                                    label={endLabel ?? "End Date"}
                                    value={endDate}
                                    defaultValue={endDate}
                                    onChange={(newValue) => {
                                        setEndDate(newValue);
                                        onChange(newValue);
                                    }}
                                    format={APP_DATE_FORMAT}
                                    minDate={startDate || minDate}
                                    maxDate={maxDate}
                                    slotProps={{
                                        textField: {
                                            inputRef: ref,
                                            required,
                                            variant: "outlined",
                                            error: !!fieldState.error,
                                            helperText: (
                                                <ErrorMessage errors={errors} name={endName}/>
                                            ),
                                            /*InputProps: {
                                                endAdornment: <Calendar/>,
                                            },*/
                                        },
                                    }}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </LocalizationProvider>
        </FormControl>
    );
};
