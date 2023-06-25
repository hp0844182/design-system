import Link from 'next/link'

import { siteConfig } from '@/config/site'
// import { CommandMenu } from '@/components/command-menu'
// import { Icons } from '@/components/icons'
import { MainNav } from '@/components/main-nav'
// import { MobileNav } from '@/components/mobile-nav'
import { ModeToggle } from '@/components/mode-toggle'
import { Github, Twitter } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function SiteHeader() {
	return (
		<header className=" sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
			<div className="container flex h-14 items-center">
				<MainNav />
				{/* <MobileNav /> */}
				<div className="flex flex-1 items-center justify-between space-x-2 sm:space-x-4 md:justify-end">
					<div className="w-full flex-1 md:w-auto md:flex-none">
						{/* <CommandMenu /> */}
					</div>
					<nav className="flex items-center space-x-1">
						<ModeToggle />
					</nav>
				</div>
			</div>
		</header>
	)
}
