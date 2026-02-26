import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface GlassSliderProps {
    children: React.ReactNode;
}

const slideVariants = {
    enter: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
        scale: 0.94,
        filter: 'blur(12px)',
    }),
    center: {
        x: 0,
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
    },
    exit: (direction: number) => ({
        x: direction > 0 ? '-60%' : '60%',
        opacity: 0,
        scale: 0.9,
        filter: 'blur(8px)',
    }),
};

export const GlassSlider: React.FC<GlassSliderProps> = ({ children }) => {
    const slides = React.Children.toArray(children);
    const total = slides.length;
    const [current, setCurrent] = useState(0);
    const [direction, setDirection] = useState(1);
    const [isAnimating, setIsAnimating] = useState(false);

    // Touch/swipe support
    const touchStartX = useRef<number>(0);
    const touchEndX = useRef<number>(0);

    const goTo = useCallback((idx: number, dir?: number) => {
        if (isAnimating || idx === current) return;
        setDirection(dir ?? (idx > current ? 1 : -1));
        setCurrent(idx);
    }, [isAnimating, current]);

    const next = useCallback(() => {
        if (current < total - 1) goTo(current + 1, 1);
    }, [current, total, goTo]);

    const prev = useCallback(() => {
        if (current > 0) goTo(current - 1, -1);
    }, [current, goTo]);

    // Keyboard navigation
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'ArrowRight') next();
            if (e.key === 'ArrowLeft') prev();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [next, prev]);

    // Swipe handlers
    const onTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.targetTouches[0].clientX;
    };
    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };
    const onTouchEnd = () => {
        const delta = touchStartX.current - touchEndX.current;
        if (Math.abs(delta) > 60) delta > 0 ? next() : prev();
    };

    return (
        <div className="relative min-h-screen bg-[#06141B] overflow-hidden selection:bg-white/10">

            {/* ── Fixed Background ── */}
            <div className="fixed inset-0 z-0 overflow-hidden bg-[#06141B]">
                <div className="absolute inset-0 opacity-40" style={{
                    background: `
                        radial-gradient(circle at 0% 0%, #11212D 0%, transparent 50%),
                        radial-gradient(circle at 100% 0%, #253745 0%, transparent 50%),
                        radial-gradient(circle at 100% 100%, #4A5C6A 0%, transparent 50%),
                        radial-gradient(circle at 0% 100%, #11212D 0%, transparent 50%),
                        radial-gradient(circle at 50% 50%, #06141B 0%, transparent 100%)`
                }} />

                <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1], x: [0, 100, 0], y: [0, -50, 0] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full blur-[120px] bg-[#9BA8AB]/20 pointer-events-none"
                />
                <motion.div
                    animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05], x: [0, -80, 0], y: [0, 40, 0] }}
                    transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
                    className="absolute -bottom-[10%] -right-[5%] w-[50%] h-[50%] rounded-full blur-[100px] bg-[#CCD0CF]/10 pointer-events-none"
                />

                {/* Dynamic colour accent that shifts per slide */}
                <motion.div
                    key={current}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.06 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: `radial-gradient(ellipse at ${(current / (total - 1)) * 100}% 50%, #54ACBF 0%, transparent 60%)`
                    }}
                />
            </div>

            {/* ── Top Navigation Bar ── */}
            <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] w-[95%] max-w-7xl">
                <div className="cinema-glass py-4 px-10 flex items-center justify-between backdrop-blur-3xl bg-white/5 border-white/10 rounded-full shadow-2xl">
                    <div className="flex items-center gap-12">
                        <div className="flex items-center gap-3">
                            <img src="/logo-gold.png" alt="Ron's Futurebridge" className="h-10 w-auto object-contain" />
                            <div className="text-lg font-black text-[#CCD0CF] tracking-tighter uppercase">Ron's®</div>
                        </div>
                        <div className="hidden md:flex gap-8 border-l border-black/5 pl-8">
                            {['Consultancy', 'Scholarships', 'About'].map((item) => (
                                <span key={item} className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9BA8AB]/40 hover:text-[#CCD0CF] cursor-pointer transition-colors">
                                    {item}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Slide counter in nav */}
                    <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-baseline gap-1">
                            <span className="text-2xl font-black text-[#CCD0CF] tracking-tighter leading-none">
                                {String(current + 1).padStart(2, '0')}
                            </span>
                            <span className="text-[10px] font-bold text-[#9BA8AB]/30 tracking-widest">
                                /{String(total).padStart(2, '0')}
                            </span>
                        </div>
                        <div className="w-px h-6 bg-white/10 mx-2" />
                        <div className="round-icon w-8 h-8 scale-90 border-white/5 bg-[#CCD0CF] text-[#06141B]">
                            <div className="w-1.5 h-1.5 bg-[#06141B] rounded-full" />
                        </div>
                    </div>
                </div>
            </div>

            {/* ── Slide Stage ── */}
            <div
                className="absolute inset-0 z-10"
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div className="w-full h-full flex items-stretch justify-center px-4 pt-[100px] pb-[120px]">
                    <AnimatePresence
                        initial={false}
                        custom={direction}
                        mode="popLayout"
                        onExitComplete={() => setIsAnimating(false)}
                    >
                        <motion.div
                            key={current}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: 'spring', stiffness: 220, damping: 28 },
                                opacity: { duration: 0.45 },
                                scale: { duration: 0.55 },
                                filter: { duration: 0.4 },
                            }}
                            onAnimationStart={() => setIsAnimating(true)}
                            className="cinema-glass w-full max-w-7xl flex flex-col bg-white/[0.02] overflow-y-auto scrollbar-hide absolute inset-x-4 inset-y-[100px] bottom-[120px]"
                            style={{ position: 'absolute' }}
                        >
                            {slides[current]}
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* ── Left / Right Arrow Nav ── */}
            {current > 0 && (
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    onClick={prev}
                    className="fixed left-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-[#CCD0CF] hover:bg-white/10 hover:scale-110 transition-all shadow-xl"
                >
                    <ChevronLeft className="w-5 h-5" />
                </motion.button>
            )}
            {current < total - 1 && (
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={next}
                    className="fixed right-6 top-1/2 -translate-y-1/2 z-50 w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-xl flex items-center justify-center text-[#CCD0CF] hover:bg-white/10 hover:scale-110 transition-all shadow-xl"
                >
                    <ChevronRight className="w-5 h-5" />
                </motion.button>
            )}

            {/* ── Dot Indicator ── */}
            <div className="fixed left-1/2 -translate-x-1/2 z-50 flex items-center gap-2"
                style={{ bottom: 'calc(4.5rem + 88px)' }}>
                {slides.map((_, i) => (
                    <button
                        key={i}
                        onClick={() => goTo(i)}
                        className="transition-all duration-500 rounded-full"
                        style={{
                            width: i === current ? '28px' : '6px',
                            height: '6px',
                            backgroundColor: i === current ? '#CCD0CF' : 'rgba(204,208,207,0.2)',
                        }}
                    />
                ))}
            </div>

            {/* ── Bottom IELTS Promo Bar ── */}
            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
                <div className="cinema-glass p-0 backdrop-blur-3xl bg-black/[0.04] border-black/5 flex items-center overflow-hidden">
                    {/* Discount Badge */}
                    <div className="bg-[#CCD0CF] text-[#06141B] px-8 py-8 flex flex-col items-center justify-center border-r border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-black/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                        <span className="text-[10px] font-bold tracking-[0.3em] uppercase opacity-40 mb-1">Instant_Save</span>
                        <div className="text-4xl font-black tracking-tighter">KSH.5,200</div>
                    </div>

                    {/* Main Offer Details */}
                    <div className="flex-1 px-10 py-6 flex items-center justify-between">
                        <div className="flex items-center gap-12">
                            <div>
                                <div className="text-[9px] font-bold text-[#9BA8AB]/40 uppercase tracking-[0.2em] mb-1">Paper Based test</div>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-2xl font-black text-[#CCD0CF] tracking-tighter uppercase">KSH. 36,380</span>
                                    <span className="text-[10px] font-bold line-through opacity-20">41,580</span>
                                </div>
                            </div>
                            <div className="w-px h-10 bg-white/5" />
                            <div>
                                <div className="text-[9px] font-bold text-[#9BA8AB]/40 uppercase tracking-[0.2em] mb-1">Computer Based test</div>
                                <div className="text-2xl font-black text-[#CCD0CF] tracking-tighter uppercase">KSH. 33,500</div>
                            </div>
                        </div>

                        {/* Validity & CTA */}
                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="text-[9px] font-black text-[#CCD0CF] tracking-[0.1em] uppercase mb-0.5">Valid_Till_March_31</div>
                                <div className="text-[8px] font-bold text-[#9BA8AB]/30 uppercase tracking-widest">Limited_Time_Promotion</div>
                            </div>
                            <button className="bg-[#CCD0CF] text-[#06141B] px-8 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-2xl hover:bg-white transition-all group flex items-center gap-3">
                                Claim Discount
                                <span className="text-lg leading-none transition-transform group-hover:translate-x-1">↗</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
