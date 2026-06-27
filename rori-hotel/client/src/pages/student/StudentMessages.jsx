// This is the messages tab where the student can read and send messages to HR.
// It supports polling updates, auto scrolling, and inline message posting.
import React, { useState, useEffect, useRef } from 'react'; // Import React standard state, effects, and ref-monitoring hooks.
// Import the custom DashboardLayout wrapper component which provides structural viewport slots.
import DashboardLayout from '../../components/DashboardLayout'; // Fetch common nested dashboard scaffolding elements.
// Import our standard axios wrapper instance configured with bases URLs and header credentials.
import api from '../../utils/api'; // Load unified client-side network querying helper driver.

// Create the StudentMessages functional component representing the chat board console.
const StudentMessages = () => {
  // messages state holds all processed conversation records from the active thread.
  const [messages, setMessages] = useState([]); // Initialize conversation logs state to empty array.
  // newMessage state stores whatever character string the student is currently typing inside text input fields.
  const [newMessage, setNewMessage] = useState(''); // Set initial entry values to empty string.
  // loading state tracks whether messages are being fetched from database for the first time.
  const [loading, setLoading] = useState(true); // Initiate load status variables to true.
  // sending state blocks double-posting issues by disabling forms controls while active requests are outgoing.
  const [sending, setSending] = useState(false); // Set message dispatch locks parameters to false.
  // error state stores any failure alert messages sent back from express route processes.
  const [error, setError] = useState(''); // Set system error descriptions string parameters to empty strings.
  // hrUserId state holds target HR user account ObjectID reference required to target outgoing messages.
  const [hrUserId, setHrUserId] = useState(null); // Initialize HR relative identifier to null.

  // Create bottomRef to allow automatic scroll behavior pointing to latest messages containers.
  const bottomRef = useRef(null); // Initialize viewport scrolling target ref variables placeholder with null.

  // Create fetchMessages function outside to allow calling it statically during initialization and polling sequences.
  const fetchMessages = async () => {
    // Start exceptions block to silently protect background polling loops.
    try {
      // Fetch thread list messages by calling GET request directly on messages endpoint route.
      const responseData = await api.get('/messages/thread/hr'); // Execute background fetch API call.
      // Update thread messages state silently without resetting spinners or user interfaces.
      setMessages(responseData.data.messages); // Map messages parameter.
    } catch (err) {
      // Silently swallow errors to avoid interrupting user flows during silent browser polling updates.
      console.warn('Silent messages polling synchronization failed:', err); // Log details.
    } // Complete exception handler sequence.
  }; // Terminate background message query subroutines.

  // Run initial mounting hooks that fetch and identify relative thread details and active user records once.
  useEffect(() => {
    // Declare an asynchronous function initialize to load the chat thread.
    const initialize = async () => {
      // Start safety check block to contain initialization errors.
      try {
        // GET the messages thread dataset from the backend path.
        const responseData = await api.get('/messages/thread/hr'); // Execute HTTP GET call.
        // Set the hrUserId state value returned from database query profiles.
        setHrUserId(responseData.data.hrUserId); // Save recipient identifier tracking parameters.
        // Set messages list using returned array records list payload.
        setMessages(responseData.data.messages); // Populate chat thread container list database.
      } catch (err) {
        // Write diagnostic console warning descriptions onto system outputs directory.
        console.error('Core messages initialization failed:', err); // Log console traces.
        // Display user friendly descriptions alert banners.
        setError('could not load messages please refresh'); // Update user alerts state variables.
      } finally {
        // Disable loading spin loops so that screen view loads smoothly.
        setLoading(false); // Set load indicators parameters to false.
      } // Complete catch blocks logic.
    }; // Terminate initialize execution scope.

    // Call initialize immediately to hydrate chat console screens.
    initialize(); // Run core bootstrapping subroutines.
  }, []); // Run effect target exactly once.

  // Run tracking hooks that automatically scroll current container viewport to bottom when threads change.
  useEffect(() => {
    // Check if bottom target ref node points to real active html divider elements.
    if (bottomRef.current) {
      // Execute standard soft scroll focus method dragging coordinates down.
      bottomRef.current.scrollIntoView({ behavior: 'smooth' }); // Fire scroll into view subroutine.
    } // Finish safety verification conditional logic check.
  }, [messages]); // Hook targets on updates trace variations of messages arrays.

  // Run background daemon intervals polling the server database for thread modifications.
  useEffect(() => {
    // Set a recurring background timer that queries database list records silently.
    const pollIntervalId = setInterval(() => {
      // Fire silent updater subroutine queries.
      fetchMessages(); // Run the message lookup subroutine.
    }, 15000); // Poll server exactly every 15,000 milliseconds (representing 15 seconds).

    // Return custom hook cleanup procedure clearing intervals upon unmount.
    return () => {
      // Call standard system clear interval interface passing unique interval key reference.
      clearInterval(pollIntervalId); // Kill running tasks thread.
    }; // Terminate cleanup loop blocks.
  }, []); // Run effect target exactly once.

  // Create handleSend subroutine to dispatch new text entries.
  const handleSend = async (e) => {
    // If standard forms submits triggered this block prevent native page resets.
    if (e && e.preventDefault) {
      // Call standard prevent default subroutine commands.
      e.preventDefault(); // Suspend page redirection triggers.
    } // End verification check.

    // Guard matching ensuring non-empty submissions before calling database.
    if (!newMessage.trim()) {
      // Abort execution immediately.
      return; // Return early out of scope.
    } // End character verification blocks.

    // Set sending flag parameters to block buttons duplicate postings.
    setSending(true); // Lock buttons selectors.

    // Start exceptions capture context to manage network POST outputs.
    try {
      // Fire HTTP POST database updates carrying custom body values.
      await api.post('/messages', {
        // Map target HR office identifying token credentials.
        receiverId: hrUserId, // Set receiver parameters.
        // Provide standard trimmed text payload variables.
        body: newMessage.trim() // Clear extra spaces from endpoints payloads.
      }); // Trigger message creation.
      // Reset user entry text input value back to baseline empty character parameters.
      setNewMessage(''); // Wipe text input.
      // Refresh messages chronologies list database immediately.
      await fetchMessages(); // Fire immediate synchronization routine.
    } catch (err) {
      // Print diagnostic traces on system log modules folders.
      console.error('Failed to post message:', err); // Log console tracking.
      // Render warning alerts description box values.
      setError('failed to send message please try again'); // Set alert message metrics.
    } finally {
      // Unlock dispatcher send buttons controls.
      setSending(false); // Set lock flags back to false.
    } // Complete standard safety block.
  }; // End handleSend code scope.

  // Return standard page modules wrapped inside DashboardLayout structure.
  return (
    // Wrap workspace page output under student messages configurations panels
    <DashboardLayout role="student" pageTitle="Messages">
      
      {/* Centered chat boundary canvas holding conversation logs and inputs */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 flex flex-col h-[600px] w-full max-w-4xl mx-auto overflow-hidden font-sans">
        
        {/* Top bar header identifying communication desk and staff names */}
        <div className="bg-white border-b border-gray-100 px-6 py-4 flex items-center gap-4 select-none">
          
          {/* Circular colorized avatar with initials */}
          <div className="w-10 h-10 rounded-full bg-[#12110e] flex items-center justify-center text-[#C9A84C] font-bold text-sm shrink-0 shadow-xs">
            H
          </div>
          
          {/* Text descriptions detail container */}
          <div className="flex flex-col">
            
            {/* Department bold title badge */}
            <span className="text-sm font-bold text-gray-900 leading-tight">
              HR Office
            </span>
            
            {/* Institution location caption */}
            <span className="text-xs text-gray-400 mt-0.5 font-medium">
              Rori Hotel Management
            </span>
            
          </div>
          
        </div>

        {/* Conditional section outputting loading animations when fetching */}
        {loading && (
          // Flex center aligned wrapper
          <div className="flex-1 flex items-center justify-center bg-gray-50/50">
            
            {/* Descriptive load text label */}
            <p className="text-xs font-bold tracking-wider text-gray-400 uppercase">
              Loading messages...
            </p>
            
          </div>
        )}

        {/* Error notification banner shown inside chat viewport */}
        {!loading && error && (
          // Alert block styled in eye-safe diagnostic red themes
          <div className="mx-6 mt-4 p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs font-semibold text-center">
            
            {/* Dynamic system error trace output */}
            {error}
            
          </div>
        )}

        {/* Messaging conversation thread grid shown after loading */}
        {!loading && (
          // Scrollable messages container area with standard neutral canvas background
          <div className="flex-1 overflow-y-auto p-4 md:p-6 flex flex-col space-y-4 bg-gray-50/20 md:bg-gray-50/40">
            
            {/* Show fallback text if conversation is currently empty */}
            {messages.length === 0 ? (
              // Middle coordinates wrapper
              <div className="flex-1 flex flex-col items-center justify-center text-center px-6">
                
                {/* Fallback instruction detailing feedback schedules */}
                <p className="text-xs font-medium text-gray-400 max-w-sm leading-relaxed">
                  No messages yet. HR will reach out after reviewing your application.
                </p>
                
              </div>
            ) : (
              // Map registered message logs to render distinct left-and-right bubbles
              messages.map((message) => {
                // Determine whether current message was drafted by HR
                const isFromHR = message.senderId === hrUserId; // Compare identifiers.
                
                // Return styled chat block
                return (
                  // Align columns depending on message authorship
                  <div
                    key={message._id}
                    className={`flex ${isFromHR ? 'justify-start' : 'justify-end'} w-full`}
                  >
                    
                    {/* Chat dialog capsule specifying layout shapes */}
                    <div
                      className={`max-w-[75%] p-3.5 rounded-2xl shadow-xs transition-shadow duration-300 ${
                        isFromHR
                          // HR Bubble styles: white background, light slate border, sharp left corner
                          ? 'bg-white border border-gray-150 text-gray-800 rounded-bl-none'
                          // Student Bubble styles: standard brand golden background, sharp right corner font-bold
                          : 'bg-[#C9A84C] text-[#12110e] rounded-br-none font-medium'
                      }`}
                    >
                      
                      {/* Message text body value */}
                      <p className="text-sm leading-relaxed break-words font-sans">
                        {message.body}
                      </p>
                      
                      {/* Timestamp layout segment located at bottom right corner */}
                      <span
                        className={`text-[9px] uppercase tracking-wider block text-right mt-1.5 select-none font-semibold ${
                          isFromHR ? 'text-gray-400' : 'text-[#12110e]/50'
                        }`}
                      >
                        {new Date(message.createdAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </span>
                      
                    </div>
                    
                  </div>
                );
              })
            )}

            {/* Target scroll anchor container for scrollIntoView subroutines */}
            <div ref={bottomRef} />
            
          </div>
        )}

        {/* Bottom chat messaging input dock area */}
        <div className="p-4 bg-white border-t border-gray-100 flex items-center gap-2">
          
          {/* Input text form allowing message drafting */}
          <input
            type="text"
            value={newMessage}
            // Bind text changes to setNewMessage standard state updater
            onChange={(e) => setNewMessage(e.target.value)}
            // Bind enter key clicks to handleSend dispatcher subroutine
            onKeyDown={(e) => { e.key === 'Enter' && handleSend(); }}
            placeholder="Type your message here..."
            // Disable text entries if messages are currently being sent as POSTs
            disabled={sending || loading}
            className="flex-1 bg-gray-50 focus:bg-white border border-gray-200 focus:border-[#C9A84C] rounded-xl px-4 py-3 text-sm focus:outline-none transition-all duration-300 disabled:opacity-50"
          />
          
          {/* Send dispatch click trigger button */}
          <button
            onClick={handleSend}
            // Disable click triggering if request is pending or text was empty
            disabled={sending || !newMessage.trim() || loading}
            className="bg-[#C9A84C] hover:bg-[#b59540] disabled:bg-gray-100 text-[#12110e] disabled:text-gray-400 text-xs font-bold uppercase tracking-wider px-5 py-3 rounded-xl transition-all duration-300 cursor-pointer disabled:cursor-not-allowed uppercase shadow-sm select-none"
          >
            {sending ? 'Sending' : 'Send'}
          </button>
          
        </div>
        
      </div>
      
    </DashboardLayout>
  );
};

// Export page representation默认.
export default StudentMessages;
