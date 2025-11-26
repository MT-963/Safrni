'use client'

import Select from 'react-select'

interface Option {
  value: string
  label: string
}

interface SearchableSelectProps {
  options: Option[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  isDisabled?: boolean
}

export function SearchableSelect({
  options,
  value,
  onChange,
  placeholder,
  isDisabled = false
}: SearchableSelectProps) {
  const selectedOption = options.find(opt => opt.value === value) || null

  return (
    <Select
      options={options}
      value={selectedOption}
      onChange={(option) => onChange(option?.value || '')}
      placeholder={placeholder}
      isDisabled={isDisabled}
      isClearable
      isSearchable
      noOptionsMessage={() => 'لا توجد نتائج'}
      styles={{
        control: (base, state) => ({
          ...base,
          minHeight: '40px',
          borderColor: state.isFocused ? '#3b82f6' : '#d1d5db',
          boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
          '&:hover': {
            borderColor: '#3b82f6'
          },
          direction: 'rtl'
        }),
        menu: (base) => ({
          ...base,
          zIndex: 9999,
          direction: 'rtl'
        }),
        option: (base, state) => ({
          ...base,
          backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
          color: state.isSelected ? 'white' : '#1f2937',
          textAlign: 'right',
          cursor: 'pointer',
          '&:active': {
            backgroundColor: '#3b82f6'
          }
        }),
        placeholder: (base) => ({
          ...base,
          textAlign: 'right',
          color: '#9ca3af'
        }),
        singleValue: (base) => ({
          ...base,
          textAlign: 'right'
        }),
        input: (base) => ({
          ...base,
          textAlign: 'right'
        })
      }}
    />
  )
}

