import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandHistory {
    input: string;
    output: React.ReactNode;
}

export function TerminalMode() {
    const [isVisible, setIsVisible] = useState(false);
    const [input, setInput] = useState('');
    const [history, setHistory] = useState<CommandHistory[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Toggle visibility with Ctrl + Q
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.key.toLowerCase() === 'q') {
                e.preventDefault();
                setIsVisible((prev) => !prev);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Auto-focus input when terminal opens or history changes
    useEffect(() => {
        if (isVisible) {
            inputRef.current?.focus();
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [isVisible, history]);

    const handleCommand = (cmd: string) => {
        const trimmedCmd = cmd.trim();
        if (!trimmedCmd) return;

        let output: React.ReactNode = '';

        const args = trimmedCmd.split(' ');
        const mainCommand = args[0].toLowerCase();

        switch (mainCommand) {
            case 'help':
                output = (
                    <div className="text-gray-300">
                        <div>Available commands:</div>
                        <div className="ml-4">
                            <span className="text-green-400">help</span>       - Show this message<br />
                            <span className="text-green-400">whoami</span>     - Display current user info<br />
                            <span className="text-green-400">ls</span>         - List directory contents<br />
                            <span className="text-green-400">cat</span>        - Concatenate and print files (e.g., cat skills.txt)<br />
                            <span className="text-green-400">sudo</span>       - Execute a command as superuser<br />
                            <span className="text-green-400">clear</span>      - Clear the terminal screen<br />
                            <span className="text-green-400">exit</span>       - Close the terminal<br />
                        </div>
                    </div>
                );
                break;
            case 'whoami':
                output = 'Sujal Talreja - AI Engineer & Data Analyst. Passionate about machine learning, generative AI, and building intelligent systems.';
                break;
            case 'ls':
                output = (
                    <div className="flex gap-4 text-blue-400">
                        <span>about.txt</span>
                        <span>skills.txt</span>
                        <span>projects/</span>
                        <span>contact.sh</span>
                        <span>resume.pdf</span>
                    </div>
                );
                break;
            case 'cat':
                if (args[1] === 'skills.txt') {
                    output = 'Python, TypeScript, React, PyTorch, TensorFlow, SQL, FastAPI, GenAI, RAG, Computer Vision, NLP';
                } else if (args[1] === 'about.txt') {
                    output = 'I am an AI Engineer specializing in building scalable machine learning models and intelligent data solutions.';
                } else if (!args[1]) {
                    output = 'cat: missing file operand';
                } else {
                    output = `cat: ${args[1]}: No such file or directory`;
                }
                break;
            case 'sudo':
                if (args[1] === 'hire') {
                    output = 'Authentication required: Please email to proceed with hiring protocol.';
                } else {
                    output = `${args[0]}: permission denied. This incident will be reported.`;
                }
                break;
            case 'clear':
                setHistory([]);
                return; // Don't add 'clear' to history
            case 'exit':
                setIsVisible(false);
                return; // Don't add 'exit' to history
            default:
                output = `bash: ${mainCommand}: command not found`;
        }

        setHistory((prev) => [...prev, { input: trimmedCmd, output }]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleCommand(input);
        setInput('');
    };

    // Prevent closing when clicking inside the terminal, but allow focusing input
    const handleTerminalClick = () => {
        inputRef.current?.focus();
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 z-[9999] bg-black/95 text-green-500 font-mono text-sm sm:text-base p-4 sm:p-8 overflow-y-auto"
                onClick={handleTerminalClick}
                style={{ fontFamily: '"Courier New", Courier, monospace' }}
            >
                <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
                    {/* Header */}
                    <div className="mb-6 opacity-80">
                        <pre className="text-green-500 text-xs sm:text-sm whitespace-pre-wrap hidden sm:block">
                            {`   _____       _       __  ______      __           _        
  / ___/__  __(_)___ _/ / /_  __/___ _/ /_______   (_)___ _  
  \\__ \\/ / / / / __ \`/ /   / / / __ \`/ / ___/ _ \\ / / __ \`/  
 ___/ / /_/ / / /_/ / /   / / / /_/ / / /  /  __// / /_/ /   
/____/\\__,_/_/\\__,_/_/   /_/  \\__,_/_/_/   \\___// /\\__,_/    
                                             |__/            `}
                        </pre>
                        <div className="mt-4 text-gray-400">
                            System initialized...<br />
                            Welcome to Sujal Talreja's Tech Profile v2.0<br />
                            Type <span className="text-white">help</span> to see a list of available commands.<br />
                            Press <span className="text-white">Ctrl + Q</span> or type <span className="text-white">exit</span> to close.
                        </div>
                    </div>

                    {/* Command History */}
                    <div className="flex-1 space-y-4 mb-4">
                        {history.map((cmd, i) => (
                            <div key={i}>
                                <div className="flex items-center gap-2">
                                    <span className="text-blue-400">sujal@portfolio</span>
                                    <span className="text-white">:</span>
                                    <span className="text-purple-400">~</span>
                                    <span className="text-white">$</span>
                                    <span className="text-gray-100">{cmd.input}</span>
                                </div>
                                <div className="mt-1 text-gray-300 break-words whitespace-pre-wrap">
                                    {cmd.output}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSubmit} className="flex items-center gap-2 mt-auto">
                        <span className="text-blue-400">sujal@portfolio</span>
                        <span className="text-white">:</span>
                        <span className="text-purple-400">~</span>
                        <span className="text-white">$</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            className="flex-1 bg-transparent border-none outline-none text-gray-100 focus:ring-0 p-0"
                            spellCheck="false"
                            autoComplete="off"
                        />
                    </form>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
