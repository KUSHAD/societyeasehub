"use client";

import { type SingleValue } from "react-select";
import { useMemo } from "react";
import CreatableReactSelect from "react-select/creatable";
import { cn } from "~/lib/utils";

interface CreatableSelectProps {
  onChange: (value?: string) => void;
  onCreate: (value?: string) => void;
  options: { label: string; value: string }[];
  value: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

const controlStyles = {
  base: "border border-border rounded-lg bg-background hover:cursor-pointer hover:bg-secondary",
  focus: "border-border ring-ring ring-primary-500",
  nonFocus: "border-border",
};
const placeholderStyles = "text-muted-foreground text-sm ml-1";
const selectInputStyles = "text-foreground text-sm ml-1";
const valueContainerStyles = "text-foreground text-sm";
const singleValueStyles = "ml-1";
const multiValueStyles =
  "ml-1 bg-background border border-border rounded items-center py-0.5 pl-2 pr-1 gap-1.5";
const multiValueLabelStyles = "leading-6 py-0.5";
const multiValueRemoveStyles =
  "border border-gray-200 bg-white hover:bg-red-50 hover:text-red-800 text-gray-500 hover:border-red-300 rounded-md bg-background";
const indicatorsContainerStyles = "p-1 gap-1 bg-background rounded-lg";
const clearIndicatorStyles = "text-gray-500 p-1 rounded-md hover:text-red-800";
const indicatorSeparatorStyles = "bg-mutated";
const dropdownIndicatorStyles = "p-1 hover:text-foreground text-gray-500";
const menuStyles =
  "mt-2 p-2 border border-border bg-background text-sm rounded-lg";
const optionsStyle =
  "bg-background p-2 border-0 text-base hover:bg-secondary hover:cursor-pointer";
const groupHeadingStyles = "ml-3 mt-2 mb-1 text-gray-500 text-sm bg-background";
const noOptionsMessageStyles = "text-muted-foreground bg-background";

export function CreatableSelect({
  onChange,
  onCreate,
  options = [],
  value,
  disabled,
  placeholder,
}: CreatableSelectProps) {
  const onSelect = (option: SingleValue<{ label: string; value: string }>) => {
    onChange(option!.value);
  };

  const formattedValue = useMemo(
    () => options.find((option) => option.value === value),
    [options, value],
  );

  return (
    <CreatableReactSelect
      unstyled
      isClearable
      isSearchable
      className="h-10 text-sm"
      classNames={{
        control: ({ isFocused }) =>
          cn(
            isFocused ? controlStyles.focus : controlStyles.nonFocus,
            controlStyles.base,
          ),
        placeholder: () => placeholderStyles,
        input: () => selectInputStyles,
        option: () => optionsStyle,
        menu: () => menuStyles,
        valueContainer: () => valueContainerStyles,
        singleValue: () => singleValueStyles,
        multiValue: () => multiValueStyles,
        multiValueLabel: () => multiValueLabelStyles,
        multiValueRemove: () => multiValueRemoveStyles,
        indicatorsContainer: () => indicatorsContainerStyles,
        clearIndicator: () => clearIndicatorStyles,
        indicatorSeparator: () => indicatorSeparatorStyles,
        dropdownIndicator: () => dropdownIndicatorStyles,
        groupHeading: () => groupHeadingStyles,
        noOptionsMessage: () => noOptionsMessageStyles,
      }}
      placeholder={placeholder}
      isDisabled={disabled}
      value={formattedValue}
      onChange={onSelect}
      options={options}
      onCreateOption={onCreate}
    />
  );
}
