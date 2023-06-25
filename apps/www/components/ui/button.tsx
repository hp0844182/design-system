'use client'
import type { ElementType } from 'react'
import { forwardRefWithAs } from '@/share/render'
import { cva, type VariantProps } from 'class-variance-authority'
import { twMerge } from 'tailwind-merge'
import { useButton } from 'react-aria'
import { useFilterPressProps } from '@/share/utils/useFilterPressProps'

export type PointerType = 'mouse' | 'pen' | 'touch' | 'keyboard' | 'virtual';

export interface PressEvent {
	/** The type of press event being fired. */
	type: 'pressstart' | 'pressend' | 'pressup' | 'press',
	/** The pointer type that triggered the press event. */
	pointerType: PointerType,
	/** The target element of the press event. */
	target: Element,
	/** Whether the shift keyboard modifier was held during the press event. */
	shiftKey: boolean,
	/** Whether the ctrl keyboard modifier was held during the press event. */
	ctrlKey: boolean,
	/** Whether the meta keyboard modifier was held during the press event. */
	metaKey: boolean,
	/** Whether the alt keyboard modifier was held during the press event. */
	altKey: boolean
}

export interface PressEvents {
	/** Handler that is called when the press is released over the target. */
	onPress?: (e: PressEvent) => void,
	/** Handler that is called when a press interaction starts. */
	onPressStart?: (e: PressEvent) => void,
	/**
	 * Handler that is called when a press interaction ends, either
	 * over the target or when the pointer leaves the target.
	 */
	onPressEnd?: (e: PressEvent) => void,
	/** Handler that is called when the press state changes. */
	onPressChange?: (isPressed: boolean) => void,
	/**
	 * Handler that is called when a press is released over the target, regardless of
	 * whether it started on the target or not.
	 */
	onPressUp?: (e: PressEvent) => void
}
const buttonVariants = cva(
	'inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
	{
		variants: {
			variant: {
				default: 'bg-primary text-primary-foreground hover:bg-primary/90',
				destructive:
					'bg-destructive text-destructive-foreground hover:bg-destructive/90',
				outline:
					'border border-input hover:bg-accent hover:text-accent-foreground',
				secondary:
					'bg-secondary text-secondary-foreground hover:bg-secondary/80',
				ghost: 'hover:bg-accent hover:text-accent-foreground',
				link: 'text-primary underline-offset-4 hover:underline',
			},
			size: {
				default: 'h-10 px-4 py-2',
				sm: 'h-9 rounded-md px-3',
				lg: 'h-11 rounded-md px-8',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
)

interface ElementProps<T extends React.ElementType> extends PressEvents {
	elementType?: T
	className?: string;
	children?: React.ReactNode | React.ReactNode[]
}

type IButtonProps = VariantProps<typeof buttonVariants>

export type ButtonProps<T extends ElementType> = Omit<React.ComponentProps<T>, keyof IButtonProps> & ElementProps<T> & IButtonProps


const DEFAULT__TAG = 'button'
export const Button = forwardRefWithAs(<
	TTag extends ElementType = typeof DEFAULT__TAG,
>(props: ButtonProps<TTag>, ref: React.ForwardedRef<HTMLButtonElement | HTMLElement>) => {
	let { elementType = 'button', className, variant, size, children, ...others } = props
	const Comp = elementType
	const { buttonProps } = useButton(props, ref as any)
	others = useFilterPressProps(others)
	return (
		<Comp
			{
				...others
			}
			{
				...buttonProps
			}
			className={twMerge(buttonVariants({ variant, size }), className)}
			ref={ref} >
			{children}
		</Comp>
	)
},
)

