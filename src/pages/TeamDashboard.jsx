// src/pages/TeamDashboard.jsx
import React from "react";

export default function TeamDashboard() {
  const teamMembers = [
    {
      role: "Founder",
      desc: "Drives overall business vision, strategic growth, and long-term expansion of JP Furnishing across markets.",
    },
    {
      role: "Design & Creative Head",
      desc: "Leads product design, fabric selection, and modern interior styling aligned with current trends.",
    },
    
  ];

  return (
    <div style={styles.page}>
      <div style={styles.headerBox}>
        <p style={styles.smallTag}>Our Team</p>
        <h1 style={styles.heading}>Team Dashboard</h1>
        <p style={styles.subText}>
          A dedicated team working behind JP Furnishing to deliver quality,
          style, and seamless customer experience.
        </p>
      </div>

      <div style={styles.grid}>
        {teamMembers.map((member, index) => (
          <div key={index} style={styles.card}>
            <div style={styles.avatar}>
              {member.role
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </div>

            <h3 style={styles.name}>{member.role}</h3>

            <p style={styles.desc}>{member.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "50px 30px",
    background: "linear-gradient(180deg, #f8f4ef 0%, #f5eee8 100%)",
    fontFamily: "'Segoe UI', sans-serif",
  },
  headerBox: {
    maxWidth: "900px",
    margin: "0 auto 40px",
    textAlign: "center",
  },
  smallTag: {
    margin: 0,
    fontSize: "13px",
    fontWeight: "700",
    color: "#9a6a42",
    textTransform: "uppercase",
    letterSpacing: "1.5px",
  },
  heading: {
    margin: "10px 0 14px",
    fontSize: "46px",
    color: "#3f2b1d",
  },
  subText: {
    margin: 0,
    fontSize: "18px",
    lineHeight: "1.8",
    color: "#6f5a4d",
  },
  grid: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px",
  },
  card: {
    background: "#fff",
    borderRadius: "24px",
    padding: "28px",
    textAlign: "center",
    border: "1px solid #ebddd1",
    boxShadow: "0 12px 28px rgba(88, 57, 36, 0.08)",
    transition: "0.3s",
  },
  avatar: {
    width: "74px",
    height: "74px",
    margin: "0 auto 18px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #6f4a33, #a06d46)",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    fontSize: "20px",
  },
  name: {
    margin: "0 0 10px",
    fontSize: "20px",
    color: "#3f2b1d",
  },
  desc: {
    margin: 0,
    fontSize: "15px",
    lineHeight: "1.7",
    color: "#6d584c",
  },
};