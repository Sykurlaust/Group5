interface FormInputProps {
  label: string
  id: string
  type?: string
  placeholder?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
}

const FormInput = ({
  label,
  id,
  type = "text",
  placeholder,
  value,
  onChange,
  required = false,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="text-sm font-semibold text-gray-500">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-[18px] border border-black/10 px-4 py-3 text-sm outline-none focus:border-[#047857]"
      />
    </div>
  )
}

export default FormInput
