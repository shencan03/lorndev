"use client";

import * as React from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import { WheelGesturesPlugin } from "embla-carousel-wheel-gestures";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
  opts?: CarouselOptions;
  plugins?: CarouselPlugin;
  orientation?: "horizontal" | "vertical";
  setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
  carouselRef: ReturnType<typeof useEmblaCarousel>[0];
  api: ReturnType<typeof useEmblaCarousel>[1];
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
  const context = React.useContext(CarouselContext);

  if (!context) {
    throw new Error("useCarousel must be used within a <Carousel />");
  }

  return context;
}

function Carousel({
  orientation = "horizontal",
  opts,
  setApi,
  plugins,
  className,
  children,
  ...props
}: React.ComponentProps<"div"> & CarouselProps) {
  const [carouselRef, api] = useEmblaCarousel(
    {
      ...opts,
      axis: orientation === "horizontal" ? "x" : "y",
    },
    // Trackpad swipes and mouse wheels scroll the carousel (Embla only handles drag/touch).
    // Added here because the carousels are server components and can't pass plugins in.
    [WheelGesturesPlugin(), ...(plugins ?? [])],
  );
  const [canScrollPrev, setCanScrollPrev] = React.useState(false);
  const [canScrollNext, setCanScrollNext] = React.useState(false);

  const onSelect = React.useCallback((api: CarouselApi) => {
    if (!api) return;
    setCanScrollPrev(api.canScrollPrev());
    setCanScrollNext(api.canScrollNext());
  }, []);

  const scrollPrev = React.useCallback(() => {
    api?.scrollPrev();
  }, [api]);

  const scrollNext = React.useCallback(() => {
    api?.scrollNext();
  }, [api]);

  const handleKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        scrollPrev();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        scrollNext();
      }
    },
    [scrollPrev, scrollNext],
  );

  React.useEffect(() => {
    if (!api || !setApi) return;
    setApi(api);
  }, [api, setApi]);

  React.useEffect(() => {
    if (!api) return;
    onSelect(api);
    api.on("reInit", onSelect);
    api.on("select", onSelect);

    return () => {
      api?.off("select", onSelect);
    };
  }, [api, onSelect]);

  return (
    <CarouselContext.Provider
      value={{
        carouselRef,
        api: api,
        opts,
        orientation:
          orientation || (opts?.axis === "y" ? "vertical" : "horizontal"),
        scrollPrev,
        scrollNext,
        canScrollPrev,
        canScrollNext,
      }}
    >
      <div
        onKeyDownCapture={handleKeyDown}
        className={cn("relative", className)}
        role="region"
        aria-roledescription="carousel"
        data-slot="carousel"
        {...props}
      >
        {children}
        <CarouselScrollbar />
      </div>
    </CarouselContext.Provider>
  );
}

