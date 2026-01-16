import { useState } from 'react'
import { Controller } from 'react-hook-form'
import { FormItem } from '@/components/ui/Form'
import { Select, SelectProps } from '@/components/ui/Select'
import type { Control, FieldValues, Path } from 'react-hook-form'

interface CommonSelectProps<TFieldValues extends FieldValues, Option = any>
    extends Omit<SelectProps<Option>, 'name'> {
    name: Path<TFieldValues>
    control: Control<TFieldValues>
    label?: string
    errorMessage?: string
    invalid?: boolean
    containerClassName?: string
    labelClassName?: string
    floatingLabel?: boolean
    value?: any
}

const CommonSelect = <TFieldValues extends FieldValues, Option = any>(
    props: CommonSelectProps<TFieldValues, Option>,
) => {
    const {
        name,
        control,
        label,
        errorMessage,
        invalid,
        containerClassName,
        labelClassName,
        options,
        placeholder,
        className,
        styles,
        floatingLabel,
        value: propValue,
        ...rest
    } = props

    const [isFocused, setIsFocused] = useState(false)

    return (
        <FormItem
            label={!floatingLabel ? label : ''}
            invalid={invalid}
            errorMessage={errorMessage}
            className={containerClassName}
            labelClass={labelClassName}
        >
            <Controller
                name={name}
                control={control}
                render={({ field: { ref: fieldRef, ...field } }) => {
                    const hasValue = field.value !== undefined && field.value !== null && field.value !== ''
                    const isFloating = floatingLabel && (isFocused || hasValue)

                    const selectElement = (
                        <Select
                            {...field}
                            {...rest}
                            ref={fieldRef as any}
                            options={options}
                            placeholder={!floatingLabel ? placeholder : ''}
                            className={className || 'w-full font-poppins'}
                            value={
                                (options?.find(
                                    (opt: any) =>
                                        opt.value ===
                                        (propValue !== undefined
                                            ? propValue
                                            : field.value),
                                ) ||
                                    (placeholder
                                        ? { label: placeholder, value: '' }
                                        : null)) as any
                            }
                            onChange={(option: any) =>
                                field.onChange(option?.value)
                            }
                            onFocus={(e) => {
                                setIsFocused(true)
                                rest.onFocus?.(e as any)
                            }}
                            onBlur={(e) => {
                                setIsFocused(false)
                                rest.onBlur?.(e as any)
                            }}
                            styles={{
                                control: (base: any) => ({
                                    ...base,
                                    backgroundColor: '#383C56',
                                    borderColor: '#454a64',
                                    '&:hover': {
                                        borderColor: '#454a64',
                                    },
                                    boxShadow: 'none',
                                    paddingTop: floatingLabel ? '14px' : '2px',
                                    paddingBottom: floatingLabel ? '0px' : '2px',
                                    minHeight: floatingLabel ? '48px' : '38px',
                                }),
                                singleValue: (base: any) => ({
                                    ...base,
                                    color: '#ffffff',
                                }),
                                placeholder: (base: any) => ({
                                    ...base,
                                    color: '#A1A1AA',
                                }),
                                ...styles,
                            }}
                        />
                    )

                    if (floatingLabel) {
                        return (
                            <div className="relative">
                                {selectElement}
                                <label
                                    className={`absolute left-3 transition-all duration-200 pointer-events-none font-poppins z-10 ${isFloating
                                        ? 'top-1 text-xs text-[#A1A1AA]'
                                        : 'top-1/2 -translate-y-1/2 text-sm text-[#A1A1AA]'
                                        }`}
                                >
                                    {label}
                                </label>
                            </div>
                        )
                    }

                    return selectElement
                }}
            />
        </FormItem>
    )
}

export default CommonSelect
