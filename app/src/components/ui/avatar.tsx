/**
 * A composable avatar component built on Radix UI's Avatar primitive.
 * Features a neumorphic design with image support and fallback states.
 * 
 * Components:
 * - Avatar: Root container component
 * - AvatarImage: Image display with proper scaling
 * - AvatarFallback: Fallback content when image fails
 * 
 * Features:
 * - Neumorphic shadow styling
 * - Circular design
 * - Image loading states
 * - Fallback content support
 * - Consistent sizing
 * - Responsive design
 * 
 * @component
 * @example
 * ```tsx
 * // Basic avatar with image
 * <Avatar>
 *   <AvatarImage src="https://example.com/avatar.jpg" alt="User" />
 *   <AvatarFallback>JD</AvatarFallback>
 * </Avatar>
 * 
 * // Avatar with custom size
 * <Avatar className="h-16 w-16">
 *   <AvatarImage src="/avatar.png" />
 *   <AvatarFallback>
 *     <UserIcon className="h-8 w-8" />
 *   </AvatarFallback>
 * </Avatar>
 * 
 * // Avatar with initials fallback
 * <Avatar>
 *   <AvatarImage src={user.avatarUrl} />
 *   <AvatarFallback>
 *     {user.firstName[0]}{user.lastName[0]}
 *   </AvatarFallback>
 * </Avatar>
 * ```
 */

import * as React from "react"
import * as AvatarPrimitive from "@radix-ui/react-avatar"

import { cn } from "../../lib/utils"

/**
 * Root avatar container
 * Provides circular shape and overflow handling
 */
const Avatar = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Root>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full",
      className
    )}
    {...props}
  />
))
Avatar.displayName = AvatarPrimitive.Root.displayName

/**
 * Image component for avatar
 * Handles aspect ratio and scaling
 */
const AvatarImage = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Image>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Image>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Image
    ref={ref}
    className={cn("aspect-square h-full w-full", "neu-shadow-sm", className)}
    {...props}
  />
))
AvatarImage.displayName = AvatarPrimitive.Image.displayName

/**
 * Fallback content when image fails to load
 * Can contain text, icons, or other content
 */
const AvatarFallback = React.forwardRef<
  React.ElementRef<typeof AvatarPrimitive.Fallback>,
  React.ComponentPropsWithoutRef<typeof AvatarPrimitive.Fallback>
>(({ className, ...props }, ref) => (
  <AvatarPrimitive.Fallback
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      "neu-shadow-sm",
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = AvatarPrimitive.Fallback.displayName

export { Avatar, AvatarImage, AvatarFallback }
