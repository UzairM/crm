/**
 * A composable card component with neumorphic design.
 * Provides a structured container for content with consistent spacing and styling.
 * 
 * Components:
 * - Card: Root container with neumorphic shadow
 * - CardHeader: Top section for title and description
 * - CardTitle: Main heading of the card
 * - CardDescription: Secondary text below title
 * - CardContent: Main content area
 * - CardFooter: Bottom section for actions
 * 
 * Features:
 * - Neumorphic shadows with dark mode support
 * - Consistent padding and spacing
 * - Semantic HTML structure
 * - Flexible composition
 * - Responsive design
 * 
 * @component
 * @example
 * ```tsx
 * <Card>
 *   <CardHeader>
 *     <CardTitle>Card Title</CardTitle>
 *     <CardDescription>Optional card description</CardDescription>
 *   </CardHeader>
 *   <CardContent>
 *     <p>Main content goes here</p>
 *   </CardContent>
 *   <CardFooter>
 *     <Button>Action</Button>
 *   </CardFooter>
 * </Card>
 * 
 * // Simple card without header
 * <Card>
 *   <CardContent>
 *     <p>Content only card</p>
 *   </CardContent>
 * </Card>
 * ```
 */

"use client"

import * as React from "react"

import { cn } from "../../lib/utils"

/**
 * Root card container with neumorphic shadow
 * Provides the main wrapper with rounded corners and background
 */
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg bg-card text-card-foreground shadow-neu dark:shadow-neu-dark",
      className
    )}
    {...props}
  />
))
Card.displayName = "Card"

/**
 * Top section of the card
 * Contains title and optional description with consistent spacing
 */
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
))
CardHeader.displayName = "CardHeader"

/**
 * Main heading of the card
 * Uses semibold text with tight line height
 */
const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("font-semibold leading-none tracking-tight", className)}
    {...props}
  />
))
CardTitle.displayName = "CardTitle"

/**
 * Secondary text below the title
 * Uses muted color and smaller font size
 */
const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
))
CardDescription.displayName = "CardDescription"

/**
 * Main content area of the card
 * Removes top padding when used with CardHeader
 */
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

/**
 * Bottom section of the card
 * Typically used for actions or additional information
 */
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
