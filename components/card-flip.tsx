'use client';

import { useState } from 'react';
import { Zen_Dots } from 'next/font/google';
const zenDots = Zen_Dots({ subsets: ['latin'], weight: '400', display: 'swap' });

export type CardFlipProps = {
  title?: string;
  subtitle?: string;
  description?: string;
  features?: string[];
  className?: string;
  price?: string;
  slug?: string; // slug used for checkout redirection (matches product href tail)
  // Desired visual gap between the price text and the separator line below (in px)
  priceSeparatorGapPx?: number;
  isHome?: boolean;
};

export default function CardFlip({ 
  title = 'Design Systems',
  subtitle = 'Explore the fundamentals', 
  description = 'Dive deep into the world of modern UI/UX design.',
  features = ['1 Landing page + 3 pages', 'Portfolio', 'Services', 'Contact information'],
  className = '',
  price,
  slug,
  priceSeparatorGapPx,
  isHome = false
}: CardFlipProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  // The separator line is positioned using before:top-[-7px].
  // To achieve a visual gap of X px from the price to the line,
  // set the container's margin-top to (X + 7) px.
  const separatorMarginTopPx =
    typeof priceSeparatorGapPx === 'number' ? priceSeparatorGapPx + 7 : undefined;

  return (
    <div
      className={`relative w-full max-w-[336px] h-[384px] group [perspective:2000px] ${className}`}
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setIsFlipped(!isFlipped);
        }
      }}
      aria-pressed={isFlipped}
      aria-label={`Flip ${title} card`}
    >
      <div
        className="relative w-full h-full transition-transform duration-[560ms] [transform-style:preserve-3d]"
        style={{ 
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transformStyle: 'preserve-3d'
        }}
      >
        {/* Front Card */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden rounded-2xl bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800/50 shadow-xs dark:shadow-lg transition-all duration-[560ms] group-hover:shadow-lg dark:group-hover:shadow-xl"
          style={{ 
            backfaceVisibility: 'hidden',
            opacity: isFlipped ? 0 : 1
          }}
        >
          <div className="relative h-full overflow-hidden bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black">
            <div className="absolute inset-0 flex items-start justify-center pt-24">
              <div className="relative w-[240px] h-[120px] flex items-center justify-center">
                {[...Array(10)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-[50px] h-[50px] rounded-[140px] opacity-0 shadow-[0_0_50px_rgba(34,211,238,0.5)] animate-[scale_3s_linear_infinite] group-hover:animate-[scale_2s_linear_infinite]"
                    style={{ animationDelay: `${i * 0.3}s` }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-1.5">
                <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug tracking-tighter transition-all duration-500 ease-out group-hover:translate-y-[-4px]">
                  {title}
                </h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-200 line-clamp-2 tracking-tight transition-all duration-500 ease-out group-hover:translate-y-[-4px] delay-[50ms]">
                  {subtitle}
                </p>
              </div>
              <div className="relative group/icon">
                <div className="absolute inset-[-8px] rounded-lg transition-opacity duration-300 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent" />
                <div className="relative z-10 w-4 h-4 text-accent transition-transform duration-300 group-hover/icon:scale-110 group-hover/icon:-rotate-12">
                  ↻
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Back Card */}
        <div
          className="absolute inset-0 w-full h-full p-6 rounded-2xl bg-gradient-to-b from-zinc-100 to-white dark:from-zinc-900 dark:to-black border border-zinc-200 dark:border-zinc-800 shadow-xs dark:shadow-lg flex flex-col transition-all duration-[560ms] group-hover:shadow-lg dark:group-hover:shadow-xl"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            opacity: isFlipped ? 1 : 0
          }}
        >
          <div className="flex-1 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-snug tracking-tight transition-all duration-500 ease-out group-hover:translate-y-[-2px]">
                {title}
              </h3>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 tracking-tight transition-all duration-500 ease-out group-hover:translate-y-[-2px] line-clamp-2">
                {description}
              </p>
            </div>

            {!isHome && (
              <div className="space-y-2">
                {features.map((feature, index) => (
                  <div
                    key={feature}
                    className="flex items-start gap-2 text-sm text-zinc-700 dark:text-zinc-300 transition-all duration-[400ms]"
                    style={{
                      transform: isFlipped ? 'translateX(0)' : 'translateX(-10px)',
                      opacity: isFlipped ? 1 : 0,
                      transitionDelay: `${index * 100 + 200}ms`,
                    }}
                  >
                    <div className="w-3 h-3 text-accent">→</div>
                    <span className="whitespace-pre-line">{feature}</span>
                  </div>
                ))}
              </div>
            )}

            {price && (
              <div
                className="mt-0"
                style={{
                  transform: isFlipped ? 'translateY(0)' : 'translateY(6px)',
                  opacity: isFlipped ? 1 : 0,
                  transition: 'opacity 240ms ease, transform 240ms ease',
                }}
              >
                {isHome ? (
                  <div className={`w-full flex flex-col items-center justify-center text-center select-none gap-[10px] ${zenDots.className}`}>
                    <div className="relative">
                      <span className="block text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent to-cyan-400 drop-shadow-[0_0_12px_rgba(34,211,238,0.55)] animate-pulse">A PARTIR</span>
                    </div>
                    <div className="relative">
                      <span className="block text-2xl font-bold tracking-tight text-accent/90 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">DE</span>
                    </div>
                    <div className="relative">
                      <span className="block text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-accent via-sky-400 to-cyan-300 [text-shadow:0_0_20px_rgba(34,211,238,0.6)]">{price.replace(/^Starting\s+at\s+/i, '')}</span>
                      <span className="pointer-events-none absolute -inset-2 rounded-lg blur-2xl bg-accent/20 opacity-70" />
                    </div>
                  </div>
                ) : (
                  <div className="text-accent font-semibold text-2xl leading-none">{price}</div>
                )}
              </div>
            )}

            </div>

          <div
            className={`relative before:content-[''] before:absolute before:inset-x-0 before:top-[-7px] before:h-px before:bg-zinc-200 dark:before:bg-zinc-800 ${isHome ? 'pt-2' : ''}`}
            style={{ marginTop: separatorMarginTopPx !== undefined ? separatorMarginTopPx : 12 }}
          >
            {slug ? (
              <a
                href={`/checkout?slug=${encodeURIComponent(slug.split('#').pop() || slug)}&quantity=1`}
                onClick={(e) => e.stopPropagation()}
                className="group/start w-[calc(100%-10px)] mx-auto relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-zinc-100 via-zinc-100 to-zinc-100 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800 hover:from-accent/10 hover:from-0% hover:via-accent/5 hover:via-100% hover:to-transparent hover:to-100% dark:hover:from-accent/20 dark:hover:from-0% dark:hover:via-accent/10 dark:hover:via-100% dark:hover:to-transparent dark:hover:to-100% hover:scale-[1.02] cursor-pointer"
              >
                <span className="text-sm font-medium text-zinc-900 dark:text-white transition-colors duration-300 group-hover/start:text-accent dark:group-hover/start:text-accent">
                  Comece Hoje
                </span>
                <div className="relative group/icon">
                  <div className="absolute inset-[-6px] rounded-lg transition-all duration-300 bg-gradient-to-br from-accent/20 via-accent/10 to-transparent opacity-0 group-hover/start:opacity-100 scale-90 group-hover/start:scale-100" />
                  <div className="relative z-10 w-4 h-4 text-accent transition-all duration-300 group-hover/start:translate-x-0.5 group-hover/start:scale-110">→</div>
                </div>
              </a>
            ) : (
              <div className="group/start w-[calc(100%-10px)] mx-auto relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 bg-gradient-to-r from-zinc-100 via-zinc-100 to-zinc-100 dark:from-zinc-800 dark:via-zinc-800 dark:to-zinc-800 opacity-70">
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  Comece Hoje
                </span>
                <div className="relative group/icon">
                  <div className="relative z-10 w-4 h-4 text-accent">→</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}