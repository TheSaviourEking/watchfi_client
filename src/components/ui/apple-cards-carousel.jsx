import React, {
  useEffect,
  useRef,
  useState,
  createContext,
  useContext,
} from "react";
import {
  ArrowLeft,
  ArrowRight,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { useOutsideClick } from "@/hooks/use-outside-click";
import { HeartIcon } from "lucide-react";
import useCartStore from "../../store/cart.store";
import { Link } from "react-router";

export const CarouselContext = createContext({
  // onCardClose: () => { },
  currentIndex: 0,
});

export const Carousel = ({
  items = [],
  initialScroll = 0,
  className = "",
}) => {
  const carouselRef = React.useRef(null);
  const [canScrollLeft, setCanScrollLeft] = React.useState(false);
  const [canScrollRight, setCanScrollRight] = React.useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (carouselRef.current) {
      carouselRef.current.scrollLeft = initialScroll;
      checkScrollability();
    }
  }, [initialScroll]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      if (carouselRef.current) {
        checkScrollability();
      }
    });
    return () => cancelAnimationFrame(handle);
  }, [items]);


  const checkScrollability = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const handleCardClose = (index) => {
    if (carouselRef.current) {
      const cardWidth = isMobile() ? 230 : 384; // (md:w-96)
      const gap = isMobile() ? 4 : 8;
      const scrollPosition = (cardWidth + gap) * (index + 1);
      carouselRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
      setCurrentIndex(index);
    }
  };

  const isMobile = () => {
    return window && window.innerWidth < 768;
  };

  return (
    <CarouselContext.Provider value={{ onCardClose: handleCardClose, currentIndex }}>
      <div className="relative w-full">
        <div
          className={cn("flex w-full overflow-x-scroll overscroll-x-auto scroll-smooth py-10 [scrollbar-width:none] md:py-20", className)}
          ref={carouselRef}
          onScroll={checkScrollability}>
          <div
            className={cn("absolute right-0 z-[1000] h-auto w-[5%] overflow-hidden bg-gradient-to-l")}></div>

          <div
            className={cn(
              "flex flex-row justify-start gap-4 pl-4",
              // remove max-w-4xl if you want the carousel to span the full width of its container
              "mx-auto max-w4xl"
            )}>
            {items.map((item, index) => (
              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: {
                    duration: 0.5,
                    delay: 0.2 * index,
                    ease: "easeOut",
                    once: true,
                  },
                }}
                key={"card" + index}
                className="rounded-3xl last:pr-[5%] md:last:pr[33%]">
                {item}
              </motion.div>
            ))}
          </div>
        </div>
        <div className="mr-10 flex justify-end gap-2">
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollLeft}
            disabled={!canScrollLeft}>
            <ArrowLeft className="h-6 w-6 text-gray-500" />
          </button>
          <button
            className="relative z-40 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 disabled:opacity-50"
            onClick={scrollRight}
            disabled={!canScrollRight}>
            <ArrowRight className="h-6 w-6 text-gray-500" />
          </button>
        </div>
      </div>
    </CarouselContext.Provider>
  );
};

