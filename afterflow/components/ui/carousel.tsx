"use client";

import useEmblaCarousel, { type UseEmblaCarouselType } from "embla-carousel-react";
import { createContext, useContext, useEffect, type ComponentProps } from "react";

// Vengeance UI / shadcn Carousel: keep the Embla context, options and slots.
// Afterflow supplies its own controls and typography; no second button/icon kit.
export type CarouselApi = UseEmblaCarouselType[1];
type CarouselContextValue = { carouselRef: UseEmblaCarouselType[0]; api: CarouselApi };
const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const context = useContext(CarouselContext);
  if (!context) throw new Error("Carousel components must be inside Carousel.");
  return context;
}

export function Carousel({ opts, setApi, children, ...props }: ComponentProps<"div"> & { opts?: Parameters<typeof useEmblaCarousel>[0]; setApi?: (api: CarouselApi) => void }) {
  const [carouselRef, api] = useEmblaCarousel(opts);
  useEffect(() => { if (api && setApi) setApi(api); }, [api, setApi]);
  return <CarouselContext.Provider value={{ carouselRef, api }}>
    <div role="region" aria-roledescription="carousel" data-slot="carousel" {...props}>{children}</div>
  </CarouselContext.Provider>;
}

export function CarouselContent({ viewportClassName, children, ...props }: ComponentProps<"div"> & { viewportClassName?: string }) {
  const { carouselRef } = useCarousel();
  return <div ref={carouselRef} className={viewportClassName} data-slot="carousel-content">
    <div {...props}>{children}</div>
  </div>;
}

export function CarouselItem(props: ComponentProps<"div">) {
  return <div role="group" aria-roledescription="slide" data-slot="carousel-item" {...props} />;
}
