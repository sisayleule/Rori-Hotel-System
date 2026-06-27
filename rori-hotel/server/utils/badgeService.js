// This file calculates achievement badges earned by students based on their internship performance and activities.
// Badges provide recognition for excellence, consistent performance, and active participation in journal writing and feedback.
// Function accepts finalResult object and returns array of badge objects with name, emoji, description, and color.
function calculateBadges(finalResult) { // Define calculateBadges function accepting finalResult parameter containing scores and student data.
  const badges = []; // Initialize empty array to store earned badges.
  const { overallScore, departmentScores, studentId } = finalResult; // Destructure needed fields from finalResult object.
  
  // Badge 1: Excellence Award - For students scoring 90 or above overall.
  if (overallScore >= 90) { // Check if overall score meets excellence threshold of 90.
    badges.push({ // Add excellence badge to badges array.
      name: 'Excellence Award', // Badge name displayed to student.
      emoji: '🏆', // Trophy emoji representing top achievement.
      description: 'Achieved an outstanding overall score of 90 or above', // Description explaining why badge was earned.
      color: '#C9A84C' // Gold color hex code matching Rori Hotel brand color.
    }); // Close badge object.
  } // Close excellence award check.
  
  // Badge 2: High Achiever - For students scoring between 80 and 89 overall.
  if (overallScore >= 80 && overallScore < 90) { // Check if score is in high achiever range.
    badges.push({ // Add high achiever badge to array.
      name: 'High Achiever', // Badge name.
      emoji: '⭐', // Star emoji for high performance.
      description: 'Demonstrated high performance with a score between 80-89', // Badge description.
      color: '#4CAF50' // Green color hex code for success theme.
    }); // Close badge object.
  } // Close high achiever check.
  
  // Badge 3: Department Star - For students who scored 95 or above in at least one department.
  if (departmentScores && departmentScores.length > 0) { // Check if department scores exist.
    const hasDepartmentStar = departmentScores.some(dept => dept.score >= 95); // Check if any department score is 95 or higher using array.some.
    if (hasDepartmentStar) { // If department star condition is met.
      badges.push({ // Add department star badge.
        name: 'Department Star', // Badge name.
        emoji: '🌟', // Shooting star emoji for exceptional department performance.
        description: 'Excelled with a score of 95 or above in at least one department', // Badge description.
        color: '#9C27B0' // Purple color hex code for special achievement.
      }); // Close badge object.
    } // Close department star conditional.
  } // Close department scores check.
  
  // Badge 4: All Round Performer - For students who scored 70 or above in ALL four departments.
  if (departmentScores && departmentScores.length === 4) { // Check if all 4 department scores exist.
    const allAbove70 = departmentScores.every(dept => dept.score >= 70); // Check if every department score is 70 or higher using array.every.
    if (allAbove70) { // If all departments meet threshold.
      badges.push({ // Add all round performer badge.
        name: 'All Round Performer', // Badge name.
        emoji: '👑', // Crown emoji for comprehensive excellence.
        description: 'Scored 70 or above in all four department rotations', // Badge description.
        color: '#2196F3' // Blue color hex code for consistent performance.
      }); // Close badge object.
    } // Close all round performer conditional.
  } // Close all departments check.
  
  // Badge 5: Dedicated Journalist - For students who wrote 5 or more journal entries.
  // This badge requires journal count which should be passed in finalResult or calculated separately.
  if (finalResult.journalCount && finalResult.journalCount >= 5) { // Check if student wrote 5 or more journal entries.
    badges.push({ // Add dedicated journalist badge.
      name: 'Dedicated Journalist', // Badge name.
      emoji: '📓', // Notebook emoji for writing dedication.
      description: 'Documented internship journey with 5 or more journal entries', // Badge description.
      color: '#2C2C2C' // Charcoal color hex code matching sidebar theme.
    }); // Close badge object.
  } // Close journal badge check.
  
  // Badge 6: Full Rotation Champion - For students who completed all 4 department rotations.
  // This checks if student completed all departments in their rotation.
  if (finalResult.completedDepartments && finalResult.completedDepartments.length === 4) { // Check if student completed all 4 departments.
    badges.push({ // Add full rotation champion badge.
      name: 'Full Rotation Champion', // Badge name.
      emoji: '🥇', // Gold medal emoji for completing full cycle.
      description: 'Successfully completed all four department rotations', // Badge description.
      color: '#FFD700' // Gold color hex code for completion achievement.
    }); // Close badge object.
  } // Close rotation completion check.
  
  // Badge 7: Constructive Voice - For students who submitted at least one recommendation feedback.
  // This badge requires feedback count which should be passed in finalResult or calculated separately.
  if (finalResult.feedbackCount && finalResult.feedbackCount >= 1) { // Check if student submitted at least 1 feedback.
    badges.push({ // Add constructive voice badge.
      name: 'Constructive Voice', // Badge name.
      emoji: '📢', // Megaphone emoji for providing feedback.
      description: 'Contributed valuable feedback and recommendations', // Badge description.
      color: '#00BCD4' // Teal color hex code for contribution theme.
    }); // Close badge object.
  } // Close feedback badge check.
  
  console.log('[Badge Service] Calculated', badges.length, 'badges for result:', finalResult._id); // Log number of badges earned.
  return badges; // Return array of earned badge objects.
} // Close calculateBadges function.

// Export calculateBadges function for use in scores routes and result display components.
module.exports = { calculateBadges }; // Export as named export in object.
