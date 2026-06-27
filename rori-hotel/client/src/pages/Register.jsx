// This file implements the real dynamic Register page for student interns to register and submit their portfolios files.
// It generates FormData containing credentials text fields, user profile photos, and approval letters before posting to backend APIs.
import React, { useState } from 'react'; // Import state hooks from React to handle user input parameters and uploads.
import { useNavigate, Link } from 'react-router-dom'; // Import router utilities to manage address path redirection updates.
import api from '../utils/api'; // Import pre-configured Axios endpoint configurations to transmit FormData profiles payloads.
const Register = () => { // Construct the main functional code component declaration representing our Registration Page.
  const [fullName, setFullName] = useState(''); // State variable storing the student full name as typed inside form input files.
  const [email, setEmail] = useState(''); // State variable storing the student contact email address as inputted.
  const [password, setPassword] = useState(''); // State variable storing the student security password string value.
  const [phoneNumber, setPhoneNumber] = useState(''); // State variable storing the student mobile phone number.
  const [universityName, setUniversityName] = useState(''); // State variable storing the student university origin name as inputted.
  const [studentIdNumber, setStudentIdNumber] = useState(''); // State variable storing the student registration index or university catalog ID.
  const [departmentPreference, setDepartmentPreference] = useState(''); // State variable storing the chosen departmental operations department.
  const [profilePhoto, setProfilePhoto] = useState(null); // State variable storing the local profile image file object payload.
  const [internshipLetter, setInternshipLetter] = useState(null); // State variable storing the security credential PDF letter file upload.
  const [loading, setLoading] = useState(false); // State variable tracking ongoing network operations to display spinner graphics.
  const [error, setError] = useState(''); // State variable carrying real-time validation breakdowns or unexpected error codes.
  const [success, setSuccess] = useState(''); // State variable containing affirmative database registration success notifications text.
  const navigate = useNavigate(); // Store the standard routing controller reference pointer locally.
  const handleSubmit = async (event) => { // Define the main action submission controller that processes form fields on submit.
    event.preventDefault(); // Suspend original page-refresh browser activities to preserve reactive variables values.
    setLoading(true); // Switch loading variable state to true to block concurrent database write interactions.
    setError(''); // Clear stale diagnostic alerts by resetting the local warning data structure.
    setSuccess(''); // Flush previous successful notifications to accurately represent new transaction profiles.
    try { // Deploy defensive exception surveillance blocks to prevent runtime software crashes.
      const formData = new FormData(); // Initialize FormData container because we must upload file objects along with standard text characters.
      formData.append('fullName', fullName); // Insert the student full name text value into the transactional FormData payload.
      formData.append('email', email); // Insert the contact email address text item into the transactional FormData object.
      formData.append('password', password); // Append the typed password string safely to the FormData collection.
      formData.append('phoneNumber', phoneNumber); // Append the mobile phone number to the registration payload.
      formData.append('universityName', universityName); // Map the academic university title within the FormData properties tree.
      formData.append('studentIdNumber', studentIdNumber); // Bind the academic student registration number to the FormData list.
      formData.append('departmentPreference', departmentPreference); // Log selected department option values to the upload payload.
      if (profilePhoto) { // Check whether the profile image state currently references a valid file selection.
        formData.append('profilePhoto', profilePhoto); // Append the physical profile photograph thumbnail binary file to FormData assets.
      } // Terminate profile photo file pre-upload existence checks.
      if (internshipLetter) { // Verify if the student successfully imported their university authorization document.
        formData.append('internshipLetter', internshipLetter); // Embed the official approval PDF/Image document to the database transmission context.
      } // Terminate academic letter file pre-upload existence checks.
      await api.post('/auth/register', formData, { // Perform server POST calls with the constructed multipart FormData parameters.
        headers: { 'Content-Type': 'multipart/form-data' } // Define content category headers explicitly to enable multipart file decoding.
      }); // Close POST request execution sequence block.
      setSuccess('Registration successful. HR will review your application and contact you soon.'); // Supply positive registration confirmation text message.
      setFullName(''); // Reset name variables back to their initial empty string layouts to clear input forms.
      setEmail(''); // Reset email values back to original clean space setups.
      setPassword(''); // Wipe out security password text to defend client application views.
      setPhoneNumber(''); // Clear phone number input.
      setUniversityName(''); // Clear university name strings values on the browser UI display.
      setStudentIdNumber(''); // Clear student identification strings values to recycle form elements.
      setDepartmentPreference(''); // Reset select dropdown lists choice back to initial blank instructions.
      setProfilePhoto(null); // Flush profile image caches to release local browser system memory structures.
      setInternshipLetter(null); // Release document state files memory pointers safely from the active browser index.
      setTimeout(() => { // Launch a standard deferred macro-timer to execute redirection patterns smoothly.
        navigate('/login'); // Relocate newly registered interns cleanly to sign-in panels after 3 seconds.
      }, 3000); // Wait exactly 3000 milliseconds before firing up the standard login screen redirect.
    } catch (err) { // Handle exceptions or error states flagged by server response validators.
      const message = err.response && err.response.data && (err.response.data.message || err.response.data.error) ? (err.response.data.message || err.response.data.error) : 'registration failed please try again'; // Read relevant error strings or bind generic defaults.
      setError(message); // Supply informative alerts variables data directly into the warning state logs.
      setLoading(false); // Stop loading animations when exceptions take place to allow correction edits.
    } finally { // Finalize transaction loops lifecycle commands regardless of resolution codes.
      setLoading(false); // Make sure interactive fields are unlocked on operational conclusions.
    } // Complete defensive networking block boundaries.
  }; // Complete handleSubmit async function closures.
  return ( // Return styled JSX elements mapping dynamic layouts properties.
    <div className="min-h-screen bg-warm-beige flex flex-col items-center justify-center py-12 px-6 font-sans"> { /* Screen container featuring warm ivory backdrop layout */ }
      <div className="bg-white p-8 rounded-lg shadow-md max-w-lg w-full border border-gray-100 my-6 flex flex-col items-center justify-center"> { /* Central registration card wrapper box */ }
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQOV-RLrXND8-FBpTC0iS97VkHPjm_Kjj5zuD2wcyXwyw&s=10" 
          alt="Rori Hotel Logo" 
          className="w-16 h-16 object-contain rounded-full border border-gold/30 p-1 mb-4 shadow-sm" 
          referrerPolicy="no-referrer"
        />
        <h1 className="text-3xl font-bold text-charcoal mb-2 font-serif text-center">Trainee Registration</h1> { /* Primary serif typography screen heading info */ }
        <div className="text-xs font-semibold text-gold tracking-widest uppercase mb-4 text-center">Rori Hotel Internship Program</div> { /* Program golden tracking subtitle label */ }
        <div className="w-16 h-1 bg-gold mx-auto mb-6 rounded-full"></div> { /* Aesthetic elegant gold separation bar element graphic */ }
        {success && ( // Check if success notifications carry valid confirmation letters text state.
          <div className="bg-green-50 text-green-700 text-sm p-4 rounded mb-6 border border-green-100 text-left w-full"> { /* Success confirmation popups visual layout */ }
            {success} { /* Disperse affirmative success statements messages into view screen templates */ }
          </div> // Close successful validation alerts panels wrapper tags.
        )} { /* Stop success alerts blocks validations checks conditional structures */ }
        {error && ( // Inspect if error warnings states contains active error messages indexes.
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded mb-6 border border-red-100 text-left w-full"> { /* Failure notification alerts window display cards */ }
            {error} { /* Render caught transaction issues or database warnings text strings */ }
          </div> // Finish failure warning wrapper divisions blocks elements context.
        )} { /* Conclude error notification conditional validation structures block */ }
        <form onSubmit={handleSubmit} className="w-full space-y-4 text-left"> { /* Setup registration input values registry forms */ }
          <div> { /* Section layout formatting full name fields attributes */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Full Name</label> { /* Name descriptor visual title tag */ }
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all" placeholder="Enter your full legal name" /> { /* Input element capturing characters values */ }
          </div> { /* End individual form element section closures block */ }
          <div> { /* Section layout formatting email fields boundaries */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Email Address</label> { /* Email parameter labeling instructions */ }
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all" placeholder="Enter your active email address" /> { /* Primary character text capture node */ }
          </div> { /* End input element section wrapping blocks definitions */ }
          <div> { /* Section layout formatting telephone fields boundaries */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Phone Number (Optional)</label>
            <input type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all" placeholder="Enter your active phone number (e.g. +251...)" />
          </div>
          <div> { /* Field block section formatting passwords characters */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Password</label> { /* Password character tags descriptors labels */ }
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all" placeholder="Create a secure system password" /> { /* Hidden inputs masking secret credentials characters */ }
          </div> { /* End password inputs containers block subdivisions elements */ }
          <div> { /* Section wrap capturing academic university details */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">University Name</label> { /* University naming descriptive label tag */ }
            <input type="text" value={universityName} onChange={(e) => setUniversityName(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all" placeholder="Enter your university or college name" /> { /* String inputs targeting student academic origin */ }
          </div> { /* Close university inputs block sections wrapper panels */ }
          <div> { /* Section layout packing university index badges codes */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Student ID Number</label> { /* Student identification cards mapping labels */ }
            <input type="text" value={studentIdNumber} onChange={(e) => setStudentIdNumber(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent transition-all" placeholder="Enter your registration ID number" /> { /* Input capturing active enrollment serial codes */ }
          </div> { /* Close student badge number parameters wrappers divs */ }
          <div> { /* Section packing departmental operations choice selection arrays */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Primary Department Interest</label> { /* Renamed from Department Preference - this is informational only, actual department rotation order is set by HR during approval */ }
            <select value={departmentPreference} onChange={(e) => setDepartmentPreference(e.target.value)} required className="w-full border border-gray-300 rounded px-3 py-2 text-charcoal text-sm focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent bg-white transition-all cursor-pointer"> { /* Multi choice select menus node component */ }
              <option value="" disabled>Select your primary department interest</option> { /* Default instructional choice placeholder, disabled on selection lists */ }
              <option value="Front Office">Front Office</option> { /* Division option capturing reservations operational tracks */ }
              <option value="Housekeeping">Housekeeping</option> { /* Division option targeting hospitality sanitary care operations */ }
              <option value="Kitchen">Kitchen</option> { /* Division option directing to culinary development domains */ }
              <option value="F&B Service">F&B Service</option> { /* Division option prioritizing dining support frameworks */ }
            </select> { /* Close select menu options element */ }
          </div> { /* Finish operational department preference parameters wrapper */ }
          <div> { /* Section layout formatting student face profile photo imports */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Profile Photo — Images Only (Optional)</label> { /* Photo upload constraints and descriptors labels */ }
            <input type="file" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files[0])} className="w-full text-charcoal text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-charcoal hover:file:bg-deep-beige file:cursor-pointer cursor-allowed" /> { /* File input node targeted at image category formats */ }
          </div> { /* Conclude student avatar photo input wrap definitions */ }
          <div> { /* Section formatting official academic backing evaluation letters */ }
            <label className="block text-xs font-bold text-charcoal uppercase tracking-wider mb-1">Internship Approval Letter — PDF/Image Only (Optional)</label> { /* PDF/Image document uploads instructional label headers */ }
            <input type="file" accept="application/pdf,image/*" onChange={(e) => setInternshipLetter(e.target.files[0])} className="w-full text-charcoal text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-gray-100 file:text-charcoal hover:file:bg-deep-beige file:cursor-pointer cursor-pointer" /> { /* File input capturing academic compliance documentations PDF and images */ }
          </div> { /* Stop official letters files input wrapping layout block */ }
          <button type="submit" disabled={loading} className="w-full bg-gold hover:bg-gold-light text-charcoal font-bold uppercase tracking-widest text-xs py-3 rounded shadow transition-colors duration-300 disabled:opacity-50 mt-4 cursor-pointer"> { /* Submission trigger execution key button component */ }
            {loading ? 'Submitting Application...' : 'Submit Application'} { /* Switch buttons texts based on active HTTP transmission phases */ }
          </button> { /* Complete action submit buttons elements wrappers tag */ }
        </form> { /* Finish student application registration submission form structure */ }
        <div className="mt-8 pt-6 border-t border-gray-100 text-xs text-center space-y-2"> { /* Subview footers containing links indexes shortcuts */ }
          <div className="text-charcoal-light">Already have an account? <Link to="/login" className="text-gold font-bold hover:underline transition-all">Log in here</Link></div> { /* Navigational link referencing secure login systems templates */ }
          <div className="text-charcoal-light"><Link to="/" className="text-charcoal hover:text-gold font-medium transition-all hover:underline">Return to Home</Link></div> { /* Navigation link pointing home to public frontpages */ }
        </div> { /* Close footers container division block elements tags */ }
      </div> { /* Close primary registration form window cards divisions */ }
    </div> // Close overall screen background wrapper divs context container.
  ); // Return completed registration tags code lines structure.
}; // Complete functional component Register program code declaration closures.
export default Register; // Present compiled Register elements module as the default export of this program.
