import { AnimatedTitle } from "@/components/ui/Effects/AnimatedTitle";

// Update the component's props to accept 'className'
export const MenuTitle = ({ text, className }: { text: string, className?: string }) => (
  <AnimatedTitle
    text={text}
    // Use the passed 'className' along with your default classes.
    // We put the passed 'className' first so it can be overridden if needed,
    // but in this case, we want it to apply to the surrounding element,
    // while the default classes handle the responsive margin.
    className={`${className} mb-4 sm:mb-6 md:mb-8 lg:-mb-2 xl:-mb-10`}
    textClassName="text-red-600 text-4xl sm:text-6xl md:text-8xl lg:text-9xl xl:text-[180px]"
  />
);
