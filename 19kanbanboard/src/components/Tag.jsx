import React from 'react';

function Tag({ tagName, selectTag, selected }) {
  const tagStyle = {
    default: {
      backgroundColor: "#e0e0e0",
      color: "#000",
      border: "none",
      borderRadius: "4px",
      padding: "5px 10px",
      margin: "5px",
      cursor: "pointer"
    },
    DSA: { backgroundColor: "#fda821", color: "#fff" },
    WebD: { backgroundColor: "#21a1fd", color: "#fff" },
    Reasoning: { backgroundColor: "#4caf50", color: "#fff" },
    "Current Affairs": { backgroundColor: "#9c27b0", color: "#fff" }
  };

  return (
    <button
      style={{
        ...tagStyle.default,
        ...(selected ? tagStyle[tagName] : {})
      }}
      onClick={() => selectTag(tagName)}
    >
      {tagName}
    </button>
  );
}

export default Tag;
