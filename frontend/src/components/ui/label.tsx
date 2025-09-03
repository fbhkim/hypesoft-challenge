
import * as React from 'react';
import * as LabelPrimitive from '@radix-ui/react-label';

const Label = React.forwardRef<
  HTMLLabelElement,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={`text-sm font-medium mb-1 ${className || ''}`}
    {...props}
  />
));
Label.displayName = 'Label';

export { Label };