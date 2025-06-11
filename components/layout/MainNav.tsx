import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MainNav() {
  const pathname = usePathname();

  const routes = [
    {
      href: '/dashboard',
      label: 'Dashboard',
    },
    {
      href: '/survey',
      label: 'Surveys',
    },
    {
      href: '/templates',
      label: 'Templates',
    },
    {
      href: '/responses',
      label: 'Responses',
    },
  ];

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            'text-sm font-medium transition-colors hover:text-primary',
            pathname === route.href
              ? 'text-black dark:text-white'
              : 'text-muted-foreground'
          )}
        >
          <div className="flex items-center space-x-2">
            {route.icon && <route.icon className="h-4 w-4" />}
            <span>{route.label}</span>
          </div>
        </Link>
      ))}
      <Button
        variant="default"
        size="sm"
        className="ml-4"
        asChild
      >
        <Link href="/pricing" className="flex items-center space-x-2">
          <Sparkles className="h-4 w-4" />
          <span>Pricing</span>
        </Link>
      </Button>
    </nav>
  );
} 