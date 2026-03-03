import { ReactNode } from "react";
import { motion } from "framer-motion";

interface Props {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
  delay?: number;
}

const WidgetCard = ({ title, subtitle, children, className = "", delay = 0 }: Props) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay }}
    className={`rounded-xl border border-border bg-card p-5 card-elevated card-hover ${className}`}
  >
    {(title || subtitle) && (
      <div className="mb-4">
        {title && <h3 className="text-sm font-heading font-semibold">{title}</h3>}
        {subtitle && <p className="text-xs text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
    )}
    {children}
  </motion.div>
);

export default WidgetCard;
