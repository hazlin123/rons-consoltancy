import { motion } from "framer-motion";
import { Play, Award, TrendingUp } from "lucide-react";
import { useState } from "react";

export const SuccessStories = () => {
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

    const stories = [
        {
            name: "Wanjiku Kamau",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
            destination: "University of Oxford",
            country: "🇬🇧 UK",
            before: "6.0",
            after: "8.5",
            course: "MSc Computer Science",
            quote: "From Nairobi to Oxford! The tutors were amazing. I improved 2.5 bands in 6 weeks."
        },
        {
            name: "Brian Omondi",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
            destination: "Harvard University",
            country: "🇺🇸 USA",
            before: "6.5",
            after: "8.0",
            course: "MBA",
            quote: "Best investment I made in Mombasa. Now studying at my dream school!"
        },
        {
            name: "Akinyi Otieno",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop",
            destination: "University of Toronto",
            country: "🇨🇦 Canada",
            before: "5.5",
            after: "7.5",
            course: "BSc Nursing",
            quote: "From struggling with writing to Band 7.5. Asante sana Rons Future Bridge!"
        },
        {
            name: "Kipchoge Mutai",
            image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
            destination: "University of Melbourne",
            country: "🇦🇺 Australia",
            before: "6.0",
            after: "8.0",
            course: "Engineering",
            quote: "The mock tests in Kisumu prepared me perfectly for the real exam."
        },
        {
            name: "Faith Njeri",
            image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
            destination: "Imperial College",
            country: "🇬🇧 UK",
            before: "6.5",
            after: "8.5",
            course: "Medicine",
            quote: "Achieved my Band 8.5 from Eldoret and got into my dream medical school!"
        },
        {
            name: "David Mwangi",
            image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
            destination: "Stanford University",
            country: "🇺🇸 USA",
            before: "7.0",
            after: "9.0",
            course: "PhD Physics",
            quote: "Perfect Band 9 from Nakuru! The strategies they taught were game-changing."
        }
    ];

    return (
        <section className="py-32 bg-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-[#fbbf24]/10 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-[#164e63]/5 rounded-full blur-[120px]"></div>

            <div className="container mx-auto px-4">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-20"
                >
                    <span className="font-script text-5xl text-[#fbbf24] block mb-3">Real Results</span>
                    <h2 className="font-sans font-black text-5xl md:text-6xl text-[#164e63] mb-6">
                        Success Stories
                    </h2>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Meet our students who achieved their dreams and are now studying at world-class universities
                    </p>
                </motion.div>

                {/* Stories Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stories.map((story, index) => (
                        <motion.div
                            key={story.name}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onMouseEnter={() => setHoveredIndex(index)}
                            onMouseLeave={() => setHoveredIndex(null)}
                            className="relative group cursor-pointer"
                        >
                            {/* Polaroid-style frame */}
                            <div className="bg-white rounded-3xl p-4 shadow-xl hover:shadow-2xl transition-all transform hover:-rotate-2 duration-500 border-4 border-white">
                                {/* Image */}
                                <div className="relative overflow-hidden rounded-2xl mb-4 h-80">
                                    <img
                                        src={story.image}
                                        alt={story.name}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />

                                    {/* Overlay on hover */}
                                    <div className={`absolute inset-0 bg-gradient-to-t from-[#164e63] via-[#164e63]/80 to-transparent transition-opacity duration-300 ${hoveredIndex === index ? 'opacity-100' : 'opacity-0'
                                        } flex flex-col justify-end p-6 text-white`}>
                                        <p className="text-sm italic mb-3">"{story.quote}"</p>
                                        <div className="flex items-center gap-2 text-xs">
                                            <Play className="w-4 h-4 text-[#fbbf24]" />
                                            <span>Watch Video Testimonial</span>
                                        </div>
                                    </div>

                                    {/* Score Badge */}
                                    <div className="absolute top-4 right-4 bg-white rounded-2xl px-4 py-2 shadow-lg">
                                        <div className="flex items-center gap-2">
                                            <div className="text-center">
                                                <div className="text-xs text-gray-500">Before</div>
                                                <div className="text-lg font-black text-red-500">{story.before}</div>
                                            </div>
                                            <TrendingUp className="w-4 h-4 text-[#fbbf24]" />
                                            <div className="text-center">
                                                <div className="text-xs text-gray-500">After</div>
                                                <div className="text-lg font-black text-green-600">{story.after}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="text-center">
                                    <h3 className="font-black text-xl text-[#164e63] mb-1">{story.name}</h3>
                                    <p className="text-sm text-gray-600 mb-2">{story.course}</p>
                                    <div className="flex items-center justify-center gap-2 mb-2">
                                        <Award className="w-4 h-4 text-[#fbbf24]" />
                                        <span className="text-sm font-bold text-[#164e63]">{story.destination}</span>
                                    </div>
                                    <span className="text-2xl">{story.country}</span>
                                </div>

                                {/* Handwritten note effect */}
                                <div className="absolute -bottom-3 -right-3 bg-[#fbbf24] text-[#164e63] px-4 py-2 rounded-full text-xs font-black uppercase transform rotate-12 shadow-lg">
                                    +{(parseFloat(story.after) - parseFloat(story.before)).toFixed(1)} Bands!
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mt-16"
                >
                    <button className="relative group">
                        <div className="absolute inset-0 bg-[#fbbf24] rounded-full blur group-hover:blur-md transition-all duration-300 opacity-70"></div>
                        <div className="relative h-16 px-12 rounded-full bg-[#164e63] text-white font-black text-lg hover:bg-[#fbbf24] hover:text-[#164e63] transition-all duration-300 flex items-center">
                            Join 5,000+ Successful Students
                        </div>
                    </button>
                </motion.div>
            </div>
        </section>
    );
};
