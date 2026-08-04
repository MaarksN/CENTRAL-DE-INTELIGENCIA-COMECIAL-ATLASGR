# ADR 003: Design System Adoption

## Context
UI components are currently built ad-hoc, leading to inconsistencies in user experience and duplicated effort.

## Problem
Lack of a unified design system slows down frontend development and results in inconsistent styling.

## Alternatives
- Continue building custom components from scratch.
- Adopt a full component library like MUI.
- Build a custom design system on top of headless components (e.g., shadcn/ui + Tailwind CSS).

## Choice
Build a design system using **shadcn/ui and Tailwind CSS v4**.

## Consequences
- Requires upfront investment to define tokens and customize components.
- Ensures consistency across the application.
- High customizability without the bloat of traditional component libraries.
