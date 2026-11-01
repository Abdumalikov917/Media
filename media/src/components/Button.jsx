import { Link } from "react-router-dom"

/**
 * variant: "primary" | "ghost" | "danger"
 * to  -> ichki havola, href -> tashqi havola, aks holda <button>
 */
export default function Button({ to, href, variant = "primary", size, block, className = "", children, ...props }) {
  const classes = [
    "btn",
    variant !== "primary" && `btn--${variant}`,
    size && `btn--${size}`,
    block && "btn--block",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  )
}
