import React, { useState } from "react";

const PageStyle = {
  page: {
    background: "linear-gradient(180deg, #f8f5ef 0%, #f3efe7 100%)",
    minHeight: "100vh",
    padding: "3.5rem 1.25rem 4rem",
  },

  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },

  headingWrap: {
    textAlign: "center",
    marginBottom: "2.5rem",
  },

  heading: {
    fontSize: "clamp(2rem, 4vw, 3rem)",
    color: "var(--color-accent-gold)",
    marginBottom: "0.75rem",
    fontWeight: "800",
    letterSpacing: "0.5px",
  },

  subHeading: {
    color: "var(--color-text-secondary)",
    fontSize: "1.05rem",
    maxWidth: "720px",
    margin: "0 auto",
    lineHeight: "1.7",
  },

  mainGrid: {
    display: "grid",
    gridTemplateColumns: "1.05fr 1fr",
    gap: "2rem",
    alignItems: "stretch",
  },

  card: {
    background: "#ffffff",
    borderRadius: "22px",
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.04)",
  },

  leftPanel: {
    padding: "2rem",
    height: "100%",
  },

  rightPanel: {
    padding: "2rem",
    height: "100%",
  },

  sectionTitle: {
    color: "var(--color-text-primary)",
    marginBottom: "1.5rem",
    fontSize: "2rem",
    fontWeight: "800",
  },

  infoBlock: {
    borderLeft: "4px solid var(--color-accent-green)",
    paddingLeft: "1.1rem",
    marginBottom: "2rem",
  },

  infoItem: {
    marginBottom: "1.35rem",
  },

  label: {
    fontWeight: "800",
    color: "var(--color-text-primary)",
    display: "block",
    fontSize: "1.2rem",
    marginBottom: "0.35rem",
  },

  value: {
    color: "var(--color-text-secondary)",
    fontSize: "1.08rem",
    lineHeight: "1.8",
    margin: 0,
  },

  link: {
    color: "var(--color-accent-gold)",
    textDecoration: "none",
    fontWeight: "700",
  },

  miniCards: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "1rem",
    marginTop: "1.5rem",
  },

  miniCard: {
    background: "#f9f6ef",
    borderRadius: "16px",
    padding: "1rem",
    border: "1px solid rgba(0,0,0,0.05)",
  },

  miniCardTitle: {
    fontWeight: "800",
    color: "var(--color-text-primary)",
    marginBottom: "0.35rem",
  },

  miniCardText: {
    color: "var(--color-text-secondary)",
    lineHeight: "1.6",
    fontSize: "0.96rem",
    margin: 0,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },

  input: {
    padding: "0.95rem 1rem",
    border: "1px solid #c9d9ef",
    borderRadius: "12px",
    outline: "none",
    fontSize: "1rem",
    background: "#fff",
  },

  textarea: {
    padding: "1rem",
    border: "1px solid #c9d9ef",
    borderRadius: "12px",
    minHeight: "140px",
    resize: "vertical",
    outline: "none",
    fontSize: "1rem",
    background: "#fff",
  },

  submitBtn: {
    background: "var(--color-accent-gold)",
    color: "#fff",
    border: "none",
    borderRadius: "12px",
    padding: "1rem 1.2rem",
    fontSize: "1rem",
    fontWeight: "800",
    cursor: "pointer",
    letterSpacing: "0.4px",
    boxShadow: "0 10px 20px rgba(201, 158, 38, 0.25)",
  },

  mapCard: {
    marginTop: "2rem",
    background: "#fff",
    borderRadius: "22px",
    boxShadow: "0 18px 45px rgba(0, 0, 0, 0.08)",
    overflow: "hidden",
    border: "1px solid rgba(0,0,0,0.04)",
  },

  mapHeader: {
    padding: "1.4rem 1.6rem 0.8rem",
  },

  mapTitle: {
    fontSize: "1.7rem",
    fontWeight: "800",
    color: "var(--color-text-primary)",
    marginBottom: "0.35rem",
  },

  mapSubText: {
    margin: 0,
    color: "var(--color-text-secondary)",
    lineHeight: "1.7",
  },

  mapFrameWrap: {
    padding: "0 1.6rem 1.6rem",
  },

  iframe: {
    width: "100%",
    height: "380px",
    border: "0",
    borderRadius: "18px",
  },
};

