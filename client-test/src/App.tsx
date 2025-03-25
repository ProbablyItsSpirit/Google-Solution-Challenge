import React, { useState, useRef } from 'react';
import { FileUp, Sun, Moon, User, ArrowRight, Box, ChevronLeft, ChevronRight, FileText, FileCheck, FileQuestion, LogOut, Settings, Minus, Plus, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type UploadType = 'QP' | 'SP' | 'AP';

interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [isClassroomOpen, setIsClassroomOpen] = useState(false);
  const [isAccessibilityOpen, setIsAccessibilityOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [activeUploadType, setActiveUploadType] = useState<UploadType | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [chatHistory] = useState<ChatMessage[]>([]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop logic here
  };

  const handleFileUpload = (type: UploadType) => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFontSizeChange = (increment: boolean) => {
    setFontSize(prev => Math.min(Math.max(12, prev + (increment ? 2 : -2)), 24));
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-[#0F1419]' : 'bg-[#F8F9FB]'}`} style={{ fontSize: `${fontSize}px` }}>
      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        onChange={(e) => {
          // Handle file selection
        }}
      />

      {/* Header */}
      <header className={`fixed top-0 w-full ${isDarkMode ? 'bg-[#1A1D21]' : 'bg-white'} shadow-sm z-50 backdrop-blur-lg bg-opacity-80`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileUp className="w-8 h-8 text-[#8E33FF]" />
            <span className="text-xl font-bold text-[#8E33FF]">GradeGood</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setIsClassroomOpen(!isClassroomOpen)}
              className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-[#2A2D31]' : 'hover:bg-gray-100'}`}
            >
              <Box className={`w-5 h-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`} />
            </button>
            
            {/* Accessibility Menu */}
            <div className="relative">
              <button
                onClick={() => setIsAccessibilityOpen(!isAccessibilityOpen)}
                className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-[#2A2D31]' : 'hover:bg-gray-100'}`}
              >
                <Settings className={`w-5 h-5 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`} />
              </button>
              
              <AnimatePresence>
                {isAccessibilityOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg ${
                      isDarkMode ? 'bg-[#2A2D31]' : 'bg-white'
                    } p-3 space-y-2`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Text Size</span>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleFontSizeChange(false)}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                          {fontSize}px
                        </span>
                        <button
                          onClick={() => handleFontSizeChange(true)}
                          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Text to Speech</span>
                      <button
                        onClick={() => setTextToSpeechEnabled(!textToSpeechEnabled)}
                        className={`p-2 rounded-full ${
                          textToSpeechEnabled ? 'bg-[#8E33FF] text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className={`p-2 rounded-full transition-all duration-300 ${isDarkMode ? 'hover:bg-[#2A2D31]' : 'hover:bg-gray-100'}`}
            >
              {isDarkMode ? <Sun className="w-5 h-5 text-gray-200" /> : <Moon className="w-5 h-5 text-gray-600" />}
            </button>
          </div>
        </div>
      </header>

      {/* Collapsible Sidebar */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarExpanded ? '240px' : '16px' }}
        className={`fixed left-0 top-16 h-full ${isDarkMode ? 'bg-[#1A1D21]' : 'bg-white'} shadow-sm z-40`}
      >
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className={`absolute -right-3 top-4 p-1 rounded-full ${isDarkMode ? 'bg-[#2A2D31]' : 'bg-white'} shadow-md`}
        >
          {isSidebarExpanded ? 
            <ChevronLeft className={`w-4 h-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`} /> :
            <ChevronRight className={`w-4 h-4 ${isDarkMode ? 'text-gray-200' : 'text-gray-600'}`} />
          }
        </button>
        
        <AnimatePresence>
          {isSidebarExpanded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-4 space-y-4"
            >
              <h2 className={`text-sm font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Chat History</h2>
              <div className="space-y-2">
                {chatHistory.map((chat, index) => (
                  <div
                    key={index}
                    className={`p-3 rounded-lg text-sm ${
                      isDarkMode ? 'bg-[#2A2D31] text-gray-200' : 'bg-gray-100 text-gray-700'
                    }`}
                  >
                    {chat.text.substring(0, 50)}...
                  </div>
                ))}
              </div>

              {/* User Profile Section */}
              <div className={`mt-8 p-4 rounded-lg ${isDarkMode ? 'bg-[#2A2D31]' : 'bg-gray-100'}`}>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 rounded-full bg-[#8E33FF]">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Teacher</h3>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Pro Account</p>
                  </div>
                </div>
                <button
                  className={`w-full flex items-center justify-center space-x-2 p-2 rounded-lg
                    ${isDarkMode ? 'bg-[#1A1D21] hover:bg-[#2A2D31]' : 'bg-white hover:bg-gray-50'} 
                    transition-colors duration-200`}
                >
                  <LogOut className="w-4 h-4 text-[#8E33FF]" />
                  <span className={`text-sm ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>Log Out</span>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>

      {/* Classroom Overlay */}
      <AnimatePresence>
        {isClassroomOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className={`fixed right-0 top-16 h-full w-80 ${isDarkMode ? 'bg-[#1A1D21]' : 'bg-white'} shadow-lg z-40 p-6`}
          >
            <h2 className={`text-xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Classroom</h2>
            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#2A2D31]' : 'bg-gray-100'}`}>
                <h3 className={`font-medium mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Recent Grades</h3>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`transition-all duration-300 ${isSidebarExpanded ? 'ml-60' : 'ml-4'} pt-16 h-screen`}>
        <div className="container mx-auto px-4 py-6 h-[calc(100vh-6rem)] flex flex-col">
          {/* Chat Area */}
          <div 
            className={`flex-1 rounded-xl overflow-hidden flex flex-col ${isDarkMode ? 'bg-[#1A1D21]' : 'bg-white'} shadow-lg`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex-1 p-6 overflow-y-auto">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`mb-6 p-4 rounded-xl ${
                    isDarkMode ? 'bg-[#2A2D31]' : 'bg-[#F8F9FB]'
                  }`}
                >
                  <p className={`${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                    {message.text}
                  </p>
                </div>
              ))}
            </div>

            {/* Upload Area */}
            <AnimatePresence>
              {isDragging && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className={`absolute inset-0 bg-opacity-90 flex items-center justify-center ${
                    isDarkMode ? 'bg-[#1A1D21]' : 'bg-white'
                  }`}
                >
                  <div className={`border-2 border-dashed rounded-xl p-8 ${
                    isDarkMode ? 'border-[#8E33FF]' : 'border-[#8E33FF]'
                  }`}>
                    <FileUp className="w-12 h-12 text-[#8E33FF] mx-auto mb-4" />
                    <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      Drop your file here
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input Area */}
            <div className={`p-4 ${isDarkMode ? 'bg-[#2A2D31]' : 'bg-[#F8F9FB]'} border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              {/* Circular Upload Buttons */}
              <div className="flex justify-center space-x-4 mb-4">
                <motion.div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFileUpload('QP')}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      activeUploadType === 'QP'
                        ? 'bg-[#8E33FF] text-white shadow-[0_0_15px_rgba(142,51,255,0.3)]'
                        : isDarkMode
                        ? 'bg-[#1A1D21] text-gray-400 hover:bg-[#2A2D31]'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FileQuestion className="w-5 h-5" />
                  </motion.button>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Question Paper
                  </span>
                </motion.div>
                <motion.div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFileUpload('SP')}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      activeUploadType === 'SP'
                        ? 'bg-[#8E33FF] text-white shadow-[0_0_15px_rgba(142,51,255,0.3)]'
                        : isDarkMode
                        ? 'bg-[#1A1D21] text-gray-400 hover:bg-[#2A2D31]'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FileCheck className="w-5 h-5" />
                  </motion.button>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Solution Paper
                  </span>
                </motion.div>
                <motion.div className="relative group">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleFileUpload('AP')}
                    className={`p-3 rounded-full transition-all duration-300 ${
                      activeUploadType === 'AP'
                        ? 'bg-[#8E33FF] text-white shadow-[0_0_15px_rgba(142,51,255,0.3)]'
                        : isDarkMode
                        ? 'bg-[#1A1D21] text-gray-400 hover:bg-[#2A2D31]'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <FileText className="w-5 h-5" />
                  </motion.button>
                  <span className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Answer Paper
                  </span>
                </motion.div>
              </div>

              <div className="flex space-x-2 relative">
                <motion.div
                  className="flex-1 relative"
                  whileHover="hover"
                >
                  <motion.div
                    className="absolute inset-0 rounded-full bg-[#8E33FF] opacity-10"
                    animate={{
                      scale: [1, 1.02, 1],
                      opacity: [0.1, 0.2, 0.1]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Ask a question or type a message..."
                    className={`w-full px-4 py-3 rounded-full border transition-all duration-300
                      ${isDarkMode 
                        ? 'bg-[#1A1D21] border-gray-600 text-white placeholder-gray-400 focus:border-[#8E33FF] focus:ring-1 focus:ring-[#8E33FF]' 
                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-[#8E33FF] focus:ring-1 focus:ring-[#8E33FF]'}`}
                  />
                </motion.div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-3 transition-all duration-300
                    ${message.trim() 
                      ? 'text-[#8E33FF] hover:text-[#9E43FF]' 
                      : (isDarkMode ? 'text-gray-300' : 'text-gray-500')}`}
                >
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;