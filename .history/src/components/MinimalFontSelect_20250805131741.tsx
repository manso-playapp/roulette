import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";

const FONT_OPTIONS = [
  { label: "Roboto", value: "Roboto" },
  { label: "Bebas Neue", value: "Bebas Neue" },
  { label: "Montserrat", value: "Montserrat" },
  { label: "Oswald", value: "Oswald" },
  { label: "Lato", value: "Lato" },
  { label: "Arial", value: "Arial" },
  { label: "Sans Serif", value: "sans-serif" },
];

export function MinimalFontSelect({ value, onValueChange, className = "", ...props }) {
  return (
    <SelectPrimitive.Root value={value} onValueChange={onValueChange} {...props}>
      <SelectPrimitive.Trigger
        className={
          "inline-flex items-center justify-between w-full px-2 py-1 bg-white/10 border border-white/20 rounded text-white text-xs focus:outline-none " +
          className
        }
      >
        <SelectPrimitive.Value />
        <SelectPrimitive.Icon>
          <svg width="16" height="16" fill="none" viewBox="0 0 20 20"><path d="M5 8l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </SelectPrimitive.Icon>
      </SelectPrimitive.Trigger>
      <SelectPrimitive.Portal>
        <SelectPrimitive.Content className="z-50 min-w-[120px] bg-white/90 rounded shadow-lg border border-white/20 py-1">
          <SelectPrimitive.Viewport>
            {FONT_OPTIONS.map(opt => (
              <SelectPrimitive.Item
                key={opt.value}
                value={opt.value}
                className="px-3 py-1 text-xs text-gray-900 hover:bg-purple-100 cursor-pointer rounded"
              >
                <SelectPrimitive.ItemText>{opt.label}</SelectPrimitive.ItemText>
              </SelectPrimitive.Item>
            ))}
          </SelectPrimitive.Viewport>
        </SelectPrimitive.Content>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
