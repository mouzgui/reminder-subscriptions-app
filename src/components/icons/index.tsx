/**
 * Premium Icon Components using Lucide
 * Themed wrappers for consistent styling across the app
 */
import React from 'react';
import { useTheme } from '../../theme';
import {
    Trash2,
    Plus,
    Settings,
    Play,
    Cloud,
    Palette,
    Code,
    DollarSign,
    Gamepad2,
    Dumbbell,
    Music,
    Newspaper,
    Package,
    Crown,
    Sun,
    Moon,
    Smartphone,
    Home,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    X,
    Check,
    AlertTriangle,
    Zap,
    Tv,
    TrendingDown,
    Calendar,
    Sparkles,
    FileText,
    ArrowLeft,
    Edit3,
    Bell,
    type LucideIcon,
} from 'lucide-react-native';

// Re-export all icons for easy access
export {
    Trash2,
    Plus,
    Settings,
    Play,
    Cloud,
    Palette,
    Code,
    DollarSign,
    Gamepad2,
    Dumbbell,
    Music,
    Newspaper,
    Package,
    Crown,
    Sun,
    Moon,
    Smartphone,
    Home,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    X,
    Check,
    AlertTriangle,
    Zap,
    Tv,
    TrendingDown,
    Calendar,
    Sparkles,
    FileText,
    ArrowLeft,
    Edit3,
    Bell,
};


// Category icon mapping
export const CATEGORY_ICONS: Record<string, LucideIcon> = {
    streaming: Tv,
    productivity: Zap,
    cloud: Cloud,
    design: Palette,
    development: Code,
    marketing: TrendingDown,
    finance: DollarSign,
    gaming: Gamepad2,
    fitness: Dumbbell,
    music: Music,
    news: Newspaper,
    other: Package,
};

interface ThemedIconProps {
    name: keyof typeof CATEGORY_ICONS;
    size?: number;
    color?: string;
}

export function CategoryIcon({ name, size = 24, color }: ThemedIconProps) {
    const { theme } = useTheme();
    const IconComponent = CATEGORY_ICONS[name] || Package;
    return <IconComponent size={size} color={color || theme.text.brand} strokeWidth={2} />;
}

// Default icon sizes for consistency
export const ICON_SIZES = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
};