function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const whatsappNumber = "917518907218";

  const mapEmbedUrl =
    "https://maps.google.com/maps?q=JP%20Furnishing%20House%2C%20Police%20Chowki%2C%20363%2C%20nearby%20Bangla%20Bazar%2C%20Sector%20J%2C%20Ashiyana%2C%20Lucknow%2C%20Uttar%20Pradesh%20226012&t=&z=16&ie=UTF8&iwloc=&output=embed";

  const googleMapsLink =
    "https://www.google.com/maps/place/J.p.+Furnishing+House/@26.796567,80.9223802,18.96z/data=!4m10!1m2!2m1!1sJ.p.+Furnishing+House,+Sk+Plaza,+Jail+Rd,+near+sbi+Bank,+Sector+J,+Bangla+Bazar,+Lucknow,+Uttar+Pradesh+226012!3m6!1s0x399bfc730299e9c1:0xa98312df54fa5711!8m2!3d26.7965175!4d80.9230543!15sCm5KLnAuIEZ1cm5pc2hpbmcgSG91c2UsIFNrIFBsYXphLCBKYWlsIFJkLCBuZWFyIHNiaSBCYW5rLCBTZWN0b3IgSiwgQmFuZ2xhIEJhemFyLCBMdWNrbm93LCBVdHRhciBQcmFkZXNoIDIyNjAxMpIBD2Z1cm5pdHVyZV9zdG9yZeABAA!16s%2Fg%2F11xrlwm415?entry=ttu&g_ep=EgoyMDI2MDMyNC4wIKXMDSoASAFQAw%3D%3D";

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleWhatsAppSubmit = (e) => {
    e.preventDefault();

    const message = `✨ *JP Furnishing Inquiry*

Name: ${formData.name}
Email: ${formData.email}
Subject: ${formData.subject}

Message:
${formData.message}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappWebUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappWebUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <div style={PageStyle.page}>
      <div style={PageStyle.container}>
        <div style={PageStyle.headingWrap}>
          <h1 style={PageStyle.heading}>Get In Touch With JP Furnishing House</h1>
          <p style={PageStyle.subHeading}>
            Visit our store in Lucknow or send us your inquiry directly on WhatsApp.
            We are here to help you with curtains, bedsheets, sofa covers, pillow
            covers, doormats, and custom furnishing needs.
          </p>
        </div>

        <div
          style={{
            ...PageStyle.mainGrid,
            gridTemplateColumns:
              typeof window !== "undefined" && window.innerWidth <= 900
                ? "1fr"
                : "1.05fr 1fr",
          }}
        >
          <div style={PageStyle.card}>
            <div style={PageStyle.leftPanel}>
              <h2 style={PageStyle.sectionTitle}>Contact Details</h2>

              <div style={PageStyle.infoBlock}>
                <div style={PageStyle.infoItem}>
                  <span style={PageStyle.label}>Phone</span>
                  <p style={PageStyle.value}>
                    <a href="tel:+917518907218" style={PageStyle.link}>
                      +91 7518907218
                    </a>
                  </p>
                </div>

                <div style={PageStyle.infoItem}>
                  <span style={PageStyle.label}>WhatsApp</span>
                  <p style={PageStyle.value}>
                    <a
                      href="https://wa.me/917518907218"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={PageStyle.link}
                    >
                      Chat on WhatsApp
                    </a>
                  </p>
                </div>

                <div style={PageStyle.infoItem}>
                  <span style={PageStyle.label}>Address</span>
                  <p style={PageStyle.value}>
                    JP Furnishing House, Police Chowki, 363, nearby Bangla Bazar,
                    Sector J, Ashiyana, Lucknow, Uttar Pradesh 226012
                  </p>
                </div>

                <div style={PageStyle.infoItem}>
                  <span style={PageStyle.label}>Store Hours</span>
                  <p style={PageStyle.value}>
                    Open every day except Tuesday
                    <br />
                    11:00 AM - 9:00 PM
                  </p>
                </div>

                <div style={PageStyle.infoItem}>
                  <span style={PageStyle.label}>Google Maps</span>
                  <p style={PageStyle.value}>
                    <a
                      href={googleMapsLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={PageStyle.link}
                    >
                      Open location in Google Maps
                    </a>
                  </p>
                </div>
              </div>

              <div style={PageStyle.miniCards}>
                <div style={PageStyle.miniCard}>
                  <div style={PageStyle.miniCardTitle}>Visit Store</div>
                  <p style={PageStyle.miniCardText}>
                    Explore fabrics, designs, shades, and furnishing options in person.
                  </p>
                </div>

                <div style={PageStyle.miniCard}>
                  <div style={PageStyle.miniCardTitle}>Quick Response</div>
                  <p style={PageStyle.miniCardText}>
                    Send your inquiry through WhatsApp for faster communication.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div style={PageStyle.card}>
            <div style={PageStyle.rightPanel}>
              <h2 style={PageStyle.sectionTitle}>Send Us a Message</h2>

              <form style={PageStyle.form} onSubmit={handleWhatsAppSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  required
                  style={PageStyle.input}
                  value={formData.name}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  required
                  style={PageStyle.input}
                  value={formData.email}
                  onChange={handleChange}
                />

                <input
                  type="text"
                  name="subject"
                  placeholder="Subject"
                  required
                  style={PageStyle.input}
                  value={formData.subject}
                  onChange={handleChange}
                />

                <textarea
                  name="message"
                  placeholder="Write your message here..."
                  required
                  style={PageStyle.textarea}
                  value={formData.message}
                  onChange={handleChange}
                />

                <button type="submit" style={PageStyle.submitBtn}>
                  SEND INQUIRY ON WHATSAPP
                </button>
              </form>
            </div>
          </div>
        </div>

        <div style={PageStyle.mapCard}>
          <div style={PageStyle.mapHeader}>
            <h2 style={PageStyle.mapTitle}>Find Us on Google Map</h2>
            <p style={PageStyle.mapSubText}>
              JP Furnishing House is located near Bangla Bazar, Sector J, Ashiyana,
              Lucknow. You can use the live map below for directions.
            </p>
          </div>

          <div style={PageStyle.mapFrameWrap}>
            <iframe
              title="JP Furnishing House Location"
              src={mapEmbedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              style={PageStyle.iframe}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Contact;