// Thin progress bar that only appears while the carousel is moving, so users can see
// how much is left without a permanent scrollbar. Updated via refs to avoid re-rendering
// every frame.
function CarouselScrollbar() {
  const { api, orientation } = useCarousel();
  const thumbRef = React.useRef<HTMLDivElement>(null);
  const [scrollable, setScrollable] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    if (!api) return;
    const horizontal = orientation === "horizontal";
    let hideTimer: ReturnType<typeof setTimeout> | undefined;
    let pointerDown = false;
    let thumbSize = 1;

    const measure = () => {
      const root = api.rootNode();
      const container = api.containerNode();
      const viewport = horizontal ? root.clientWidth : root.clientHeight;
      const content = horizontal
        ? container.scrollWidth
        : container.scrollHeight;
      thumbSize = content > 0 ? Math.min(1, viewport / content) : 1;
      setScrollable(api.canScrollNext() || api.canScrollPrev());
      update();
    };

    const update = () => {
      const thumb = thumbRef.current;
      if (!thumb) return;
      const progress = Math.max(0, Math.min(1, api.scrollProgress()));
      const offset = progress * (1 - thumbSize) * 100;
      thumb.style[horizontal ? "width" : "height"] = `${thumbSize * 100}%`;
      thumb.style.transform = horizontal
        ? `translateX(${offset / thumbSize}%)`
        : `translateY(${offset / thumbSize}%)`;
    };

    const scheduleHide = () => {
      clearTimeout(hideTimer);
      hideTimer = setTimeout(() => {
        if (!pointerDown) setVisible(false);
      }, 800);
    };

    const onScroll = () => {
      update();
      setVisible(true);
      scheduleHide();
    };
    const onPointerDown = () => {
      pointerDown = true;
      clearTimeout(hideTimer);
    };
    const onPointerUp = () => {
      pointerDown = false;
      scheduleHide();
    };

    measure();
    api.on("reInit", measure);
    api.on("resize", measure);
    api.on("scroll", onScroll);
    api.on("pointerDown", onPointerDown);
    api.on("pointerUp", onPointerUp);

    return () => {
      clearTimeout(hideTimer);
      api.off("reInit", measure);
      api.off("resize", measure);
      api.off("scroll", onScroll);
      api.off("pointerDown", onPointerDown);
      api.off("pointerUp", onPointerUp);
    };
  }, [api, orientation]);

  if (!scrollable) return null;

  return (
    <div
      aria-hidden
      data-slot="carousel-scrollbar"
      className={cn(
        "pointer-events-none absolute overflow-hidden rounded-full bg-foreground/10 transition-opacity duration-300",
        orientation === "horizontal"
          ? "inset-x-3 bottom-1.5 h-0.5"
          : "inset-y-3 right-1.5 w-0.5",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      <div
        ref={thumbRef}
        className={cn(
          "rounded-full bg-foreground/50",
          orientation === "horizontal" ? "h-full" : "w-full",
        )}
      />
    </div>
  );
}

// Edge fade length in px. Each edge fades only when there's more content past it, and the
// fade shrinks as you approach the end so it doesn't pop in or out.
const EDGE_FADE = 48;

function CarouselContent({ className, ...props }: React.ComponentProps<"div">) {
  const { carouselRef, api, orientation } = useCarousel();

  React.useEffect(() => {
    if (!api) return;
    const horizontal = orientation === "horizontal";

    const update = () => {
      const root = api.rootNode();
      const container = api.containerNode();
      const viewport = horizontal ? root.clientWidth : root.clientHeight;
      const content = horizontal
        ? container.scrollWidth
        : container.scrollHeight;
      const overflow = Math.max(0, content - viewport);
      const progress = Math.max(0, Math.min(1, api.scrollProgress()));
      const start = Math.min(EDGE_FADE, progress * overflow);
      const end = Math.min(EDGE_FADE, (1 - progress) * overflow);
      const mask =
        overflow > 0
          ? `linear-gradient(to ${horizontal ? "right" : "bottom"}, transparent, black ${start}px, black calc(100% - ${end}px), transparent)`
          : "";
      root.style.maskImage = mask;
      root.style.webkitMaskImage = mask;
    };

    update();
    api.on("reInit", update);
    api.on("resize", update);
    api.on("scroll", update);
    return () => {
      api.off("reInit", update);
      api.off("resize", update);
      api.off("scroll", update);
    };
  }, [api, orientation]);

  return (
    <div
      ref={carouselRef}
      className="overflow-hidden"
      data-slot="carousel-content"
    >
      <div
        className={cn(
          "flex",
          orientation === "horizontal" ? "-ml-4" : "-mt-4 flex-col",
          className,
        )}
        {...props}
      />
    </div>
  );
}

function CarouselItem({ className, ...props }: React.ComponentProps<"div">) {
  const { orientation } = useCarousel();

  return (
    <div
      role="group"
      aria-roledescription="slide"
      data-slot="carousel-item"
      className={cn(
        "min-w-0 shrink-0 grow-0 basis-full",
        orientation === "horizontal" ? "pl-4" : "pt-4",
        className,
      )}
      {...props}
    />
  );
}

function CarouselPrevious({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollPrev, canScrollPrev } = useCarousel();

  return (
    <Button
      data-slot="carousel-previous"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal"
          ? "inset-y-0 -left-12 my-auto"
          : "-top-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollPrev}
      onClick={scrollPrev}
      {...props}
    >
      <CaretLeftIcon />
      <span className="sr-only">Previous slide</span>
    </Button>
  );
}

function CarouselNext({
  className,
  variant = "outline",
  size = "icon-sm",
  ...props
}: React.ComponentProps<typeof Button>) {
  const { orientation, scrollNext, canScrollNext } = useCarousel();

  return (
    <Button
      data-slot="carousel-next"
      variant={variant}
      size={size}
      className={cn(
        "absolute touch-manipulation",
        orientation === "horizontal"
          ? "inset-y-0 -right-12 my-auto"
          : "-bottom-12 left-1/2 -translate-x-1/2 rotate-90",
        className,
      )}
      disabled={!canScrollNext}
      onClick={scrollNext}
      {...props}
    >
      <CaretRightIcon />
      <span className="sr-only">Next slide</span>
    </Button>
  );
}

export {
  type CarouselApi,
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
  useCarousel,
};
