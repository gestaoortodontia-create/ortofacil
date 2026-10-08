'use client'

export function FormInput({ label, name, type = 'text', required, error, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <input
        name={name}
        type={type}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function FormSelect({ label, name, options, required, error, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <select
        name={name}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        {...props}
      >
        <option value="">Selecione...</option>
        {options?.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function FormCheckbox({ label, name, error, ...props }) {
  return (
    <div className="mb-4">
      <label className="flex items-center">
        <input
          type="checkbox"
          name={name}
          className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          {...props}
        />
        <span className="ml-2 text-sm text-gray-700">{label}</span>
      </label>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}

export function FormTextarea({ label, name, required, error, ...props }) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-600">*</span>}
      </label>
      <textarea
        name={name}
        required={required}
        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        }`}
        rows={4}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  )
}
