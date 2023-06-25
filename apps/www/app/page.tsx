import { StyleSwitcher } from '@/components/style-switcher'
import { PageHeader, PageHeaderDescription, PageHeaderHeading } from '../components/page-header'
import Link from 'next/link'
import { ChevronRight,Github } from 'lucide-react'
import { Button } from '../components/ui/button'

export default function Home() {
	return (
		<div className="container relative pb-10">
			<StyleSwitcher />
			<PageHeader>
				<Link
					href="/docs/forms/react-hook-form"
					className="bg-muted inline-flex items-center rounded-lg px-3 py-1 text-sm font-medium"
				>
					{/* 🎉 <Separator className="mx-2 h-4" orientation="vertical" /> Building */}
          forms with React Hook Form and Zod
					<ChevronRight className="ml-1 h-4 w-4" />
				</Link>
				<PageHeaderHeading>Build your component library.</PageHeaderHeading>
				<PageHeaderDescription>
          Beautifully designed components that you can copy and paste into your
          apps. Accessible. Customizable. Open Source.
				</PageHeaderDescription>
				<div className="flex w-full items-center space-x-4 pb-8 pt-4 md:pb-10">
					<Button elementType={Link} href='/docs/forms/react-hook-form'> Get Started</Button>
					<Button
						elementType={Link}
						target="_blank"
						rel="noreferrer"
						href={''}
					>
						<Github className="mr-2 h-4 w-4" />
            GitHub
					</Button>
				</div>
			</PageHeader>
		</div>
	)
}
