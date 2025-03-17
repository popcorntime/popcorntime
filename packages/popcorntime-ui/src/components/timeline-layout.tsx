"use client";

import { ReactNode } from "react";
import { Timeline, TimelineItem } from "@popcorntime/ui/components/timeline";
import { motion } from "framer-motion";

export type TimelineSize = "sm" | "md" | "lg";
export type TimelineStatus = "completed" | "in-progress" | "pending";
export type TimelineColor =
  | "primary"
  | "secondary"
  | "muted"
  | "accent"
  | "destructive";

interface TimelineElement {
  id: number;
  date: string;
  title: string;
  description: string;
  icon?: ReactNode | (() => ReactNode);
  status?: TimelineStatus;
  color?: TimelineColor;
  size?: TimelineSize;
  loading?: boolean;
  error?: string;
}

interface TimelineLayoutProps {
  items: TimelineElement[];
  size?: "sm" | "md" | "lg";
  iconColor?: "primary" | "secondary" | "muted" | "accent";
  customIcon?: React.ReactNode;
  animate?: boolean;
  connectorColor?: "primary" | "secondary" | "muted" | "accent";
  className?: string;
}

export const TimelineLayout = ({
  items,
  size = "md",
  iconColor,
  customIcon,
  animate = true,
  connectorColor,
  className,
}: TimelineLayoutProps) => {
  return (
    <Timeline size={size} className={className}>
      {[...items].reverse().map((item, index) => (
        <motion.div
          key={index}
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={animate ? { opacity: 1, y: 0 } : false}
          transition={{
            duration: 0.5,
            delay: index * 0.1,
            ease: "easeOut",
          }}
        >
          <TimelineItem
            date={item.date}
            title={item.title}
            description={item.description}
            icon={
              typeof item.icon === "function"
                ? item.icon()
                : item.icon || customIcon
            }
            iconColor={item.color || iconColor}
            connectorColor={item.color || connectorColor}
            showConnector={index !== items.length - 1}
          />
        </motion.div>
      ))}
    </Timeline>
  );
};
