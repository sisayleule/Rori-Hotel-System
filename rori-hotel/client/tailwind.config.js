/** @type {import('tailwindcss').Config} */ // Type declaration for Tailwind configuration metadata schema checks.
export default { // Export the Tailwind configuration module object using ES modules for CSS builders.
  content: [ // Array listing the files Tailwind should scan to find utility classes.
    "./index.html", // Scan the main HTML template entry point file.
    "./src/**/*.{js,ts,jsx,tsx}" // Scan all JS, JSX, TS, and TSX source files in src folder.
  ], // Close the files array content configurations.
  theme: { // Open the main custom design theme modification object system.
    extend: { // Open the theme extend section to keep default styles while adding ours.
      colors: { // Open custom colors palette configurations.
        "warm-beige": "#F5F0E8", // Main background ivory-cream color used for general page background.
        "deep-beige": "#E8DDD0", // Secondary earthy beige color used for alternative sections blocks.
        "charcoal": "#2C2C2C", // Primary thick charcoal slate color used for solid header text and dark backgrounds.
        "charcoal-light": "#4A4A4A", // Subtitle charcoal-light tint used to style standard body paragraphs comfortably.
        "gold": "#C9A84C", // Rich golden accent highlight color applied on key call to actions and select icons.
        "gold-light": "#E8C97A" // Bright gold-light tint used specifically for hover states feedback animations.
      } // Close the colors configuration object mappings.
    } // Close the extended options configuration block.
  }, // Close the main custom theme configuration object.
  plugins: [] // Specify active third party Tailwind CSS layout plugin packages.
}; // Terminate Tailwind configuration module exports mapping instruction.
