import React from 'react';
import { motion, Variants } from 'framer-motion';

const container: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.1
        }
    }
};

const item: Variants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.33, 1, 0.68, 1] } }
};

export const RedesignedContact = () => {
    const [status, setStatus] = React.useState<'idle' | 'sending' | 'sent'>('idle');

    const handleSend = () => {
        setStatus('sending');
        setTimeout(() => setStatus('sent'), 2000);
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="flex-1 flex flex-col p-8 md:p-12 pb-32 relative h-full justify-center"
        >
            <div className="flex justify-between items-start w-full mb-12">
                <motion.div variants={item}>
                    <div className="text-num-condensed text-[#CCD0CF]" style={{ fontSize: '6rem' }}>07</div>
                    <div className="text-label-tech mt-2 text-[#9BA8AB]/40 tracking-[0.3em] uppercase">Comm Station</div>
                </motion.div>
                <div className="text-right max-w-md">
                    <motion.h2 variants={item} className="text-4xl font-black text-[#CCD0CF] tracking-tighter mb-4 leading-none uppercase">
                        Establish <br /> <span className="text-[#9BA8AB]/30">Connection</span>
                    </motion.h2>
                    <motion.p variants={item} className="text-para-luxury font-medium text-[#CCD0CF] text-sm opacity-60">
                        Direct uplink to Ron's Futurebridge experts. Elite advisory services for your global transition.
                    </motion.p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 items-stretch">
                {/* Contact Methods */}
                <div className="lg:col-span-4 grid grid-cols-1 gap-4">
                    {[
                        { label: "Direct Line", val: "+254 720 494 322", id: "PHONE" },
                        { label: "Headquarters", val: "Rieti Bldg, Uganda Rd", id: "LOCAL" },
                        { label: "Digital Mail", val: "ronsfuturebridge7@gmail.com", id: "MAIL" }
                    ].map((m, i) => (
                        <motion.div
                            key={i}
                            variants={item}
                            whileHover={{ scale: 1.02, x: 5, backgroundColor: "rgba(255, 255, 255, 0.03)" }}
                            className="cinema-glass p-6 flex flex-col justify-between group cursor-pointer transition-all bg-white/[0.005] border-white/5 shadow-sm"
                        >
                            <div className="text-label-tech opacity-30 group-hover:opacity-100 uppercase tracking-widest">{m.id}</div>
                            <div>
                                <div className="text-lg font-black text-[#CCD0CF] tracking-tighter uppercase mb-1">{m.val}</div>
                                <div className="text-para-luxury opacity-40 font-medium text-xs group-hover:opacity-100 transition-opacity">{m.label}</div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Form Module */}
                <motion.div variants={item} className="lg:col-span-8 cinema-glass p-8 md:p-10 relative overflow-hidden flex flex-col justify-center bg-white/[0.005] border-white/5 h-full">
                    {status === 'sent' ? (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-center space-y-4"
                        >
                            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="w-3 h-3 bg-green-500 rounded-full shadow-[0_0_15px_rgba(34,197,94,0.5)]"
                                />
                            </div>
                            <h3 className="text-2xl font-black text-[#CCD0CF] uppercase tracking-tighter">Transmission Successful</h3>
                            <p className="text-para-luxury opacity-50 font-medium">Our experts will establish a connection shortly.</p>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setStatus('idle')}
                                className="text-label-tech hover:text-[#CCD0CF] mt-8 underline underline-offset-8 uppercase tracking-widest text-[10px]"
                            >
                                Send another message
                            </motion.button>
                        </motion.div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-full">
                            <div className="space-y-6 text-left flex flex-col justify-center">
                                <motion.div variants={item}>
                                    <label className="text-label-tech mb-2 block opacity-40 uppercase tracking-tighter text-[10px]">Full Identity</label>
                                    <input
                                        className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-[#CCD0CF] focus:border-[#CCD0CF] outline-none transition-all placeholder:text-white/5 text-sm font-medium"
                                        placeholder="E.g. Alexander Pierce"
                                    />
                                </motion.div>
                                <motion.div variants={item}>
                                    <label className="text-label-tech mb-2 block opacity-40 uppercase tracking-tighter text-[10px]">Communication Subject</label>
                                    <input
                                        className="w-full bg-transparent border-b border-white/10 px-0 py-3 text-[#CCD0CF] focus:border-[#CCD0CF] outline-none transition-all placeholder:text-white/5 text-sm font-medium"
                                        placeholder="Scholarship or Visa Strategy?"
                                    />
                                </motion.div>
                            </div>
                            <div className="flex flex-col justify-end space-y-6 text-left">
                                <motion.div variants={item} className="flex-1 min-h-[120px]">
                                    <label className="text-label-tech mb-2 block opacity-40 uppercase tracking-tighter text-[10px]">Detailed Query</label>
                                    <textarea
                                        className="w-full h-full bg-white/[0.02] border border-white/5 rounded-2xl p-4 text-[#CCD0CF] focus:border-[#CCD0CF]/30 outline-none transition-all placeholder:text-white/5 text-sm resize-none font-medium"
                                        placeholder="Elaborate on your academic objectives..."
                                    />
                                </motion.div>
                                <motion.button
                                    variants={item}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={status === 'sending'}
                                    onClick={handleSend}
                                    className="pill-button w-full py-5 text-[10px] uppercase tracking-[0.2em] shadow-2xl relative overflow-hidden group disabled:opacity-50"
                                >
                                    <span className={status === 'sending' ? 'opacity-0' : 'opacity-100'}>
                                        {status === 'idle' ? 'Transmit Request' : 'Establishing Link...'}
                                    </span>
                                    {status === 'sending' && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-4 h-4 border-2 border-[#06141B] border-t-transparent rounded-full animate-spin" />
                                        </div>
                                    )}
                                </motion.button>
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </motion.div>
    );
};

