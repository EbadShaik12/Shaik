import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Cpu, X } from 'lucide-react';
import Fuse from 'fuse.js';

// SpeechRecognition is a web standard but often prefixed
const getSpeechRecognition = () => {
    const SpeechRecognitionObject = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    return SpeechRecognitionObject ? new SpeechRecognitionObject() : null;
};

// Jarvis Knowledge Base
const jarvisKnowledge = [
    {
        intent: "greeting",
        keywords: ["hello", "hi", "hey", "jarvis", "wake up", "morning", "afternoon", "evening"],
        response: "Hello there. I am Jarvis, Ebad's personal A.I. assistant. How may I assist you with his portfolio today?"
    },
    {
        intent: "about",
        keywords: ["who is ebad", "about ebad", "tell me about him", "who are you", "what does he do", "tell me about ebad"],
        response: "Shaik Mohammad Ebad is a Product Designer and Developer. He is currently working as a Product Designer and Management Intern at Languify, where he specializes in identifying user pain points and creating seamless digital solutions."
    },
    {
        intent: "skills",
        keywords: ["what are his skills", "what does ebad know", "technologies", "arsenal", "tech stack", "languages", "frameworks", "tools"],
        response: "Ebad's arsenal includes programming languages like C++, JavaScript, Java, and Python. He works with frameworks such as React, Node.js, and Tailwind CSS. He is also highly proficient in tools like Figma and MongoDB, bringing strong Product Management and UX Research tactics to the table."
    },
    {
        intent: "projects",
        keywords: ["projects", "missions", "what has he built", "work", "portfolio", "show me his work"],
        response: "Ebad has completed several impressive missions. These include a full-stack Booking Management System, a UI/UX design for an EV Charging App, and a Gamified Legal Platform to educate children on their rights. He also helped design Case Master for Languify, contributing to a 40% revenue growth for the product."
    },
    {
        intent: "education",
        keywords: ["education", "academy", "where did he study", "degree", "university", "college", "school"],
        response: "He is currently pursuing a Bachelor of Technology in Computer Science and Engineering at Lovely Professional University. He also showed extreme academic excellence, scoring 98% in his Matriculation."
    },
    {
        intent: "certificates",
        keywords: ["certificates", "achievements", "certifications", "awards", "accomplishments"],
        response: "Ebad is certified in Product Management and UI/UX Designing by Cipher Schools, where he was ranked as a Top 10 Learner. He also holds a Web Development certification from FreeCodeCamp, along with certificates in AI APPs and Automata Theory."
    },
    {
        intent: "contact",
        keywords: ["contact", "signal", "hire", "email", "get in touch", "reach out", "linkedin", "github"],
        response: "You can send a signal to Ebad by clicking the ASSEMBLE button in the navigation bar to initiate a protocol via email. You can also find links to his LinkedIn and GitHub in the 'Send the Signal' section at the bottom of the page."
    },
    {
        intent: "location",
        keywords: ["where does he live", "location", "address", "where is he from", "where are you located", "map"],
        response: "Ebad is currently based in Rajampet, Andhra Pradesh. However, he is fully equipped to collaborate globally."
    }
];

// Configure the fuzzy search
const fuseOptions = {
    includeScore: true,
    threshold: 0.4, // Lower threshold means more strict matching
    keys: ['keywords']
};
const fuse = new Fuse(jarvisKnowledge, fuseOptions);

