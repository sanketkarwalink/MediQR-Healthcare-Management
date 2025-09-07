# 🏥 MediQR - Healthcare Management System

A digital healthcare platform with **QR-based medical data sharing** for emergency situations. Built as a team project for Software Engineering at Thapar Institute of Engineering & Technology.

## 🚀 Quick Demo
```bash
# 1. Clone & Setup
git clone https://github.com/sanketkarwalink/MediQR-Healthcare-Management.git
cd MediQR-Healthcare-Management

# 2. Install Dependencies  
cd server && npm install
cd ../client && npm install

# 3. Environment Setup (IMPORTANT!)
cd ../server
cp .env.example .env
# Edit .env with your actual credentials (never commit this file!)

# 4. Start Application
node server.js    # Backend (Port 5000)
cd ../client && npm run dev       # Frontend (Port 5173)

# 5. Open: http://localhost:5173
```

## 🔒 Security Notice
- **Never commit `.env` files** containing real credentials
- **Use `.env.example`** as template for required environment variables
- **Always use app passwords** for email services (not your main password)
- **Follow the security guidelines** in `ENVIRONMENT_SETUP_GUIDE.md`

## 👥 Team & My Role

**Team Members:**
- **Riya Dudeja** - Project Lead, UI/UX Design, Frontend
- **Srishti Sharma** - Database Design, Testing, Documentation  
- **Saksham Garg** - Authentication, Security, Code Review
- **Sanket Karwa (Me)** - **QR Code System Developer** + **Location Services Developer**

## 🎯 My Specific Contributions

### 🔹 **QR Code Generation & Scanning System**
**What I Built:** Complete end-to-end QR functionality for medical data

**Technical Implementation:**
```javascript
// QR Generation (medicalController.js)
export const generateQRCode = async (userId) => {
    const qrUrl = `http://localhost:5173/qr-result/${userId}`;
    const qrCodeUrl = await QRCode.toDataURL(qrUrl);
    return qrCodeUrl;
};

// QR Scanning (QRScannerPage.jsx) 
const scanner = new Html5QrcodeScanner("qr-reader", {
    fps: 10, qrbox: { width: 250, height: 250 }
});
```

**Real-World Impact:**
- 🚑 **Emergency Access:** Scan patient QR → Get medical data in 2 seconds
- 🩸 **Critical Info:** Blood type, allergies, medications instantly available
- 📱 **Universal:** Works with any smartphone QR scanner

### 🔹 **Location Detection System**
**What I Built:** GPS-based healthcare facility finder

**Technical Implementation:**
```javascript
// Location Services (sosController.js)
const getCityFromCoordinates = async (lat, lon) => {
    const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
    );
    return response.json();
};
```

**Real-World Impact:**
- 🗺️ **Smart Emergency:** Automatically finds nearest hospitals
- 📍 **Location-Based Alerts:** Sends emergency info to contacts in same city
- 🏥 **Healthcare Finder:** 2-3km radius hospital discovery

## 🛠️ Tech Stack
- **Frontend:** React.js, Vite, TailwindCSS
- **Backend:** Node.js, Express.js, MongoDB
- **QR System:** qrcode.js, html5-qrcode
- **Location:** OpenStreetMap Nominatim API
- **Authentication:** JWT, bcrypt

## ✨ Key Features

### � **Core System (Team Effort)**
- ✅ Patient registration & login
- ✅ Medical records management  
- ✅ Emergency contact management
- ✅ Insurance data storage
- ✅ Email notifications

### 🎯 **My QR Code System**
- ✅ **QR Generation:** Creates unique medical QR codes
- ✅ **QR Scanning:** Camera-based real-time scanning
- ✅ **Emergency Access:** No-login medical data display
- ✅ **Mobile Optimized:** Works on all devices

### 🎯 **My Location System**  
- ✅ **GPS Detection:** Automatic location finding
- ✅ **Reverse Geocoding:** Coordinates → City names
- ✅ **Smart Alerts:** Location-based emergency contacts
- ✅ **Hospital Finder:** Nearby healthcare facilities

## 🚑 How My Systems Work Together

**Emergency Scenario:**
1. **Patient Emergency** → QR code scanned by medical staff
2. **Location Detection** → System identifies patient's current location  
3. **Smart Alerts** → Notifies emergency contacts in same city first
4. **Medical Data Display** → Critical info shown instantly

**Sample QR Scan Result:**
```json
{
    "name": "Patient Name",
    "bloodGroup": "B+", 
    "allergies": ["Peanuts", "Gluten"],
    "conditions": ["Asthma"],
    "emergencyContact": {
        "name": "Emergency Contact",
        "phone": "9499344335",
        "city": "Same City"
    }
}
```

## 🎯 Learning Outcomes

**What I Mastered:**
- **QR Technology:** Generation, scanning, cross-platform compatibility
- **Geolocation APIs:** GPS integration, reverse geocoding
- **Real-time Systems:** Instant data access, emergency response
- **Healthcare Tech:** Medical data standards, emergency workflows
- **Full-Stack Integration:** Frontend QR scanner + Backend API design

## 📁 Project Structure
```
MediQR-Healthcare-Management/
├── client/                 # React Frontend
│   ├── src/pages/
│   │   ├── QRCodePage.jsx     # My QR Generation UI
│   │   ├── QRScannerPage.jsx  # My QR Scanner UI
│   │   └── QRResultPage.jsx   # My Medical Data Display
├── server/                 # Node.js Backend  
│   ├── controllers/
│   │   ├── medicalController.js  # My QR Generation APIs
│   │   └── sosController.js      # My Location Services APIs
│   └── models/
└── Documentation/          # Setup & Contribution Guides
```

## 🔗 Links & Contact

**Repository:** https://github.com/sanketkarwalink/MediQR-Healthcare-Management  
**Original Team Repo:** [Riya's Repository](https://github.com/Riya-dudeja/medical-qr-app)

**Sanket Karwa** - QR & Location Systems Developer  
📧 sanketkarwa.inbox@gmail.com  
🔗 [LinkedIn](https://www.linkedin.com/in/sanketkarwa7/)  
📱 +91-9499344335

---

**🏆 Academic Project - Thapar Institute of Engineering & Technology**  
*Demonstrating practical healthcare technology solutions through innovative QR and location-based systems.*
