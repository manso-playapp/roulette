import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

interface MinimalSliderProps {
  value: number;
  min: number;
  max: number;
  step: number;
  onValueChange: (value: number) => void;
  className?: string;
  [key: string]: any;
}

export function MinimalSlider({ value, min, max, step, onValueChange, className = "", ...props }: MinimalSliderProps) {
  return (
    <SliderPrimitive.Root
      className={
        "relative flex w-full touch-none select-none items-center h-5 " + className
      }
      min={min}
      max={max}
      step={step}
      value={[value]}
      onValueChange={([v]) => onValueChange(v)}
      {...props}
    >
      <SliderPrimitive.Track className="bg-white/20 relative grow rounded-full h-1">
        <SliderPrimitive.Range className="absolute bg-purple-500 rounded-full h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb className="block w-4 h-4 bg-white border-2 border-purple-500 rounded-full shadow transition-colors focus:outline-none focus:ring-2 focus:ring-purple-400" />
    </SliderPrimitive.Root>
  );
}