export const Jarvis = () => {
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [recognition, setRecognition] = useState<any>(null);
    const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [showTooltip, setShowTooltip] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => setShowTooltip(false), 15000);
        return () => clearTimeout(timer);
    }, []);

    const initSpeech = useCallback(() => {
        const recognitionObj = getSpeechRecognition();
        if (!recognitionObj) {
            console.warn("Speech recognition not supported in this browser.");
            return;
        }

        recognitionObj.continuous = true;
        recognitionObj.interimResults = true;
        recognitionObj.lang = 'en-US';

        recognitionObj.onstart = () => {
            setIsListening(true);
        };

        recognitionObj.onresult = (event: any) => {
            let currentTranscript = '';
            let isFinal = false;

            for (let i = event.resultIndex; i < event.results.length; i++) {
                currentTranscript += event.results[i][0].transcript;
                if (event.results[i].isFinal) {
                    isFinal = true;
                }
            }

            setTranscript(currentTranscript);

            // If we have a timer running, clear it since we got new speech
            if (silenceTimerRef.current) {
                clearTimeout(silenceTimerRef.current);
            }

            // Once the user stops speaking (isFinal is true for this chunk)
            // Or wait a bit to see if they're done
            if (currentTranscript.trim().length > 0) {
                silenceTimerRef.current = setTimeout(() => {
                    handleJarvisCommand(currentTranscript);
                    recognitionObj.stop(); // Stop listening while we process and speak
                }, 1500); // 1.5 seconds of silence means they are done
            }
        };

        recognitionObj.onerror = (event: any) => {
            console.error("Speech recognition error", event.error);
            setIsListening(false);
        };

        recognitionObj.onend = () => {
            setIsListening(false);
        };

        setRecognition(recognitionObj);
    }, []);

    useEffect(() => {
        initSpeech();
        return () => {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            if (recognition) recognition.stop();
        };
    }, [initSpeech]);

    const handleJarvisCommand = async (spokenText: string) => {
        if (isSpeaking) return;
        setIsSpeaking(true);

        const results = fuse.search(spokenText);
        let responseText = "";

        if (results.length > 0) {
            // Found a match
            responseText = results[0].item.response;
        } else if (spokenText.toLowerCase().includes('jarvis') && spokenText.trim().split(' ').length <= 3) {
            responseText = jarvisKnowledge[0].response; // Default greeting if jarvis is mentioned but nothing else matches well
        } else {
            try {
                const apiKey = (process.env as any).GEMINI_API_KEY || 'AIzaSyCHSRv51lr_qiz3TXDIUIk5sqprh8BSCHc';
                const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{ text: `You are Jarvis, a helpful AI assistant living in Ebad's portfolio website. Answer the user's query conversationally and concisely (under 2-3 sentences max) to be read out loud via text-to-speech. Do not use asterisks or markdown formatting. Answer factually. Query: "${spokenText}"` }]
                        }]
                    })
                });
                const data = await response.json();
                if (data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
                    responseText = data.candidates[0].content.parts[0].text.replace(/[*_#]/g, '');
                } else {
                    responseText = "I'm sorry, I wasn't able to process that correctly.";
                }
            } catch (error) {
                console.error("Gemini API error:", error);
                responseText = "I am currently unable to connect to my AI network. Please check your connection.";
            }
        }

        speak(responseText);
    };

    const speak = (text: string) => {
        if (!('speechSynthesis' in window)) {
            setIsSpeaking(false);
            return;
        }

        window.speechSynthesis.cancel(); // clear previous
        const utterance = new SpeechSynthesisUtterance(text);

        // Make it sound a bit robotic/British like Jarvis if possible
        let jarvisVoice = null;
        const voices = window.speechSynthesis.getVoices();

        // Try to find a good authoritative/British voice
        const preferredVoices = [
            'Google UK English Male',
            'Microsoft George',
            'Microsoft Mark',
            'en-GB'
        ];

        for (const pref of preferredVoices) {
            jarvisVoice = voices.find(v => v.name.includes(pref) || (pref === 'en-GB' && v.lang === 'en-GB' && v.name.includes('Male')));
            if (jarvisVoice) break;
        }

        if (!jarvisVoice) {
            // fallback to any english male or just first voice
            jarvisVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Male')) || voices[0];
        }

        if (jarvisVoice) utterance.voice = jarvisVoice;

        utterance.pitch = 0.8; // Slightly deeper
        utterance.rate = 1.05; // Slightly faster/robotic cadence

        utterance.onend = () => {
            setIsSpeaking(false);
            setTranscript('');

            if (recognition) {
                // Automatically start listening again after answering!
                try { recognition.start(); } catch (e) { }
            }
        };

        utterance.onerror = () => {
            setIsSpeaking(false);
            setTranscript('');
        }

        window.speechSynthesis.speak(utterance);
    };

    const toggleListening = () => {
        setShowTooltip(false);
        if (isListening) {
            if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
            recognition?.stop();
        } else {
            setTranscript('');
            setIsSpeaking(false);
            window.speechSynthesis.cancel();
            try {
                recognition?.start();
            } catch (e) {
                console.error(e);
            }
        }
    };

    return (
        <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-4 pointer-events-none">
            <AnimatePresence>
                {showTooltip && !isListening && !isSpeaking && !transcript && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 10 }}
                        className="bg-black/90 backdrop-blur-md border border-marvel-red/30 rounded-sm p-3 pointer-events-auto shadow-[0_0_20px_rgba(226,54,54,0.15)] flex items-center gap-3 relative"
                    >
                        <div className="absolute -bottom-[7px] left-6 w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-marvel-red/30" />
                        <div className="absolute -bottom-[5px] left-[25px] w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-black/90" />
                        
                        <div className="bg-marvel-red/20 p-2 rounded-full">
                            <Cpu className="text-marvel-red animate-pulse" size={18} />
                        </div>
                        <div className="pr-2">
                            <p className="font-display text-sm text-white tracking-widest uppercase mb-0.5">I am Jarvis</p>
                            <p className="font-sans text-[11px] text-white/60">Ask me anything!</p>
                        </div>
                        <button onClick={() => setShowTooltip(false)} className="text-white/40 hover:text-white transition-colors bg-white/5 hover:bg-white/10 rounded-sm p-1 ml-1">
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {(isListening || isSpeaking || transcript) && (
                    <motion.div
                        initial={{ opacity: 0, x: -20, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="bg-black/90 backdrop-blur-md border border-marvel-red/30 rounded-sm p-4 w-72 shadow-[0_0_30px_rgba(226,54,54,0.15)] pointer-events-auto"
                    >
                        <div className="flex items-center gap-2 mb-3 border-b border-white/10 pb-2">
                            <Cpu className={`text-marvel-red ${isSpeaking ? 'animate-pulse' : (isListening ? 'animate-spin-slow' : '')}`} size={16} />
                            <span className="font-display text-xs tracking-widest text-marvel-red uppercase font-bold">
                                {isSpeaking ? 'JARVIS // TRANSMITTING' : 'JARVIS // LISTENING...'}
                            </span>
                        </div>
                        {transcript && !isSpeaking && (
                            <p className="text-white/80 text-sm font-sans italic border-l-2 border-white/20 pl-3">
                                "{transcript}"
                            </p>
                        )}
                        {isSpeaking && (
                            <div className="flex gap-1.5 items-center h-8 mt-2 justify-center">
                                {[...Array(9)].map((_, i) => {
                                    // Make the middle bars taller for a cool audio visualizer effect
                                    const heightBase = i === 4 ? 100 : (i === 3 || i === 5 ? 80 : (i === 2 || i === 6 ? 60 : 40));
                                    return (
                                        <motion.div
                                            key={i}
                                            animate={{ height: ['20%', `${heightBase}%`, '20%'] }}
                                            transition={{ repeat: Infinity, duration: 0.4 + (Math.random() * 0.2), delay: i * 0.05 }}
                                            className="w-1.5 bg-marvel-red rounded-t-sm"
                                        />
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            <button
                onClick={toggleListening}
                className={`pointer-events-auto relative flex items-center justify-center w-16 h-16 rounded-full border-2 transition-all duration-300 ${isListening
                    ? 'bg-marvel-red/20 border-marvel-red text-marvel-red shadow-[0_0_40px_rgba(226,54,54,0.6)]'
                    : 'bg-black/80 backdrop-blur-md border-white/20 text-white/50 hover:text-white hover:border-marvel-red hover:shadow-[0_0_20px_rgba(226,54,54,0.3)]'
                    }`}
            >
                {isListening ? (
                    <>
                        <div className="absolute inset-0 rounded-full animate-ping bg-marvel-red/30" style={{ animationDuration: '2s' }} />
                        <div className="absolute inset-2 rounded-full border border-marvel-red/50 animate-spin" style={{ animationDuration: '3s' }} />
                    </>
                ) : null}

                {isSpeaking ? <Volume2 size={28} className="animate-pulse text-marvel-red" /> : (isListening ? <Mic size={28} /> : <MicOff size={28} />)}
            </button>
        </div>
    );
};
