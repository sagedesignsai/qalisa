/**
 * Button Component
 * An editable button component
 */

'use client';

import { Button as UIButton } from '@/components/ui/button';
import React from 'react';

export interface ButtonProps {
  text?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export const Button = ({ text = 'Button', variant = 'default', size = 'default' }: ButtonProps) => {
  return (
    <div>
      <UIButton variant={variant} size={size}>
        {text}
      </UIButton>
    </div>
  );
};

