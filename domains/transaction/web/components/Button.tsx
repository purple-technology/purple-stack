import type { ButtonHTMLAttributes } from 'react'
import './Button.css'

export type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
	variant?: 'primary' | 'secondary'
	fullWidth?: boolean
}

export function Button({
	variant = 'primary',
	fullWidth = false,
	className = '',
	...props
}: ButtonProps) {
	const classes = [
		'transaction-button',
		`transaction-button--${variant}`,
		fullWidth ? 'transaction-button--full-width' : '',
		className
	]
		.filter(Boolean)
		.join(' ')

	return <button className={classes} {...props} />
}
