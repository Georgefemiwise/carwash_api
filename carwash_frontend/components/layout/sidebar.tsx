'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Car, 
  Wrench, 
  CreditCard, 
  Users, 
  User,
  LogOut,
  BarChart3, 
} from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { User as UserType, UserRole } from '@/types';
import { useUser } from '@/hooks/use-user';

const routes = [
  {
    label: 'Dashboard',
    icon: Home,
    href: '/dashboard',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER],
  },
  {
    label: 'Cars',
    icon: Car,
    href: '/cars',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER],
  },
  {
    label: 'Service Requests',
    icon: Wrench,
    href: '/service-requests',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER],
  },
  {
    label: 'Transactions',
    icon: CreditCard,
    href: '/transactions',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER],
  },
  {
    label: 'Workers',
    icon: Users,
    href: '/workers',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    label: 'Customers',
    icon: Users,
    href: '/customers',
    roles: [UserRole.ADMIN, UserRole.STAFF],
  },
  {
    label: 'Reports',
    icon: BarChart3,
    href: '/reports',
    roles: [UserRole.ADMIN],
  },
  {
    label: 'Profile',
    icon: User,
    href: '/profile',
    roles: [UserRole.ADMIN, UserRole.STAFF, UserRole.CUSTOMER],
  },
];

interface SidebarProps {
  closeMobile?: () => void;
}

export function Sidebar({ closeMobile }: SidebarProps) {
  const pathname = usePathname();
  const { logout } = useAuth();
  const { currentUser } = useUser();
  
  // Filter routes based on user role
  const filteredRoutes = routes.filter((route) => 
    currentUser && route.roles.includes(currentUser.role as UserRole)
  );

  return (
    <div className="flex flex-col h-full bg-card border-r border-border">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <Wrench size={18} className="text-primary-foreground" />
          </div>
          <h1 className="text-xl font-bold">Car Wash Pro</h1>
        </div>
      </div>
      <div className="space-y-1 px-3 flex-1">
        {filteredRoutes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            onClick={closeMobile}
            className={cn(
              "flex items-center gap-3 p-3 text-sm rounded-md transition-colors",
              pathname === route.href 
                ? "bg-secondary text-secondary-foreground" 
                : "hover:bg-secondary/50 hover:text-secondary-foreground"
            )}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
      <div className="p-4 mt-auto">
        <button
          onClick={() => logout()}
          className="flex w-full items-center gap-3 p-3 text-sm rounded-md hover:bg-secondary/50 transition-colors"
        >
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </div>
  );
}