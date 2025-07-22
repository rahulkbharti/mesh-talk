import React, { useState } from "react";
import styles from "./VideoChat1.module.css";

export default function VideoChat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [interestInput, setInterestInput] = useState("");
  const [interests, setInterests] = useState([]);

  const handleSend = () => {
    if (newMessage.trim() !== "") {
      setMessages([...messages, { text: newMessage, sender: "You" }]);
      setNewMessage("");
    }
  };

  const handleAddInterest = () => {
    const trimmed = interestInput.trim();
    if (trimmed !== "" && !interests.includes(trimmed)) {
      setInterests([...interests, trimmed]);
      setInterestInput("");
    }
  };

  const handleRemoveInterest = (interest) => {
    setInterests(interests.filter((i) => i !== interest));
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInterest();
    }
  };

  return (
    <div className={styles.container}>
      
      {/* Video Section */}
      <div className={styles.videoSection}>
        <div className={styles.videoBox}>
          <video id="localVideo" autoPlay muted className={styles.video}></video>
        </div>
        <div className={styles.videoBox}>
          <video id="remoteVideo" autoPlay className={styles.video}></video>
        </div>
      </div>

      {/* Chat and Interests */}
      <div className={styles.sidebar}>
        
        {/* Interests */}
        <div>
          <h2 className={styles.sectionTitle}>Your Interests</h2>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Type an interest..."
              value={interestInput}
              onChange={(e) => setInterestInput(e.target.value)}
              onKeyDown={handleInterestKeyDown}
              className={styles.input}
            />
            <button onClick={handleAddInterest} className={styles.button}>
              Add
            </button>
          </div>
          <div className={styles.interests}>
            {interests.map((interest, index) => (
              <div key={index} className={styles.interestTag}>
                {interest}
                <button
                  onClick={() => handleRemoveInterest(interest)}
                  className={styles.removeButton}
                >
                  ❌
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat */}
        <div className={styles.chatBox}>
          <h2 className={styles.sectionTitle}>Chat</h2>
          <div className={styles.messages}>
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`${styles.message} ${
                  msg.sender === "You" ? styles.messageYou : styles.messageOther
                }`}
              >
                <span className={styles.sender}>{msg.sender}:</span> {msg.text}
              </div>
            ))}
          </div>
          <div className={styles.inputGroup}>
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleSend} className={styles.button}>
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
