import React, { useState, useEffect, useContext } from "react";
import { Card, CardContent, Typography, Divider, CircularProgress, Button } from "@mui/material";
import { useLocation } from "react-router-dom";

const MedicalCard = ({ data : propData }) => {
  const location = useLocation();
  const data = propData || location.state?.data || null;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!data) {
      setLoading(false);
      setError(true);
      return;
    }

    // Simulate loading delay
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [data]);

  const renderMissingDataMessage = (field) => (
    <Typography variant="body2" sx={{ color: "gray", fontStyle: "italic" }}>
      {field || "Data Missing"}
    </Typography>
  );

  const flattenArray = (arr) => (Array.isArray(arr) ? arr.flat(Infinity).filter(Boolean) : []);

  // Loading state rendering
  if (loading) {
    return (
      <Card sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2, boxShadow: 3, borderRadius: 8 }}>
        <CardContent>
          <center><CircularProgress /></center>
          <Typography variant="h6" sx={{ mt: 2 }}>Loading Medical Data...</Typography>
        </CardContent>
      </Card>
    );
  }

  // Error state rendering
  if (error) {
    return (
      <Card sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2, boxShadow: 3, borderRadius: 8 }}>
        <CardContent>
          <Typography variant="h6" color="error">Failed to load medical data</Typography>
        </CardContent>
      </Card>
    );
  }

  // Main content rendering
  return (
    <Card sx={{ maxWidth: 400, mx: "auto", mt: 4, p: 2, boxShadow: 3, borderRadius: 8 }}>
      <CardContent>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
          Medical Info
        </Typography>
        <Divider />

        <Typography variant="body1" component="div" sx={{ mt: 2 }}>
          <strong>Name:</strong> {data?.userId?.name || data?.name || "NA"}
        </Typography>

        <Typography variant="body1" component="div">
          <strong>Blood Group:</strong> {data?.bloodGroup || renderMissingDataMessage("Blood Group")}
        </Typography>

        <Typography variant="body1" component="div">
          <strong>Allergies:</strong> {flattenArray(data?.allergies).length ? flattenArray(data.allergies).join(", ") : renderMissingDataMessage("Allergies")}
        </Typography>

        <Typography variant="body1">
          <strong>Conditions:</strong> {flattenArray(data?.conditions).length ? flattenArray(data.conditions).join(", ") : renderMissingDataMessage("Conditions")}
        </Typography>

        <Typography variant="body1" sx={{ mt: 2 }}>
          <strong>Emergency Contacts:</strong>
        </Typography>

        {(data?.emergencyContact || []).map((contact, index) => (
          <div key={index} style={{ marginBottom: 8 }}>
            <Typography variant="body2"><strong>Name:</strong> {contact.name || "N/A"}</Typography>
            <Typography variant="body2"><strong>Relation:</strong> {contact.relation || "N/A"}</Typography>
            <Typography variant="body2"><strong>Phone:</strong> {contact.phone || "N/A"}</Typography>
          </div>
        ))}

      </CardContent>
    </Card>
  );
};

export default MedicalCard;