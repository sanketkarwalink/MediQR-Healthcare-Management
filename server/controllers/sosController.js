import dotenv from "dotenv";
import User from "../models/User.js";
import MedicalData from "../models/MedicalData.js";
import insuranceSchema from "../models/insuranceSchema.js";
import nodemailer from "nodemailer";

dotenv.config();

// Function to get city name from coordinates using reverse geocoding
const getCityFromCoordinates = async (lat, lon) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10&addressdetails=1`);
    const data = await response.json();
    
    if (data && data.address) {
      // Try to get city from various possible fields
      const city = data.address.city || 
                   data.address.town || 
                   data.address.village || 
                   data.address.municipality ||
                   data.address.state_district ||
                   data.address.county;
      
      console.log(`📍 Reverse geocoding: ${city || 'Unknown'}`);
      return city ? city.toLowerCase().trim() : null;
    }
    
    return null;
  } catch (error) {
    console.error('❌ Reverse geocoding failed:', error.message);
    return null;
  }
};

// Cache for city coordinates to avoid repeated API calls
const cityCoordinatesCache = new Map();

// Function to get city coordinates using geocoding API
const getCityCoordinates = async (cityName) => {
  const cityKey = cityName.toLowerCase().trim();
  
  // Check cache first
  if (cityCoordinatesCache.has(cityKey)) {
    console.log(`📍 Using cached coordinates for: ${cityName}`);
    return cityCoordinatesCache.get(cityKey);
  }
  
  try {
    // Using OpenStreetMap Nominatim API for geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(cityName)}&countrycodes=in&limit=1&addressdetails=1`
    );
    const data = await response.json();
    
    if (data && data.length > 0) {
      const coords = {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon)
      };
      
      // Cache the result for future use
      cityCoordinatesCache.set(cityKey, coords);
      console.log(`📍 Fetched coordinates for ${cityName}`);
      return coords;
    }
    
    console.log(`⚠️ No coordinates found for city: ${cityName}`);
    return null;
  } catch (error) {
    console.error(`❌ Failed to get coordinates for ${cityName}:`, error.message);
    return null;
  }
};

