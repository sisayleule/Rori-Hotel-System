// This is the public landing page with cinematic design using real hotel photos.
// This page showcases the hotel departments, full screen galleries, scroll snaps, and active interactive cards.
import React, { useEffect } from 'react'; // Import standard state components hooks libraries from React.
import { Link } from 'react-router-dom'; // Import Link routing redirect tags from the router library.
import Navbar from '../components/Navbar'; // Import Navbar from components folder to load standard sticky headers views.
import { Phone, Mail, Facebook, Instagram, Linkedin, Send } from 'lucide-react'; // Import real-world contact icons for rich visual feedback.

// Create a functional component called Home to render our majestic cinematic landing layout views.
const Home = () => { // Construct the Home functional component code blocks.

  // Inside the component add a useEffect that runs once when the component mounts. Inside this useEffect initialise Vanilla Tilt on all elements that have the attribute data-tilt. Check first if window.VanillaTilt exists before calling it. Pass these options: max of 8, speed of 400, glare of false. Add a comment on every line inside this useEffect explaining what Vanilla Tilt does.
  useEffect(() => { // Hook effect running on mount elements frame.
    if (window.VanillaTilt) { // Check if VanillaTilt exists globally.
      const elementsToTilt = document.querySelectorAll('[data-tilt]'); // Select elements with tile data attribute key.
      window.VanillaTilt.init(elementsToTilt, { // Trigger tilt animation engines.
        max: 8, // Set maximum tilt tilt offsets angles in degrees.
        speed: 400, // Configure animations transitions durations speeds parameters inside milliseconds.
        glare: false, // Turn off reflective glare filters rendering.
      }); // Complete VanillaTilt initializations configurations arguments objects.
    } // Complete VanillaTilt module availability guard conditional blocks.

    // Also inside the same useEffect set up the scroll reveal animation. Create an IntersectionObserver. Inside the observer callback loop through the entries. For each entry check if it is intersecting. If it is add the class revealed to the entry target. Set the threshold to 0.15. Select all elements with the class reveal and observe each one. Return a cleanup function that disconnects the observer. Add a comment on every line.
    const revealCallback = (entries) => { // Construct callback tracking intersecting elements.
      entries.forEach((entry) => { // Iterate through each observer target element.
        if (entry.isIntersecting) { // Inspect if the observed node is intersecting the user viewport.
          entry.target.classList.add('revealed'); // Append active CSS animation triggers classes blocks.
        } // Close intersection validation check checks.
      }); // Terminate iteration over intersecting list arrays.
    }; // Complete revealCallback handler declarations block.
    const revealObserver = new IntersectionObserver(revealCallback, { // Construct standard IntersectionObserver.
      threshold: 0.15, // Fire events when at least fifteen percents of targets are visible.
    }); // Complete intersection observer init code blocks.
    const itemsToReveal = document.querySelectorAll('.reveal'); // Fetch target DOM nodes classes references.
    itemsToReveal.forEach((item) => { // Traverse item arrays.
      revealObserver.observe(item); // Register intersection observer trackers.
    }); // End reveal items traverses.
    return () => { // Construct custom cleanup routines callback return block.
      revealObserver.disconnect(); // Disable observers registers to minimize garbage collection loads.
    }; // Complete cleanup routing.
  }, []); // Pass empty array metrics ensures mounts execute once.

  // Now build the JSX. The outer wrapper is a div with minimum height of screen and background color warm-beige. The first child inside this div is the Navbar component. Add a comment on every JSX section.
  return ( // Open landing JSX wrapper nodes returning code structures.
    <div className="min-h-screen bg-warm-beige relative overflow-x-hidden flex flex-col justify-between"> {/* Primary wrapper div with warm-beige setting up container layouts */}
      <Navbar /> {/* Render top sticky scroll-dependent navigation panel layouts */}

      {/* SECTION ONE — Hero section. Add a comment saying this is the fullscreen hero with hotel background photo. */}
      {/* SECTION ONE: Full-screen cinematic hero container with custom stone and taupe color theme */}
      <section className="relative min-h-screen w-full overflow-hidden flex items-center justify-center py-20 px-6 sm:px-12 md:px-16 bg-[#4A4441]">
        
        {/* Fullscreen Background Image - luxurious hotel sanctuary background layer */}
        <div className="absolute inset-0 select-none pointer-events-none overflow-hidden z-0">
          <img
            src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600&h=900&q=80"
            alt="Rori Hotel Luxury Sanctuary backdrop"
            className="absolute inset-0 w-full h-full object-cover z-0 opacity-[0.22] scale-105"
            loading="eager"
            referrerPolicy="no-referrer"
          />
          {/* Dark luxury custom-tinted vignette layers */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#4A4441] via-transparent to-[#4A4441] pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#4A4441] via-transparent to-[#4A4441] pointer-events-none"></div>
        </div>

        {/* Global ambient glowing focal points behind the central content */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[140px] pointer-events-none"></div>

        {/* Center alignment stack content layout */}
        <div className="relative z-20 max-w-4xl w-full mx-auto text-center flex flex-col items-center">

          {/* Main Glassmorphic Central console card with nice gold border and gold shadow glow */}
          <div className="w-full bg-[#756453]/85 backdrop-blur-xl px-6 py-10 sm:p-12 md:p-14 rounded-[32px] border border-gold/45 shadow-[0_45px_100px_rgba(0,0,0,0.95),0_0_55px_rgba(201,168,76,0.18)] flex flex-col items-center space-y-8">
            
            {/* Center circular hotel badge seal */}
            <div className="relative group/emblem">
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#c9a84c] to-[#e4c775] rounded-full blur-md opacity-50 group-hover/emblem:opacity-80 transition duration-500"></div>
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#4A4441] border border-gold/40 flex items-center justify-center p-2.5 shadow-[0_0_30px_rgba(201,168,76,0.35)]">
                <img 
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOV-RLrXND8-FBpTC0iS97VkHPjm_Kjj5zuD2wcyXwyw&s=10" 
                  alt="Rori Hotel Gold Seal Emblem" 
                  className="w-full h-full object-contain rounded-full bg-blue-900/35 border border-gold/25"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Subtitle uppercase indicator */}
            <div className="text-[10px] sm:text-xs tracking-[0.45em] uppercase text-gold font-black font-sans">
              Rori Hotel · Hawassa, Ethiopia
            </div>

            {/* Classical Serif Typography Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-serif tracking-normal leading-[1.125] text-white max-w-3xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.7)] text-center">
              Rori Hotel Apprentice Student<br className="hidden sm:inline" /> Management System
            </h1>

            {/* Description Text */}
            <p className="max-w-2xl text-white/75 text-sm sm:text-base leading-relaxed font-sans font-medium text-center">
              An elite professional platform tailored for next-generation hospitality talents. Seamlessly track vocational sessions, submit performance logs, manage evaluations, and coordinate career milestones with hotel resource managers.
            </p>

            {/* Direct Centered High-Contrast Button Controls */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto pt-4 z-30">
              <Link
                to="/register"
                className="w-full sm:w-auto bg-[#c9a84c] hover:bg-[#b59540] text-[#0e0c0a] uppercase tracking-[0.25em] text-[11px] font-black py-4 px-10 rounded shadow-xl hover:shadow-[0_0_25px_rgba(201,168,76,0.35)] transition-all duration-300 transform hover:-translate-y-0.5 text-center"
              >
                Apply for Internship
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto bg-transparent hover:bg-white/15 text-white border border-white/35 hover:border-white uppercase tracking-[0.25em] text-[11px] font-black py-4 px-10 rounded transition-all duration-300 text-center"
              >
                Staff Login
              </Link>
            </div>

          </div>

        </div>

        {/* Dynamic Responsive 2-column layout deprecated */}
        <div className="hidden max-w-7xl w-full grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center z-20">
          
          {/* Left Column: Premium Left-Aligned Text Content wrapped in a luxurious floating card with bedroom photo backdrop */}
          <div className="lg:col-span-7 text-left text-white bg-black/60 backdrop-blur-md p-8 sm:p-12 md:p-14 rounded-3xl border border-gold/30 hover:border-gold/50 shadow-[0_30px_90px_rgba(0,0,0,0.95)] flex flex-col items-start space-y-6 sm:space-y-8 relative overflow-hidden group/card transition-all duration-500 z-30">
            
            {/* Absolute background photo specifically styled for the card */}
            <div className="absolute inset-0 z-0 select-none pointer-events-none overflow-hidden">
              <img
          src="data:image/jpeg;base64,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"
          alt="Rori Hotel Luxury Sanctuary backdrop"
          className="absolute inset-0 w-full h-full object-cover object-right sm:object-center z-0 animate-fade-in"
          loading="eager"
          referrerPolicy="no-referrer"
        />
        
        {/* Cinematic horizontal dark gradient overlay to make text highly legible and blend into the dark slate palette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#050403]/98 via-[#050403]/85 to-transparent z-10 pointer-events-none"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#050403]/95 via-transparent to-transparent z-10 opacity-90 pointer-events-none"></div>

        </div>{/* Close background wrapper safely */}

        {/* Floating card content layout stacked above background visuals with micro-animations */}
        <div className="relative z-10 w-full flex flex-col items-start space-y-6 sm:space-y-8">
          
          {/* Subtle elegant identity badge */}
          <div className="flex items-center gap-4">
            <img 
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOV-RLrXND8-FBpTC0iS97VkHPjm_Kjj5zuD2wcyXwyw&s=10" 
              alt="Rori Hotel Emblem" 
              className="w-12 h-12 md:w-14 md:h-14 object-contain rounded-full border border-gold/40 bg-[#12110e]"
              referrerPolicy="no-referrer"
            />
            <div className="flex flex-col">
              <span className="text-[10px] sm:text-xs tracking-[0.35em] uppercase text-gold font-black font-sans">Rori Hotel</span>
              <span className="text-[9px] tracking-[0.2em] uppercase text-white/50 font-bold font-sans">Hawassa, Ethiopia</span>
            </div>
          </div>

          {/* Heading using premium serif font exactly resembling the "Welcome To The Epitome of Luxury" template style */}
          <div className="space-y-3 sm:space-y-4">
            <span className="text-[10px] sm:text-xs tracking-[0.4em] uppercase text-gold/80 block font-semibold font-sans">
              APP_MANAGEMENT · PORTAL v1.4
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black font-serif tracking-tight leading-none text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] max-w-xl">
              Welcome To<br />
              The Epitome of<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-white">Hospitality Mastery</span>
            </h1>
            <div className="w-24 h-1 bg-gradient-to-r from-gold to-transparent rounded-full shadow-[0_0_10px_rgba(201,168,76,0.8)]"></div>
          </div>

          {/* Secondary Title and Description */}
          <div className="space-y-2 max-w-xl">
            <h2 className="text-gold-light text-xs sm:text-sm md:text-base font-bold tracking-widest uppercase font-sans">
              Apprentice Student Management System
            </h2>
            <p className="text-white/80 text-xs sm:text-sm md:text-base font-sans font-medium leading-relaxed drop-shadow-sm">
              An elite professional platform tailored for next-generation hospitality talents. Seamlessly track vocational sessions, submit performance logs, manage evaluations, and coordinate career milestones with hotel resource managers.
            </p>
          </div>

          {/* Golden rect button pairings modeled after the high-contrast CHECK AVAILABILITY button on the template logo design */}
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto bg-gradient-to-r from-[#c9a84c] to-[#e4c775] hover:from-[#e4c775] hover:to-[#c9a84c] text-[#12110e] uppercase tracking-[0.25em] text-[11px] font-black py-4 px-10 rounded shadow-2xl transition-all duration-300 transform hover:-translate-y-1 inline-block text-center hover:shadow-[0_0_25px_rgba(201,168,76,0.4)]"
            >
              Apply for Internship
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto bg-transparent hover:bg-white/10 text-white border border-white/40 hover:border-white uppercase tracking-[0.25em] text-[11px] font-black py-4 px-10 rounded transition-all duration-300 inline-block text-center"
            >
              Staff Login
            </Link>
          </div>

        </div> {/* Close relative z-10 stacked content wrapper */}

          </div>

          {/* Right Column: High-End Mockup Image layout matching standard templates on the right side */}
          <div className="lg:col-span-5 w-full flex justify-center lg:justify-end items-center relative animate-fade-in duration-1000">
            
            {/* Decorative soft backdrop shadow/color highlight reflection */}
            <div className="absolute -inset-4 rounded-3xl bg-gradient-to-tr from-gold/15 via-transparent to-white/5 blur-xl opacity-55"></div>
            
            {/* Elegant Double golden accent border layout container */}
            <div className="relative border border-gold/30 hover:border-gold p-2 md:p-3 rounded-2xl transition-all duration-500 shadow-[0_30px_70px_rgba(0,0,0,0.9)] max-w-md sm:max-w-md lg:max-w-full overflow-hidden group bg-[#12110e]">
              
              {/* Internal subtle dark vignette shadow layer overlaying the photo frame */}
              <div className="absolute inset-x-0 bottom-0 top-[60%] bg-gradient-to-t from-[#0e0c0a]/95 via-[#0e0c0a]/40 to-transparent z-10 pointer-events-none"></div>
              
              <img
                src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFhUXGBUVGBUYGBYYFxUWFxgXFhUYGBgYHyggGBolGxcVITEhJyorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGjAlICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/YAAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFhUXGBUVGBUYGBYYFxUWFxgXFhUYGBgYHyggGBolGxcVITEhJyorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGjAlICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/YAAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFhUXGBUVGBUYGBYYFxUWFxgXFhUYGBgYHyggGBolGxcVITEhJyorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGjAlICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/YAAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFhUXGBUVGBUYGBYYFxUWFxgXFhUYGBgYHyggGBolGxcVITEhJyorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGjAlICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/YAAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFhUXGBUVGBUYGBYYFxUWFxgXFhUYGBgYHyggGBolGxcVITEhJyorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGjAlICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/YAAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFhUXGBUVGBUYGBYYFxUWFxgXFhUYGBgYHyggGBolGxcVITEhJyorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGjAlICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/YAAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFhUXGBUVGBUYGBYYFxUWFxgXFhUYGBgYHyggGBolGxcVITEhJyorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGjAlICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/YAAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxMSEhUSEhMVFhUXGBUVGBUYGBYYFxUWFxgXFhUYGBgYHyggGBolGxcVITEhJyorLi4uFx8zODMtNygtLisBCgoKDg0OGhAQGjAlICUtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLf/AABEIALIBHAMBIgACEQEDEQH/fgfH"
                alt="Rori Hotel Luxury Bedroom"
                className="w-full h-auto aspect-[4/3] object-cover rounded-xl transform transition-transform duration-700 group-hover:scale-105"
                loading="eager"
                referrerPolicy="no-referrer"
              />
              
              {/* Luxury Frame Label Overlay */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-black/80 backdrop-blur-md p-3 rounded-lg border border-gold/30">
                <span className="text-[9px] tracking-[0.25em] text-gold font-black uppercase font-sans">Royal Sanctuary Suite</span>
                <p className="text-white text-xs font-serif font-semibold mt-0.5">Premier Luxury Mockup Experience</p>
              </div>

            </div>

          </div>

        </div>
      </section> {/* End SECTION ONE: Hero component wrapper closures */}


      {/* SECTION TWO — Fullscreen scroll snap gallery. Add a comment saying this section shows one fullscreen department photo at a time and the user snaps between them by scrolling. */}
      {/* SECTION TWO: Fullscreen Interactive scroll snapping slideshow gallery */}
      <div className="snap-container"> {/* Container bounding full height sliding slots allowing user interactions scroll snap mandatory limits */}
        {/* Slide 1: Front Office Department Segment */}
        <div className="snap-slide bg-gradient-to-br from-[#12110e] via-[#1b1915] to-[#12110e] flex items-center justify-center p-6 md:p-14 relative overflow-hidden"> {/* Define first gallery slide item layout with custom dark luxury espresso gradient */}
          {/* Subtle light/gold ambient radial glow in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/10 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

          <div className="max-w-[1100px] w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center z-20"> {/* Responsive 2-column split layout */}
            {/* Left Column: Premium Text Narratives & Stats Info */}
            <div className="text-left flex flex-col justify-center space-y-6">
              <span className="text-gold uppercase tracking-[0.35em] text-xs font-black font-sans">Department 01</span>
              <div className="space-y-3">
                <h2 className="text-white font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                  Front Office
                </h2>
                <div className="w-24 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent rounded-full shadow-[0_0_10px_rgba(201,168,76,0.8)]"></div>
              </div>
              <p className="text-white/85 text-xs sm:text-sm md:text-base font-sans font-medium leading-relaxed max-w-md">
                The heart of guest experience. Apprentices master real-time booking channels, guest check-in automation, and lobby operations, establishing first-rate luxury hospitality benchmarks.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 bg-gold/15 border-2 border-gold/40 text-gold-light text-xs px-4 py-2 rounded-full font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(201,168,76,0.15)] hover:bg-gold/25 transition-all">
                  ✦ Elite Guest Reception Segment
                </span>
              </div>
            </div>

            {/* Right Column: Minimized Image styled as a 3D gallery item with golden shadows & 3D tilts */}
            <div className="flex justify-center items-center">
              <div 
                className="relative max-w-[440px] w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(201,168,76,0.35)] border-2 border-gold/50 transition-all duration-500 hover:scale-[1.05] hover:-rotate-1 cursor-pointer bg-charcoal group"
                style={{
                  transform: 'perspective(1000px) rotateY(-12deg) rotateX(8deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                {/* 3D element highlights */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img
                  src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&h=800&q=80"
                  alt="Front Office Department"
                  className="w-full h-full object-cover transition-transform duration-700 select-none group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 right-4 bg-[#14120f]/90 text-[10px] text-gold uppercase tracking-widest px-3 py-1.5 rounded-md border-2 border-gold/30 font-extrabold z-20 shadow-lg">
                  3D GALLERY PREVIEW
                </span>
              </div>
            </div>
          </div>
        </div> {/* Terminate Front Office slide module */}

        {/* Slide 2: Housekeeping Department Segment */}
        <div className="snap-slide bg-gradient-to-br from-[#101215] via-[#161a22] to-[#101215] flex items-center justify-center p-6 md:p-14 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/8 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

          <div className="max-w-[1100px] w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center z-20">
            {/* Left Column: Premium Text */}
            <div className="text-left flex flex-col justify-center space-y-6">
              <span className="text-gold uppercase tracking-[0.35em] text-xs font-black font-sans">Department 02</span>
              <div className="space-y-3">
                <h2 className="text-white font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                  Housekeeping
                </h2>
                <div className="w-24 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent rounded-full shadow-[0_0_10px_rgba(201,168,76,0.8)]"></div>
              </div>
              <p className="text-white/85 text-xs sm:text-sm md:text-base font-sans font-medium leading-relaxed max-w-md">
                Precision in every detail. Apprentices train in executive-class suite setups, laundry optimization, and luxury quality audits to guarantee immaculate hygiene protocols.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 bg-gold/15 border-2 border-gold/40 text-gold-light text-xs px-4 py-2 rounded-full font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(201,168,76,0.15)] hover:bg-gold/25 transition-all">
                  ✦ Impeccable Quality Standards
                </span>
              </div>
            </div>

            {/* Right Column: 3D gallery Card */}
            <div className="flex justify-center items-center">
              <div 
                className="relative max-w-[440px] w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(201,168,76,0.35)] border-2 border-gold/50 transition-all duration-500 hover:scale-[1.05] hover:rotate-1 cursor-pointer bg-charcoal group"
                style={{
                  transform: 'perspective(1000px) rotateY(12deg) rotateX(8deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhB01lGwI8nQvhkc9l3vVaKGMfD3y3-X-xoaJWWh-fiA&s=10"
                  alt="Housekeeping Department"
                  className="w-full h-full object-cover transition-transform duration-700 select-none group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 right-4 bg-[#14120f]/90 text-[10px] text-gold uppercase tracking-widest px-3 py-1.5 rounded-md border-2 border-gold/30 font-extrabold z-20 shadow-lg">
                  3D GALLERY PREVIEW
                </span>
              </div>
            </div>
          </div>
        </div> {/* Close Housekeeping slide elements blocks */}

        {/* Slide 3: Kitchen Department Segment */}
        <div className="snap-slide bg-gradient-to-br from-[#111311] via-[#181f18] to-[#111311] flex items-center justify-center p-6 md:p-14 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/8 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

          <div className="max-w-[1100px] w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center z-20">
            {/* Left Column */}
            <div className="text-left flex flex-col justify-center space-y-6">
              <span className="text-gold uppercase tracking-[0.35em] text-xs font-black font-sans">Department 03</span>
              <div className="space-y-3">
                <h2 className="text-white font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                  Kitchen
                </h2>
                <div className="w-24 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent rounded-full shadow-[0_0_10px_rgba(201,168,76,0.8)]"></div>
              </div>
              <p className="text-white/85 text-xs sm:text-sm md:text-base font-sans font-medium leading-relaxed max-w-md">
                Where flavour is crafted. Discover professional culinary techniques, premium hygiene standards, and world-class menu execution directed by our renowned corporate executive chefs.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 bg-gold/15 border-2 border-gold/40 text-gold-light text-xs px-4 py-2 rounded-full font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(201,168,76,0.15)] hover:bg-gold/25 transition-all">
                  ✦ Culinary Mastery Training
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex justify-center items-center">
              <div 
                className="relative max-w-[440px] w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(201,168,76,0.35)] border-2 border-gold/50 transition-all duration-500 hover:scale-[1.05] hover:-rotate-1 cursor-pointer bg-charcoal group"
                style={{
                  transform: 'perspective(1000px) rotateY(-12deg) rotateX(8deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img
                  src="https://i.pinimg.com/1200x/bd/9a/47/bd9a475244f128fffa78c6a6a953050d.jpg"
                  alt="Kitchen Department"
                  className="w-full h-full object-cover transition-transform duration-700 select-none group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 right-4 bg-[#14120f]/90 text-[10px] text-gold uppercase tracking-widest px-3 py-1.5 rounded-md border-2 border-gold/30 font-extrabold z-20 shadow-lg">
                  3D GALLERY PREVIEW
                </span>
              </div>
            </div>
          </div>
        </div> {/* Finish Kitchen slide layout grids */}

        {/* Slide 4: F&B Service Department Segment */}
        <div className="snap-slide bg-gradient-to-br from-[#151113] via-[#20181d] to-[#151113] flex items-center justify-center p-6 md:p-14 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/8 rounded-full blur-[140px] pointer-events-none animate-pulse"></div>

          <div className="max-w-[1100px] w-full grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center z-20">
            {/* Left Column */}
            <div className="text-left flex flex-col justify-center space-y-6">
              <span className="text-gold uppercase tracking-[0.35em] text-xs font-black font-sans">Department 04</span>
              <div className="space-y-3">
                <h2 className="text-white font-serif text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
                  F&B Service
                </h2>
                <div className="w-24 h-[3px] bg-gradient-to-r from-gold via-gold-light to-transparent rounded-full shadow-[0_0_10px_rgba(201,168,76,0.8)]"></div>
              </div>
              <p className="text-white/85 text-xs sm:text-sm md:text-base font-sans font-medium leading-relaxed max-w-md">
                Service as an art form. Master fine dining table etiquette, global beverage selection menus, sequence of service, and premier guest satisfaction milestones.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 bg-gold/15 border-2 border-gold/40 text-gold-light text-xs px-4 py-2 rounded-full font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(201,168,76,0.15)] hover:bg-gold/25 transition-all">
                  ✦ Fine Dining & Service Etiquette
                </span>
              </div>
            </div>

            {/* Right Column */}
            <div className="flex justify-center items-center">
              <div 
                className="relative max-w-[440px] w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-[0_30px_70px_rgba(201,168,76,0.35)] border-2 border-gold/50 transition-all duration-500 hover:scale-[1.05] hover:rotate-1 cursor-pointer bg-charcoal group"
                style={{
                  transform: 'perspective(1000px) rotateY(12deg) rotateX(8deg)',
                  transformStyle: 'preserve-3d'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmt9nCTzYGRjAWxhCrt_IkvYWdDzYf6jIrAFUrCxDFyw&s=10"
                  alt="F&B Service Department"
                  className="w-full h-full object-cover transition-transform duration-700 select-none group-hover:scale-110"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-4 right-4 bg-[#14120f]/90 text-[10px] text-gold uppercase tracking-widest px-3 py-1.5 rounded-md border-2 border-gold/30 font-extrabold z-20 shadow-lg">
                  3D GALLERY PREVIEW
                </span>
              </div>
            </div>
          </div>
        </div> {/* Finalize F&B Service snap slider panel elements */}
      </div> {/* Close gallery snapping container division */}

      {/* SECTION THREE — Department cards with Vanilla Tilt. Add a comment saying this section shows 4 cards one per department with a 3D tilt effect on mouse hover. */}
      {/* SECTION THREE: High-contrast bento-grid cards layout featuring 3D tilt effects */}
      <section className="bg-[#0e0d0c] py-[120px] px-6 md:px-[60px] relative z-20"> {/* Frame dark colored backdrop to house interactive department catalog boards */}
        <div className="absolute inset-0 bg-[radial-gradient(#c9a84c_0.5px,transparent_0.5px)] [background-size:32px_32px] opacity-10 pointer-events-none"></div>

        {/* Card Header wrapper */}
        <div className="reveal max-w-2xl mx-auto text-center mb-16 relative"> {/* Enforce scroll animating classes and center layouts text strings */}
          <span className="text-gold uppercase tracking-[0.4em] text-xs font-black block mb-3">Our Core Portals</span>
          <h2 className="text-white text-4xl md:text-5xl font-serif font-black leading-tight mb-4 drop-shadow-md"> {/* Card grid main descriptive title heading */}
            Four Departments.<br />One Complete Experience. {/* Title strings showing system departments splits with line breaks */}
          </h2> {/* Terminate main headers panel */}
          <div className="w-16 h-1 bg-gold mx-auto my-4 rounded-full"></div>
          <p className="text-white/60 text-sm md:text-base font-sans font-medium"> {/* Subheading narrative indicator */}
            Explore the specialized divisions of Rori Hotel. Select your training track and elevate your careers. {/* Short caption description advising trainees */}
          </p> {/* Terminate subheading paragraph blocks */}
        </div> {/* Finish scroll animation reveal containers wrappers */}

        {/* Bento Grid wrapper for department catalog cards elements */}
        {/* Below the heading create a grid div. On mobile it is 1 column. On tablet it is 2 columns. On desktop it is 4 columns. Gap of 24 pixels. Maximum width 1200 pixels centered. Add a comment. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-[1200px] mx-auto"> {/* Formulate responsive layout structures to organize card rows */}
          
          {/* Card 1: Front Office Department Catalog Details */}
          <div
            data-tilt
            className="bg-[#181613]/90 border border-gold/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-gold/60 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(201,168,76,0.25)] group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* First section is the card image. Give it height of 52 and overflow hidden. */}
            <div className="h-52 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
              <img
                src="https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&h=800&q=80"
                alt="Front Office Service"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Second section is the card body with padding of 24 pixels. */}
            <div className="p-6 text-left relative z-20">
              <span className="text-gold font-bold uppercase tracking-widest text-[10px]">Department 01</span>
              <h3 className="text-white font-serif font-bold text-xl mt-1.5 mb-2 group-hover:text-gold transition-colors duration-200">Front Office</h3>
              <p className="text-white/70 text-sm leading-relaxed font-sans font-medium">
                Guest relations, digital reservations, and elite check-in automation.
              </p>
            </div>
          </div>

          {/* Card 2: Housekeeping Department Catalog Details */}
          <div
            data-tilt
            className="bg-[#181613]/90 border border-gold/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-gold/60 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(201,168,76,0.25)] group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* First section is the card image. Give it height of 52 and overflow hidden. */}
            <div className="h-52 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQhB01lGwI8nQvhkc9l3vVaKGMfD3y3-X-xoaJWWh-fiA&s=10"
                alt="Housekeeping Service"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Second section is the card body with padding of 24 pixels. */}
            <div className="p-6 text-left relative z-20">
              <span className="text-gold font-bold uppercase tracking-widest text-[10px]">Department 02</span>
              <h3 className="text-white font-serif font-bold text-xl mt-1.5 mb-2 group-hover:text-gold transition-colors duration-200">Housekeeping</h3>
              <p className="text-white/70 text-sm leading-relaxed font-sans font-medium">
                Executive room setups, linen logistics, and premium comfort audits.
              </p>
            </div>
          </div>

          {/* Card 3: Kitchen Department Catalog Details */}
          <div
            data-tilt
            className="bg-[#181613]/90 border border-gold/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-gold/60 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(201,168,76,0.25)] group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* First section is the card image. Give it height of 52 and overflow hidden. */}
            <div className="h-52 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
              <img
                src="https://i.pinimg.com/1200x/bd/9a/47/bd9a475244f128fffa78c6a6a953050d.jpg"
                alt="Kitchen Culinary Service"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Second section is the card body with padding of 24 pixels. */}
            <div className="p-6 text-left relative z-20">
              <span className="text-gold font-bold uppercase tracking-widest text-[10px]">Department 03</span>
              <h3 className="text-white font-serif font-bold text-xl mt-1.5 mb-2 group-hover:text-gold transition-colors duration-200">Kitchen</h3>
              <p className="text-white/70 text-sm leading-relaxed font-sans font-medium">
                Gastronomy, professional cuisine preparation, and sanitation hygiene.
              </p>
            </div>
          </div>

          {/* Card 4: F&B Service Department Catalog Details */}
          <div
            data-tilt
            className="bg-[#181613]/90 border border-gold/20 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:border-gold/60 hover:-translate-y-2 hover:shadow-[0_25px_60px_-15px_rgba(201,168,76,0.25)] group"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* First section is the card image. Give it height of 52 and overflow hidden. */}
            <div className="h-52 overflow-hidden relative">
              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300 z-10"></div>
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmt9nCTzYGRjAWxhCrt_IkvYWdDzYf6jIrAFUrCxDFyw&s=10"
                alt="F&B Service"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Second section is the card body with padding of 24 pixels. */}
            <div className="p-6 text-left relative z-20">
              <span className="text-gold font-bold uppercase tracking-widest text-[10px]">Department 04</span>
              <h3 className="text-white font-serif font-bold text-xl mt-1.5 mb-2 group-hover:text-gold transition-colors duration-200">F&B Service</h3>
              <p className="text-white/70 text-sm leading-relaxed font-sans font-medium">
                Table manners, premium wine services, and guest experience cycles.
              </p>
            </div>
          </div>

        </div> {/* Terminate responsive catalog grid box elements */}
      </section> {/* Finish SECTION THREE: Bento grid card system definitions */}

      {/* SECTION FOUR — Call to action section. Add a comment saying this is the final section encouraging students to apply. */}
      {/* SECTION FOUR: Final call to action section encouraging potential new applicants */}
      <section className="bg-[#f0eade] py-24 px-6 relative z-20 overflow-hidden"> {/* Apply soft ivory beige backgrounds and generous padding offset blocks */}
        <div className="absolute inset-0 bg-[radial-gradient(#c9a84c_0.5px,transparent_0.5px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

        <div className="reveal max-w-4xl mx-auto px-6 py-14 md:py-20 rounded-3xl bg-gradient-to-b from-[#fdfbf7] to-[#f4f0e7] border-2 border-gold/25 shadow-[0_25px_60px_rgba(201,168,76,0.06)] flex flex-col items-center relative z-10 text-center"> {/* Bind intersection reveal animations class on center container */}
          <div className="text-gold text-2xl mb-4 tracking-[0.25em] font-sans font-bold">✦ ✦ ✦</div>
          <span className="text-gold uppercase tracking-[0.3em] text-xs font-black block mb-2">Join Rori Hotel</span>
          <h2 className="text-charcoal text-3xl sm:text-4xl md:text-5xl font-serif font-black leading-tight mb-5 drop-shadow-xs max-w-2xl"> {/* Heading text blocks with premium sizes */}
            Ready to Begin Your Hospitality Journey? {/* Header question title string prompting potential applicants */}
          </h2> {/* Terminate section heading elements */}
          <p className="text-charcoal-light text-sm md:text-base font-sans font-semibold mb-8 max-w-md leading-relaxed"> {/* Body description informational details */}
            Our elite internship program equips aspiring professionals with standard-setting technical routines in Hawassa's most prestigious luxury hotel. {/* Trainees recruitment directions message indicator lines */}
          </p> {/* Terminate sub-paragraph label */}
          <Link
            to="/register"
            className="inline-block bg-gold hover:bg-gold-light text-charcoal uppercase tracking-widest text-xs font-black py-4 px-10 rounded-md shadow-lg shadow-gold/20 transition-all duration-300 transform hover:-translate-y-0.5 text-center"
          >
            Apply for Internship
          </Link>
        </div> {/* Terminate reveal action layout boxes */}
      </section> {/* Complete SECTION FOUR: Trainees campaign call components */}

      {/* SECTION FIVE — Footer. Add a comment saying this is the simple footer at the bottom of the home page. */}
      {/* SECTION FIVE: Standard public information web footer */}
      <footer id="footer" className="bg-[#121110] px-6 py-14 text-center text-white relative z-20 border-t border-gold/15"> {/* Create dark charcoal bottom section containing copyright labels */}
        <div className="max-w-4xl mx-auto flex flex-col items-center space-y-6"> {/* Stack visual typography lines inside vertical columns spacing blocks */}
          <div className="flex flex-col items-center space-y-2">
            <h4 className="font-serif text-2xl font-bold tracking-widest text-gold text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-light to-white">Rori Hotel</h4> {/* Small styled title badge */}
            <p className="text-xs tracking-wider uppercase font-semibold text-white/80"> {/* Paragraph detailing system status */}
              Rori Hotel Internship Management System {/* Caption detailing ERP softwares scope references */}
            </p> {/* Close system title label tag */}
            <p className="text-[11px] text-white/40 tracking-[0.3em] uppercase mt-1"> {/* Secondary geographic location line */}
              Hawassa, Ethiopia {/* Text indicating property location */}
            </p> {/* Terminate geographic paragraph handles */}
          </div>

          {/* Social Media & Direct Contact Info Section */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 justify-center py-2 text-xs text-white/70 font-sans border-y border-white/5 w-full max-w-2xl">
            <a 
              href="tel:+251462214343" 
              className="hover:text-gold transition-colors duration-350 flex items-center gap-2 group"
              title="Give us a call"
            >
              <Phone size={13} className="text-gold group-hover:scale-110 transition-transform duration-300" />
              <span>+251 462 214 343</span>
            </a>
            <a 
              href="mailto:apprentice@rorihotel.com" 
              className="hover:text-gold transition-colors duration-350 flex items-center gap-2 group"
              title="Send Us an Email"
            >
              <Mail size={13} className="text-gold group-hover:scale-110 transition-transform duration-300" />
              <span>apprentice@rorihotel.com</span>
            </a>
          </div>

          {/* Interactive Social Media Badges */}
          <div className="flex items-center gap-4 py-1">
            <a 
              href="https://facebook.com/rorihotel" 
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/40 flex items-center justify-center text-white/80 hover:text-gold hover:shadow-[0_0_15px_rgba(201,168,76,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
              target="_blank" 
              rel="noopener noreferrer"
              title="Facebook Profile"
            >
              <Facebook size={16} />
            </a>
            <a 
              href="https://instagram.com/rorihotel" 
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/40 flex items-center justify-center text-white/80 hover:text-gold hover:shadow-[0_0_15px_rgba(201,168,76,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
              target="_blank" 
              rel="noopener noreferrer"
              title="Instagram Official"
            >
              <Instagram size={16} />
            </a>
            <a 
              href="https://linkedin.com/company/rorihotel" 
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/40 flex items-center justify-center text-white/80 hover:text-gold hover:shadow-[0_0_15px_rgba(201,168,76,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
              target="_blank" 
              rel="noopener noreferrer"
              title="LinkedIn Institutional"
            >
              <Linkedin size={16} />
            </a>
            <a 
              href="https://t.me/rorihotel" 
              className="w-9 h-9 rounded-full bg-white/5 hover:bg-gold/15 border border-white/10 hover:border-gold/40 flex items-center justify-center text-white/80 hover:text-gold hover:shadow-[0_0_15px_rgba(201,168,76,0.25)] transition-all duration-300 transform hover:-translate-y-0.5"
              target="_blank" 
              rel="noopener noreferrer"
              title="Telegram Channel"
            >
              <Send size={16} />
            </a>
          </div>

          <div className="w-16 h-[1px] bg-gold/15 my-1"></div> {/* Horizontal separating lines decoration details */}
          <p className="text-[10px] text-white/30 font-sans tracking-widest uppercase"> {/* Main copyright label lines text */}
            &copy; {new Date().getFullYear()} Rori Hotel. All rights reserved. {/* Copyright logo outputting current year automatically */}
          </p> {/* Close copyright label tags */}
        </div> {/* Terminate centered column panels stacks wrappers */}
      </footer> {/* Complete SECTION FIVE: Web footer components layout definitions lists */}
    </div> // Finish landing layouts container divisions.
  ); // Return primary code layouts structures.
}; // Complete Home functional components.

export default Home; // Present completed Home dynamic view as the default export of this module.
