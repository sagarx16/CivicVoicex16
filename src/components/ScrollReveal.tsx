"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
  margin?: string;
  duration?: number;
}

export function ScrollReveal({
  children,
  delay = 0,
  direction = "up",
  className = "",
  margin = "-100px",
  duration = 0.6,
}: ScrollRevealProps) {
  const shouldReduceMotion = useReducedMotion();

  const getInitialOffset = () => {
    if (shouldReduceMotion) return { x: 0, y: 0 };
    switch (direction) {
      case "up":
        return { x: 0, y: 40 };
      case "down":
        return { x: 0, y: -40 };
      case "left":
        return { x: 40, y: 0 };
      case "right":
        return { x: -40, y: 0 };
      case "none":
      default:
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getInitialOffset();

  return (
    <motion.div
      className={className}
      initial={{
        opacity: 0,
        x: initialOffset.x,
        y: initialOffset.y,
      }}
      whileInView={{
        opacity: 1,
        x: 0,
        y: 0,
      }}
      viewport={{ once: true, margin: margin as `${number}px` }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : duration,
        delay,
        ease: "easeOut",
      }}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

// ── Reusable Stagger Container for Grids (0.1 - 0.15s stagger delay) ──

export interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerDelay?: number;
  margin?: string;
}

export function StaggerContainer({
  children,
  className = "",
  staggerDelay = 0.12,
  margin = "-100px",
}: StaggerContainerProps) {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : staggerDelay,
        delayChildren: 0.1,
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: margin as `${number}px` }}
    >
      {children}
    </motion.div>
  );
}

// ── Individual Stagger Item for Child Cards / Numbers ──

export interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  yOffset?: number;
}

export function StaggerItem({
  children,
  className = "",
  yOffset = 30,
}: StaggerItemProps) {
  const shouldReduceMotion = useReducedMotion();

  const itemVariants: Variants = {
    hidden: {
      opacity: 0,
      y: shouldReduceMotion ? 0 : yOffset,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className={className}
      variants={itemVariants}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

export default ScrollReveal;
