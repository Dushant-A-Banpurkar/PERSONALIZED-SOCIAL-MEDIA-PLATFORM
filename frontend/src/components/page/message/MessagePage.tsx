import React, { useState } from "react";
import ConversationList from "./ConversationList";

const MessagePage: React.FC = () => {
  const [, setSelectedConversationId] = useState<string | null>(null);

  return (
    <div className="flex h-screen" style={{marginLeft:360}}>
      <ConversationList onSelectConversation={setSelectedConversationId} />
      
    </div>
  );
};

export default MessagePage;
