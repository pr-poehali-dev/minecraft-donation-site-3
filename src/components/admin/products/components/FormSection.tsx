
import React from "react";
import { Label } from "@/components/ui/label";

interface FormSectionProps {
  title?: string;
  className?: string;
  children: React.ReactNode;
}

/**
 * Компонент секции формы с опциональным заголовком
 */
export const FormSection: React.FC<FormSectionProps> = ({ 
  title, 
  className = "", 
  children 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
      )}
      <div className="space-y-2">
        {children}
      </div>
    </div>
  );
};

/**
 * Компонент поля формы с лейблом и инпутом
 */
export const FormField: React.FC<{
  label: string;
  htmlFor: string;
  description?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ label, htmlFor, description, className = "", children }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
      {description && (
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      )}
    </div>
  );
};
