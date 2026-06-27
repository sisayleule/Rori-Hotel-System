// This page shows HR all message threads with students and lets HR read and reply to each conversation.
import React, { useState, useEffect, useRef } from 'react'; // Import React, hooks for state, side-effects, and references.
import DashboardLayout from '../../components/DashboardLayout'; // Import parent responsive layout framework wrapper.
import api from '../../utils/api'; // Import configured Axios networking handler instance.

// Create the HRMessages functional component.
const HRMessages = () => {
  // Trace conversation threads summary list on reactive state.
  const [threads, setThreads] = useState([]); // Stores all active conversational summaries.
  // Track currently active conversation thread summary.
  const [activeThread, setActiveThread] = useState(null); // Initially null until selected.
  // Store all messages within the active individual thread.
  const [messages, setMessages] = useState([]); // Array listing chronological messages.
  // Reactive text string state mapping typed chat messages in form.
  const [newMessage, setNewMessage] = useState(''); // Text field input accumulator.
  // Track loading state for threads list retrieval.
  const [loadingThreads, setLoadingThreads] = useState(true); // Boolean flag starting true.
  // Track loading state for active chat thread messages retrieval.
  const [loadingMessages, setLoadingMessages] = useState(false); // Boolean flag starting false.
  // Track writing execution state while dispatching messages.
  const [sending, setSending] = useState(false); // Disable form inputs while active.
  // String state containing backend transaction error descriptions.
  const [error, setError] = useState(''); // Holds readable error labels.

  // Create standard ref targeting bottom element in scroll view.
  const bottomRef = useRef(null); // Reference to auto scroll chat panel.

  // Mount useEffect to query threads list once upon initial load.
  useEffect(() => {
    // Declare asynchronous function fetchThreads to retrieve conversation partners.
    const fetchThreads = async () => {
      // Implement protective try-catch block for network operations.
      try {
        // Dispatch GET request calling messages threads summary endpoints.
        const response = await api.get('/messages/threads'); // Execute HTTP request.
        // Update threads state mapping backend response payload correctly.
        setThreads(response.data); // Save results.
      } catch (err) {
        // Output failure info onto readable error state.
        setError('could not load message threads'); // Set system alert string.
      } finally {
        // Close loading state toggle indicator.
        setLoadingThreads(false); // Toggle threads loading off.
      }
    };
    // Trigger asynchronous fetch call.
    fetchThreads(); // Fire fetch function.
  }, []); // Run exact mounting sequence.

  // Mount second useEffect depending on changes to active selected conversation partner.
  useEffect(() => {
    // If active selected partner is null.
    if (!activeThread) {
      // Return early because no conversation content can be fetched.
      return; // Stop thread messages fetch.
    }
    // Declare asynchronous function loadMessages to fetch selected conversational history.
    const loadMessages = async () => {
      // Implement protective try-catch block.
      try {
        // Turn on messages loading indicator toggle.
        setLoadingMessages(true); // Enable loading state.
        // Retrieve messaging log details for targeted partner ID.
        const response = await api.get(`/messages/thread/${activeThread.otherUserId}`); // Execute HTTP call.
        // Populate messages list state mapping returned conversation logs array.
        setMessages(response.data); // Hydrate messages list.
      } catch (err) {
        // Capture and persist communication errors.
        setError('could not load thread messages'); // Set system alert string.
      } finally {
        // Terminate active load indicators.
        setLoadingMessages(false); // Toggle load off.
      }
    };
    // Trigger message loading routine.
    loadMessages(); // Direct function call.
  }, [activeThread]); // Listen to currently selected thread state changes.

  // Mount third useEffect tracking messages collection updates.
  useEffect(() => {
    // Inspect if scrolling element reference exists on layout.
    if (bottomRef.current) {
      // Perform automated scroll focusing onto the newly rendered list items.
      bottomRef.current.scrollIntoView({ behavior: 'smooth' }); // Center view bottom.
    }
  }, [messages]); // Re-trigger upon changes in active thread messages list length.

  // Declare conversational message sending dispatch handler function.
  const handleSend = async () => {
    // Validate that typing value is not empty after space trims.
    if (!newMessage.trim()) {
      // Abort submission if validation conditions fail.
      return; // Halt logic execution flow.
    }
    // Set writing transaction indicators to prevent duplications.
    setSending(true); // Toggle sending indicators.
    // Wrap remote backend writing sequences inside try-catch block.
    try {
      // Post serialized message elements onto backend endpoints.
      await api.post('/messages', {
        receiverId: activeThread.otherUserId, // Bind recipient target id.
        body: newMessage.trim() // Bind text body.
      });
      // Immediately pull latest thread history logs to update screen feed.
      const response = await api.get(`/messages/thread/${activeThread.otherUserId}`); // Dispatch GET call.
      // Update local feed with retrieved list records.
      setMessages(response.data); // Reset messages array.
      // Clear message typing box content.
      setNewMessage(''); // Empty input field value.
    } catch (err) {
      // Apply helpful descriptive message text onto local error states.
      setError('failed to send message'); // Output warning description.
    } finally {
      // Switch off active sending indicator properties.
      setSending(false); // Toggle writing indicator off.
    }
  };

  // Declare thread selector callback triggering when clicking left side list.
  const handleSelectThread = (thread) => {
    // Assign chosen summary object as active thread tracking item.
    setActiveThread(thread); // Set selecting state.
  };

  // Find local user identifier to correctly format bubbles directions.
  const getLoggedInUserId = () => {
    // Try to safely load stored customer profile data from local browser memory.
    const cachedUser = localStorage.getItem('roriUser'); // Read user details.
    // Inspect whether profile detail string exists.
    if (cachedUser) {
      // Parse information string back into Javascript object.
      const parsedRecord = JSON.parse(cachedUser); // Parse data object.
      // Return the recorded database identifier key of user.
      return parsedRecord.id || parsedRecord.userId; // Securely return identifier.
    }
    // Return empty fallback string if credentials are absent.
    return ''; // Empty return key.
  };

  // Capture user identifier into local variable reference.
  const activeUserId = getLoggedInUserId(); // Store logged in user ID.

  // Build component visual interface layout wrapper.
  return (
    // Wrap entire page inside HR Role authorized standard template framework structure.
    <DashboardLayout role="hr" pageTitle="Messages">
      {/* Outer container building a solid visual layout card structure with shadow overflow controls */}
      <div className="flex bg-white rounded-xl shadow-sm border border-gray-150 overflow-hidden h-[600px] font-sans">
        {/* LEFT PANEL showing comprehensive conversation threads logs listing */}
        <div className="w-1/3 border-r border-gray-150 flex flex-col overflow-y-auto shrink-0 select-none bg-gray-50/50">
          {/* Headline header container displaying simple literal panel titles */}
          <div className="p-4 border-b border-gray-150">
            {/* Title bold styling using literal label descriptors */}
            <h2 className="text-lg font-bold text-gray-800">Conversations</h2>
          </div>
          {/* Check loading states before presenting summaries list */}
          {loadingThreads && (
            // Notify user about pending information loader.
            <p className="p-4 text-sm text-gray-500 font-medium">Loading conversations...</p>
          )}
          {/* Fallback check in case summaries collection exists but remains empty */}
          {!loadingThreads && threads.length === 0 && (
            // Render friendly simple explanatory status label.
            <p className="p-4 text-sm text-gray-400 font-medium">No conversations yet</p>
          )}
          {/* Map thread list summaries details arrays into custom cards views */}
          {!loadingThreads && threads.map((thread) => {
            // Assess whether the evaluated list thread is active on view.
            const isActive = activeThread && activeThread.otherUserId === thread.otherUserId; // Compute binary match indicator.
            // Return interactive list card widget.
            return (
              <div
                key={thread.otherUserId} // Bind stable database identifier as JSX looping key.
                onClick={() => handleSelectThread(thread)} // Establish interactive click triggers.
                className={`p-4 border-b border-gray-100 flex items-center justify-between cursor-pointer transition-all duration-150 ${
                  isActive ? 'bg-[#FAF6EC] border-l-4 border-[#C9A84C]' : 'hover:bg-gray-50'
                }`} // Golden left border and warm-beige highlights for clicked thread.
              >
                {/* Horizontal row formatting items layout along center lines with generous gap sizing */}
                <div className="flex items-center gap-3 overflow-hidden select-none">
                  {/* Decorative circular avatar monogram showing user initials */}
                  <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shrink-0">
                    {/* Render first capitalized letter of counterpart's name */}
                    <span className="text-white text-sm font-bold uppercase font-serif">
                      {thread.fullName ? thread.fullName.charAt(0) : 'S'}
                    </span>
                  </div>
                  {/* Vertical container showing student account descriptions and truncated summaries */}
                  <div className="flex-1 min-w-0">
                    {/* Name block displaying bold student labels */}
                    <div className="font-bold text-sm text-gray-800 truncate">
                      {thread.fullName || 'Student'}
                    </div>
                    {/* Excerpt panel truncating message contents to remain within line boundaries */}
                    <div className="text-xs text-gray-500 truncate mt-0.5">
                      {/* Substring limits check for long strings with trailing dots */}
                      {thread.lastMessage && thread.lastMessage.body
                        ? (thread.lastMessage.body.length > 40
                          ? `${thread.lastMessage.body.substring(0, 40)}...`
                          : thread.lastMessage.body)
                        : 'No messages'}
                    </div>
                    {/* Timestamp element detail showing exact delivery moments */}
                    {thread.lastMessage && (
                      <div className="text-[10px] text-gray-400 font-semibold mt-1">
                        {new Date(thread.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    )}
                  </div>
                </div>
                {/* Conditional badge indicator overlay indicating unread counts */}
                {thread.unreadCount > 0 && (
                  <div className="w-5 h-5 rounded-full bg-[#C9A84C] flex items-center justify-center shrink-0 shadow-xs ml-2 select-none">
                    {/* Bold font rendering integer counts */}
                    <span className="text-white text-[10px] font-extrabold">
                      {thread.unreadCount}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* RIGHT PANEL processing user chats dynamic logs interactions */}
        <div className="flex-1 flex flex-col overflow-hidden bg-[#FAF9F6]">
          {/* Standard block checks for unselected baseline state layouts */}
          {!activeThread ? (
            // Centered panel indicating unselected placeholder layouts.
            <div className="flex-1 flex flex-col items-center justify-center p-8 select-none">
              {/* Informative placeholder text display */}
              <p className="text-sm text-gray-400 font-semibold">Select a conversation to start messaging</p>
            </div>
          ) : (
            // Complete chat thread window rendering when partner selection exists.
            <div className="flex flex-col flex-1 overflow-hidden">
              {/* Header section presenting chosen counterpart profile properties */}
              <div className="p-4 border-b border-gray-150 bg-white flex items-center gap-3 shadow-xs select-none shrink-0">
                {/* Circular image monogram element */}
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  {/* First capitalized letter */}
                  <span className="text-white text-sm font-bold uppercase font-serif">
                    {activeThread.fullName ? activeThread.fullName.charAt(0) : 'S'}
                  </span>
                </div>
                {/* Alignment wrapper holding name data and dynamic system role tag */}
                <div>
                  {/* Full formatted student companion name */}
                  <div className="font-bold text-gray-800 text-sm">{activeThread.fullName || 'Student'}</div>
                  {/* Soft text descriptor subtitle indicator */}
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Student Intern</div>
                </div>
              </div>

              {/* Infinite list viewport panel framing conversation timelines */}
              <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
                {/* Checking transition loader indicator prior to thread paint */}
                {loadingMessages && (
                  // Center loader element description.
                  <p className="text-center text-sm text-gray-400 font-medium py-4">Loading messages...</p>
                )}
                {/* Mapping messages timelines dynamically inside message feed wrapper check */}
                {!loadingMessages && messages.map((msg) => {
                  // Determine message author by matching extracted storage ID vs message sender field.
                  const isHR = msg.senderId.toString() === activeUserId.toString(); // Boolean flag marking author role.
                  // Return formatted message balloons aligning right and left boundaries.
                  return (
                    <div
                      key={msg._id} // Database document key string.
                      className={`flex flex-col max-w-[70%] ${
                        isHR ? 'self-end items-end' : 'self-start items-start'
                      }`} // Push HR messages to right side alignment, student to the left side margins.
                    >
                      {/* Body balloon container styling corresponding elements */}
                      <div
                        className={`p-3 rounded-2xl text-sm leading-relaxed ${
                          isHR
                            ? 'bg-[#C9A84C] text-white rounded-br-none shadow-xs'
                            : 'bg-white text-gray-800 rounded-bl-none border border-gray-100 shadow-xs'
                        }`} // Golden rounded badge markup for sender, white shadow elements for student.
                      >
                        {/* Literal markup displaying plain text values */}
                        <p className="whitespace-pre-wrap">{msg.body}</p>
                      </div>
                      {/* Detail element describing metadata timeline underneath bubble */}
                      <span className="text-[9px] text-gray-400 font-bold mt-1 uppercase tracking-wider">
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  );
                })}
                {/* Automated scrolling marker reference component */}
                <div ref={bottomRef} />
              </div>

              {/* Interactive panel row enabling text entering and message submission */}
              <div className="p-4 border-t border-gray-150 bg-white shrink-0">
                {/* Horizontal form grouping text field with action submit prompt buttons */}
                <div className="flex gap-2 items-center">
                  {/* Structured keyboard field collecting input descriptions */}
                  <input
                    type="text" // Specify plain text inputs behavior.
                    value={newMessage} // Dynamic reactive bindings pointing to inputs state parameter.
                    onChange={(e) => setNewMessage(e.target.value)} // Track key input events.
                    onKeyDown={(e) => { // Support dispatcher upon pressing the Enter key.
                      if (e.key === 'Enter') {
                        handleSend(); // Invoke message transmission.
                      }
                    }}
                    placeholder="Type a message..." // Visual empty input indicator.
                    className="flex-1 text-sm text-gray-800 border border-gray-300 rounded-lg px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] focus:border-transparent transition-all" // Input element styling decorators.
                  />
                  {/* Action click button forwarding active letters queue */}
                  <button
                    onClick={handleSend} // Interactive handler calling handleSend.
                    disabled={sending || !newMessage.trim()} // Prevent double execution and block on empty content logs.
                    className="bg-[#C9A84C] hover:bg-[#B7963A] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-widest px-5 py-2.5 rounded-lg transition-colors border-0 cursor-pointer shadow-xs select-none active:scale-98" // Golden color themes buttons.
                  >
                    {/* Conditionally swap text while operations transmit */}
                    {sending ? 'Sending' : 'Send'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default HRMessages; // Export HRMessages view default.
