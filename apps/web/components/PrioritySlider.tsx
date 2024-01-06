import React from "react";
import { Slider } from "./ui/slider";
import { cn } from "@/lib/utils";

const PrioritySlider = (props: {
  defaultValue?: number;
  onChange?: (value: number) => void;
  className?: string;
}) => {
  return (
    <Slider
      className={cn(props.className)}
      defaultValue={props.defaultValue ? [props.defaultValue] : undefined}
      max={3}
      min={1}
      step={1}
      onValueChange={(value) => props.onChange && props.onChange(value[0])}
    />
  );
};

PrioritySlider.propTypes = {};

export default PrioritySlider;