export const Card = ({
  card,
  index,
  layout = false
}) => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const { onCardClose, currentIndex } = useContext(CarouselContext);
  const addToCart = useCartStore((state) => state.addToCart);
  const { cart, getTotalItems, getTotalPrice, removeFromCart, showCart, itemInCart } = useCartStore();
  const isInCart = itemInCart(card);

  // console.log(card, 'DATA IN CARD')

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        handleClose();
      }
    }

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  useOutsideClick(containerRef, () => handleClose());

  const handleOpen = () => {
    // setOpen(true);
    isInCart ? removeFromCart(card) : addToCart(card)
  };

  const handleClose = () => {
    setOpen(false);
    // onCardClose(index);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <div className="fixed inset-0 z-50 h-screen overflow-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 h-full w-full bg-black/80 backdrop-blur-lg" />
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              ref={containerRef}
              layoutId={layout ? `card-${card.title}` : undefined}
              className="relative z-[60] mx-auto my-10 h-fit max-w-5xl rounded-3xl bg-white p-4 font-sans md:p-10 dark:bg-neutral-900">
              <button
                className="sticky top-4 right-0 ml-auto flex h-8 w-8 items-center justify-center rounded-full bg-black dark:bg-white"
                onClick={handleClose}>
                <X className="h-6 w-6 text-neutral-100 dark:text-neutral-900" />
              </button>
              <motion.p
                layoutId={layout ? `category-${card.title}` : undefined}
                className="text-base font-medium text-black dark:text-white">
                {card.category}
              </motion.p>
              <motion.p
                layoutId={layout ? `title-${card.title}` : undefined}
                className="mt-4 text-2xl font-semibold text-neutral-700 md:text-5xl dark:text-white">
                {card.title}
              </motion.p>
              <div className="py-10">{card.content}</div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* <motion.button
        layoutId={layout ? `card-${card.name}` : undefined}
        onClick={handleOpen}
        className="relative z-10 flex h-80 w-56 flex-col items-start justify-start overflow-hidden rounded-3xl bg-gray-100 md:h-[40rem] md:w-96 dark:bg-neutral-900">
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 p-8">
          <motion.p
            layoutId={layout ? `category-${card.description}` : undefined}
            className="text-left font-sans text-sm font-medium text-white md:text-base">
            {card.detail}
          </motion.p>
          <motion.p
            layoutId={layout ? `title-${card.name}` : undefined}
            className="mt-2 max-w-xs text-left font-sans text-xl font-semibold [text-wrap:balance] text-white md:text-3xl">
            {card.name}
          </motion.p>
        </div>
        <BlurImage
          src={card.primaryPhotoUrl}
          alt={card.name}
          // fill
          className="absolute inset-0 z-10 object-cover" />
      </motion.button> */}

      {/* <motion.button */}
      <motion.div
        layoutId={layout ? `card-${card.name}` : undefined}
        // className="relative z-10 flex h-80 w-56 flex-col items-start justify-end overflow-hidden md:h-[40rem] md:w-96 bg-neutral900">
        className="relative z-10 flex h-60 w-56 flex-col items-start justify-end overflow-hidden md:h-[30rem] md:w-96 bg-neutral900 group">
        <div className="relative h-full w-full bg-near-black">
          {/* <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" /> */}
          <div className="absolute z-50 inset-0 w-full h-full">
            {/* <button
              onClick={() => }
              className="top-4 bg-black/30 right-4 absolute w-8 h-8 flex items-center justify-center rounded-full group-second hover:bg-black/10">
              <HeartIcon className="group-second-hover:bg-pink-700 group-hover:fill-current" />
            </button> */}

            <div className="flex items-center justify-center">
              <button
                onClick={handleOpen}
                className={cn("bottom-0 w-full absolute h-8 bg-neutral-800 rounded-t-md group-hover:block hidden transition duration-300 w3/4", {
                  'bg-pink-900': isInCart,
                  'block': isInCart
                })}>
                {isInCart ? "Already In Cart" : 'Add to Cart'}
              </button>
            </div>
          </div>

          <BlurImage
            src={card.primaryPhotoUrl}
            alt={card.name}
            fill
            className="absolute inset-0 z0 object-cover" />
        </div>
        <div className="pointer-events-none absolute inset-x-0 top-0 z-30 h-full bg-gradient-to-b from-black/50 via-transparent to-transparent" />
        <div className="relative z-40 py-4 bg-black/10 w-full">
          <Link to={`/collections/${card.id}`}>
            <motion.p
              layoutId={layout ? `title-${card.name}` : undefined}
              className="mt-2 max-wxs text-left text-subHeading1 [text-wrap:balance] text-white md:text3xl truncate min-h-5"
            >
              {card.name}
            </motion.p>

            <motion.p
              layoutId={layout ? `category-${card.description}` : undefined}
              className="text-left mt-3  text-sm font-medium text-white md:text-base">
              Ref:{" "}{card.referenceCode}
            </motion.p>

            <motion.p
              layoutId={layout ? `category-${card.description}` : undefined}
              className="text-left flex justify-between  px-2 text-sm font-medium w-full text-white md:text-base">
              <span>${card.price}</span>
              <span>{'ee'}</span>
            </motion.p>
          </Link>
        </div>
      </motion.div>
      {/* </motion.button> */}
    </>
  );
};

export const BlurImage = ({
  height,
  width,
  src,
  className,
  alt,
  ...rest
}) => {
  const [isLoading, setLoading] = useState(true);
  return (
    <img
      className={cn(
        "h-full w-full transition duration-300",
        isLoading ? "blur-sm" : "blur-0",
        className
      )}
      onLoad={() => setLoading(false)}
      src={src}
      width={width}
      height={height}
      loading="lazy"
      decoding="async"
      // blurDataURL={typeof src === "string" ? src : undefined}
      blurdataurl={typeof src === "string" ? src : undefined}
      alt={alt ? alt : "Background of a beautiful view"}
      {...rest} />
  );
};
