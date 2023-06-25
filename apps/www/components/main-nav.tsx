'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { siteConfig } from '@/config/site'
import clsx from 'classnames'
import { Diamond } from 'lucide-react'

export function MainNav() {
	const pathname = usePathname()

	return (
		<div className="mr-4 hidden md:flex">
			<Link href="/" className="mr-6 flex items-center space-x-2">
				<Diamond className="h-6 w-6" />
				<span className="hidden font-bold sm:inline-block">
					{siteConfig.name}
				</span>
			</Link>
			<nav className="flex items-center space-x-6 text-sm font-medium">
				<Link
					href="/docs"
					className={clsx(
						'hover:text-foreground/80 transition-colors',
						pathname === '/docs' ? 'text-foreground' : 'text-foreground/60'
					)}
				>
          Documentation
				</Link>
				<Link
					href="/docs/components"
					className={clsx(
						'hover:text-foreground/80 transition-colors',
						pathname?.startsWith('/docs/components')
							? 'text-foreground'
							: 'text-foreground/60'
					)}
				>
          Components
				</Link>
				<Link
					href="/examples"
					className={clsx(
						'hover:text-foreground/80 transition-colors',
						pathname?.startsWith('/examples')
							? 'text-foreground'
							: 'text-foreground/60'
					)}
				>
          Examples
				</Link>
				<Link
					href={siteConfig.links.github}
					className={clsx(
						'text-foreground/60 hover:text-foreground/80 hidden transition-colors lg:block'
					)}
				>
          GitHub
				</Link>
			</nav>
		</div>
	)
}
