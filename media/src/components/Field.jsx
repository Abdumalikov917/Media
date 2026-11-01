/** Yorliq + input (yoki textarea) + xato/maslahat matni. */
export default function Field({ id, label, error, hint, optional = false, multiline = false, rows = 6, ...inputProps }) {
  const Tag = multiline ? "textarea" : "input"
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const describedBy = error ? errorId : hint ? hintId : undefined

  return (
    <div className="field">
      <label className="label" htmlFor={id}>
        {label}
        {optional && <small>ixtiyoriy</small>}
      </label>
      <Tag
        id={id}
        className={`${multiline ? "textarea" : "input"}${error ? " is-invalid" : ""}`}
        aria-invalid={error ? "true" : undefined}
        aria-describedby={describedBy}
        rows={multiline ? rows : undefined}
        {...inputProps}
      />
      {error ? (
        <p id={errorId} className="error-text" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="hint">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
