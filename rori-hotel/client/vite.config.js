import { defineConfig } from 'vite'; // Import the Vite configuration builder function to structure settings.
import react from '@vitejs/plugin-react'; // Import official Vite React plugin to support JSX compilation and hot reloads.
import path from 'path'; // Import standard Node filesystem path resolution module.

export default defineConfig({ // Export the Vite config helper containing specific build parameters.
  plugins: [react()], // Set up React compiler plugin for JSX evaluation.
  server: { // Customize development server settings.
    port: 3000, // Explicitly bind development server to port 3000 for frontend.
    host: '0.0.0.0' // Make the dev server bind to all host network interfaces.
    // Proxy removed - frontend talks directly to backend on port 5000 via baseURL in api.js instead of proxying through port 3000.
  }, // Close development server options configuration.
  resolve: { // Define import path mapping aliases.
    alias: { // Define custom folder shortcut path aliases.
      '@': path.resolve(__dirname, './src') // Map the "@" indicator shortcut target to the project src directory path.
    } // Close folder shortcut settings.
  } // Close directory resolver options.
}); // Terminate main defineConfig constructor instruct mapping.
