"use client";

import { type SingleValue } from "react-select";
import { useMemo } from "react";
import CreatableReactSelect from "react-select/creatable";

interface CreatableSelectProps {
  onChange: (value?: string) => void;
  onCreate: (value?: string) => void;
  options: { label: string; value: string }[];
  value: string | null | undefined;
  disabled?: boolean;
  placeholder?: string;
}

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
      className="h-10 text-sm"
      styles={{
        control: (base) => ({
          ...base,
          borderColor: "#e2e8f0",
          ":hover": {
            borderColor: "#e2e8f0",
          },
        }),
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
