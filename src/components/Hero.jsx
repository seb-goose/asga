"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const AUTOPLAY_INTERVAL_MS = 6000;

const pageHref = (page) => page?.[0]?.url || "#";

export default function Hero({ slides = [] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const isCarousel = slides.length > 1;

  useEffect(() => {
    setActiveIndex(0);
  }, [slides]);

  const goToPrevious = () => {
    setActiveIndex((index) => (index - 1 + slides.length) % slides.length);
  };

  const goToNext = () => {
    setActiveIndex((index) => (index + 1) % slides.length);
  };

  useEffect(() => {
    if (!isCarousel || isPaused) return;

    const id = setInterval(goToNext, AUTOPLAY_INTERVAL_MS);
    return () => clearInterval(id);
  }, [isCarousel, isPaused, activeIndex]);

  return (
    <section
      className="relative isolate overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-[560px] w-full sm:h-[600px] lg:h-[640px]">
        {slides.map((slide, index) => {
          const isActive = index === activeIndex;
          const key = slide._metadata?.uid ?? index;
          const isRightAligned = !!slide.text_right;

          return (
            <div
              key={key}
              aria-hidden={!isActive}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              {slide.image?.url && (
                <Image
                  src={slide.image.url}
                  alt={slide.image.title || ""}
                  fill
                  priority={index === 0}
                  className="object-cover"
                />
              )}
              <div
                className={`absolute inset-0 ${
                  isRightAligned
                    ? "bg-linear-to-l from-black/95 via-black/55 to-black/10"
                    : "bg-linear-to-r from-black/95 via-black/55 to-black/10"
                }`}
              />

              <div
                className={`relative mx-auto flex h-full max-w-7xl items-center px-6 lg:px-10 ${
                  isRightAligned ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`max-w-xl ${isRightAligned ? "text-right" : "text-left"}`}>
                  <h1 className="font-heading text-4xl leading-tight text-white sm:text-5xl">
                    {slide.title}
                  </h1>
                  {slide.subtitle && (
                    <p className="font-heading mt-1 text-2xl text-heritage-gold italic sm:text-3xl">
                      {slide.subtitle}
                    </p>
                  )}

                  <div
                    className={`mt-6 h-px w-24 bg-heritage-gold ${isRightAligned ? "ml-auto" : ""}`}
                  />

                  {slide.details && (
                    <p className="font-body mt-6 text-base text-warm-cream sm:text-lg">
                      {slide.details}
                    </p>
                  )}

                  <div
                    className={`mt-8 flex flex-wrap gap-4 ${
                      isRightAligned ? "justify-end" : "justify-start"
                    }`}
                  >
                    {slide.button_1_text && (
                      <Link
                        href={pageHref(slide.button_1_page)}
                        tabIndex={isActive ? undefined : -1}
                        className="bg-heritage-navy px-6 py-3 text-sm font-bold tracking-wider text-warm-cream uppercase hover:bg-classic-navy"
                      >
                        {slide.button_1_text}
                      </Link>
                    )}
                    {slide.button_2_text && (
                      <Link
                        href={pageHref(slide.button_2_page)}
                        tabIndex={isActive ? undefined : -1}
                        className="bg-heritage-gold px-6 py-3 text-sm font-bold tracking-wider text-heritage-navy uppercase hover:opacity-90"
                      >
                        {slide.button_2_text}
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {isCarousel && (
          <>
            <button
              type="button"
              onClick={goToPrevious}
              aria-label="Previous slide"
              className="absolute top-1/2 left-4 -translate-y-1/2 text-white hover:text-heritage-gold lg:left-8"
            >
              <ChevronLeftIcon className="h-8 w-8" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              aria-label="Next slide"
              className="absolute top-1/2 right-4 -translate-y-1/2 text-white hover:text-heritage-gold lg:right-8"
            >
              <ChevronRightIcon className="h-8 w-8" />
            </button>

            <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-3">
              {slides.map((slide, index) => (
                <button
                  key={slide._metadata?.uid ?? index}
                  type="button"
                  onClick={() => setActiveIndex(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  aria-current={index === activeIndex}
                  className={`h-2.5 w-2.5 rounded-full ${
                    index === activeIndex ? "bg-heritage-gold" : "bg-white/50"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

function ChevronLeftIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.7 4.3a1 1 0 010 1.4L9.42 12l6.3 6.3a1 1 0 01-1.42 1.4l-7-7a1 1 0 010-1.4l7-7a1 1 0 011.42 0z" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M8.3 4.3a1 1 0 000 1.4l6.28 6.3-6.28 6.3a1 1 0 001.42 1.4l7-7a1 1 0 000-1.4l-7-7a1 1 0 00-1.42 0z" />
    </svg>
  );
}