// Function to calculate distance between two cities using their coordinates
const calculateDistanceBetweenCities = async (userLat, userLon, contactCity) => {
  if (!contactCity || !userLat || !userLon) {
    console.log("⚠️ Missing city name or user coordinates");
    return 50; // Default distance for missing data
  }

  // Get coordinates for the contact's city
  const cityCoords = await getCityCoordinates(contactCity);
  
  if (!cityCoords) {
    console.log(`⚠️ Could not get coordinates for city: ${contactCity}, using default distance`);
    return 50; // Default distance if city coordinates not found
  }

  // Calculate distance using Haversine formula
  const R = 6371; // Earth's radius in kilometers
  const dLat = (cityCoords.lat - userLat) * Math.PI / 180;
  const dLon = (cityCoords.lon - userLon) * Math.PI / 180;
  
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(userLat * Math.PI / 180) * Math.cos(cityCoords.lat * Math.PI / 180) *
            Math.sin(dLon/2) * Math.sin(dLon/2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R * c; // Distance in kilometers
  
  console.log(`📏 Distance: ${Math.round(distance)}km`);
  return Math.round(distance);
};

// Enhanced function to determine the best emergency contact
const getBestEmergencyContact = async (contacts, userLat, userLon) => {
  if (!userLat || !userLon) {
    // If no location, just use existing priority
    console.log("📍 No location available, using priority-based selection");
    return contacts.sort((a, b) => a.priority - b.priority)[0];
  }

  // Get user's current city using reverse geocoding
  const userCity = await getCityFromCoordinates(userLat, userLon);
  console.log(`📍 User's current location: ${userCity || 'Unknown city'} (${userLat}, ${userLon})`);

  // Calculate scores for each contact (lower score = better)
  const contactsWithScores = await Promise.all(
    contacts.map(async (contact, index) => {
      let distance = 50; // Default distance for unknown cities
      let isExactMatch = false;
      
      if (contact.city && userCity) {
        // Check if user is in the same city as contact
        if (contact.city.toLowerCase().trim() === userCity) {
          distance = 0; // Same city = 0 distance
          isExactMatch = true;
          console.log(`✅ Exact city match found: ${contact.name} in ${contact.city}`);
        } else {
          // Calculate distance between cities
          distance = await calculateDistanceBetweenCities(userLat, userLon, contact.city);
        }
      }
      
      // Enhanced scoring: 
      // - Priority weight: 100 (higher priority = lower number = better)
      // - Distance weight: 1 (closer = better)
      // - Same city bonus: -25 (significant advantage for same city)
      const priorityScore = contact.priority * 100;
      const distanceScore = distance;
      const sameCityBonus = isExactMatch ? -25 : 0;
      const totalScore = priorityScore + distanceScore + sameCityBonus;
      
      return {
        name: contact.name,
        phone: contact.phone,
        email: contact.email,
        relation: contact.relation,
        city: contact.city,
        priority: contact.priority,
        userCity: userCity,
        distance: distance,
        isExactMatch: isExactMatch,
        score: totalScore,
        scoreBreakdown: {
          priority: priorityScore,
          distance: distanceScore,
          sameCityBonus: sameCityBonus,
          total: totalScore
        }
      };
    })
  );

  // Sort by score (lowest first = best)
  contactsWithScores.sort((a, b) => a.score - b.score);
  
  console.log("� Emergency contact analysis:");
  contactsWithScores.forEach((contact, index) => {
    console.log(`  ${index + 1}. ${contact.name}:`);
    console.log(`     📍 City: ${contact.city || 'Not specified'} ${contact.isExactMatch ? '(SAME AS USER!)' : ''}`);
    console.log(`     🏆 Priority: ${contact.priority}`);
    console.log(`     📏 Distance: ${contact.distance}km`);
    console.log(`     🎯 Score: ${contact.score} (lower = better)`);
    console.log(`     📊 Breakdown: Priority(${contact.scoreBreakdown.priority}) + Distance(${contact.scoreBreakdown.distance}) + Bonus(${contact.scoreBreakdown.sameCityBonus}) = ${contact.scoreBreakdown.total}`);
  });

  const selectedContact = contactsWithScores[0];
  console.log(`🎯 SELECTED: ${selectedContact.name} (Score: ${selectedContact.score})`);
  
  return selectedContact;
};

// Setup transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendSOSAlert = async (req, res) => {
  try {
      const { userId, latitude, longitude } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "User ID is required" });
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(400).json({ message: "User Not found!" });
      }

      const medicalInfo = await MedicalData.findOne({ userId });
      const insuranceInfo = await insuranceSchema.findOne({ userId });

      if (!medicalInfo || !medicalInfo.emergencyContact?.length) {
        return res.status(400).json({ message: "No emergency contacts found!" });
      }

      const sortedContacts = medicalInfo.emergencyContact.sort((a, b) => a.priority - b.priority);

      // Get the best emergency contact based on location + priority
      const bestContact = await getBestEmergencyContact(medicalInfo.emergencyContact, latitude, longitude);

      console.log("📞 FINAL SELECTION:", {
        name: bestContact.name,
        contactCity: bestContact.city,
        userCity: bestContact.userCity,
        priority: bestContact.priority,
        distance: bestContact.distance,
        isExactMatch: bestContact.isExactMatch,
        score: bestContact.score,
        reason: latitude && longitude ? 
          (bestContact.isExactMatch ? 'Same city + High priority' : 'Location + Priority optimized') : 
          'Priority based only'
      });
      console.log("📤 Sending Emergency Email Alerts...");

      // Send email alerts
      let emailsSent = 0;
      
      // Send to insurance provider if email exists
      if (insuranceInfo && insuranceInfo.email) {
        await transporter.sendMail({
          to: insuranceInfo.email,
          subject: `Emergency Notification – Policyholder ${user.name}`,
          html: `
            <div style="font-family: 'Segoe UI', Tahoma, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #ccc;">
              <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">MediQR Insurance Alert</h2>
                <p style="margin: 4px 0 0 0; font-size: 13px;">Automated Notification System</p>
              </div>

              <div style="padding: 25px;">
                <p style="margin: 0 0 15px 0; color: #111827; font-size: 14px;">
                  This is to inform you that the policyholder <strong>${user.name}</strong> has triggered a real-time emergency alert through the MediQR platform.
                </p>

                <table style="width: 100%; font-size: 13px;">
                  <tr><td style="padding: 6px 0; font-weight: bold;">Name:</td><td>${user.name}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Policy Number:</td><td>${insuranceInfo.policyNumber || 'Not available'}</td></tr>
                  <tr><td style="padding: 6px 0; font-weight: bold;">Time of Alert:</td><td>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</td></tr>
                </table>

                ${latitude && longitude ? `
                  <p style="margin-top: 15px; font-size: 13px;">
                    <strong>Location:</strong> <a href="https://maps.google.com/?q=${latitude},${longitude}" style="color: #2563eb;">View Map</a>
                  </p>` : ''}

                <p style="margin-top: 20px; font-size: 13px; color: #374151;">
                  Please prepare to initiate emergency response procedures or pre-authorization if required. This is an automated notification and may be followed up by the hospital or family representatives.
                </p>
              </div>

              <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
                <p style="margin: 0;">Generated by MediQR Emergency Alert System</p>
                <p style="margin: 5px 0 0 0;">For authorized insurance use only</p>
              </div>
            </div>
          `,
          text: `INSURANCE NOTIFICATION

      Policyholder ${user.name} has triggered a real-time emergency alert.

      Name: ${user.name}
      Policy Number: ${insuranceInfo.policyNumber || 'Not available'}
      Time of Alert: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}
      ${latitude && longitude ? `Location: https://maps.google.com/?q=${latitude},${longitude}` : ''}

      Please initiate emergency claim handling or pre-authorization procedures as applicable.

      — MediQR Alert System`
        });

        emailsSent++;
        console.log("✅ Email sent to insurance provider:", insuranceInfo.email);
      }


      // Send to the selected best emergency contact
      if (bestContact.email) {
  // Send to Emergency Contact
  await transporter.sendMail({
    to: bestContact.email,
    subject: `Emergency Alert – ${user.name} requires assistance`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ccc; background-color: #ffffff;">
        <div style="background-color: #003366; color: white; padding: 16px;">
          <h2 style="margin: 0; font-size: 18px;">Emergency Notification</h2>
        </div>

        <div style="padding: 20px; font-size: 14px; color: #111827;">
          <p style="margin-bottom: 15px;">
            You are receiving this message because <strong>${user.name}</strong> has triggered a medical emergency alert and listed you as their primary emergency contact.
          </p>

          <h4 style="margin: 20px 0 5px 0; font-size: 15px;">User Information</h4>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 6px 0; font-weight: bold;">Name:</td><td>${user.name}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Phone:</td><td>${user.phone || 'Not available'}</td></tr>
          </table>

          ${latitude && longitude ? `
            <h4 style="margin: 20px 0 5px 0; font-size: 15px;">Last Known Location</h4>
            <p style="margin-bottom: 8px;">
              <a href="https://maps.google.com/?q=${latitude},${longitude}" style="color: #1d4ed8;">Click to open in Google Maps</a>
            </p>
            <p style="font-size: 13px; color: #4b5563;">Coordinates: ${latitude}, ${longitude}</p>
          ` : `
            <h4 style="margin: 20px 0 5px 0; font-size: 15px;">Location</h4>
            <p style="color: #6b7280;">Location not available</p>
          `}

          <h4 style="margin: 20px 0 5px 0; font-size: 15px;">Contact Relevance</h4>
          <table style="width: 100%; font-size: 14px;">
            <tr><td style="padding: 6px 0; font-weight: bold;">Priority:</td><td>${bestContact.priority}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Your Location:</td><td>${bestContact.city || 'Unknown'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Distance from user:</td><td>${bestContact.distance !== 'Unknown' ? `${bestContact.distance} km` : 'Unknown'}</td></tr>
            <tr><td style="padding: 6px 0; font-weight: bold;">Selection Basis:</td><td>${latitude && longitude ? 'Proximity + Priority' : 'Priority Only'}</td></tr>
          </table>

          <h4 style="margin: 20px 0 5px 0; font-size: 15px;">What You Should Do</h4>
          <ol style="padding-left: 18px; font-size: 14px; color: #1f2937;">
            <li>Call ${user.name} immediately using their registered number.</li>
            <li>If unreachable, proceed to the shared location if available.</li>
            <li>Dial 108 (Ambulance) or 112 (Emergency) if urgent care is needed.</li>
            <li>Notify other close family members if possible.</li>
            <li>Stay with the user until medical assistance arrives.</li>
          </ol>
        </div>

        <div style="background-color: #f3f4f6; padding: 16px; text-align: center; font-size: 12px; color: #6b7280;">
          <p style="margin: 0;">Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</p>
          <p style="margin: 4px 0 0 0;">MediQR Emergency Response System</p>
          <p style="margin: 4px 0 0 0;">This is an automated message. Please respond promptly.</p>
        </div>
      </div>
    `,
    text: `EMERGENCY ALERT

      ${user.name} has triggered a medical emergency alert and listed you as their primary contact.

      Name: ${user.name}
      Phone: ${user.phone || 'Not available'}

      Location: ${latitude && longitude ? `https://maps.google.com/?q=${latitude},${longitude}` : 'Not available'}
      Coordinates: ${latitude && longitude ? `${latitude}, ${longitude}` : 'Not available'}

      Your Priority Level: ${bestContact.priority}
      Your Location: ${bestContact.city || 'Unknown'}
      Distance from User: ${bestContact.distance || 'Unknown'}
      Selection Basis: ${latitude && longitude ? 'Proximity + Priority' : 'Priority Only'}

      RECOMMENDED ACTIONS:
      1. Call ${user.name} immediately.
      2. If unreachable, proceed to the location above.
      3. Dial 108 (Ambulance) or 112 (Emergency) if needed.
      4. Notify family if necessary.
      5. Stay with the user until help arrives.

      Generated on: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}

      MediQR Emergency Notification System
      This is an automated message. Please take action immediately.`
        });

        emailsSent++;
        console.log("✅ Email sent to best emergency contact:", bestContact.email);
      }

      if (emailsSent === 0) {
        console.log("⚠️ No email addresses found for alerts");
        return res.status(200).json({ 
          message: "SOS alert processed but no email addresses available for notification", 
          warning: "Consider adding email addresses to emergency contacts" 
        });
      }

      return res.status(200).json({ 
        message: `SOS email alerts sent successfully to ${emailsSent} recipient(s)`,
        details: {
          emailsSent,
          totalAlerts: emailsSent
        }
      });

  } catch (error) {
      console.error("❌ SOS Alert API Error:", error);
      return res.status(500).json({ message: "Failed to send SOS alerts", error: error.message });
  }
};