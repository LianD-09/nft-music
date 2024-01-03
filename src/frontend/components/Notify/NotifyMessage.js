import React, { useEffect } from "react";
import { Alert } from "react-bootstrap";
import { NotifyTypes } from "./NotifyMessageGlobal";
import "./index.css";

const MAX_NOTIFY_DISPLAY = 3;

function NotifyMessageItem(props) {
  const { type, content, displayTime, onClose = () => {} } = props;

  const onClickNotify = () => {
    onClose();
  };

  useEffect(() => {
    setTimeout(() => {
      onClose();
    }, displayTime);
  }, [displayTime, onClose]);

  return (
    // <div
    //   role="presentation"
    //   className="message-notifyMessage-item"
    //   onClick={onClickNotify}
    // >
    //   <div
    //     className="message-notifyMessage-topbar"
    //     style={{
    //       backgroundColor:
    //         type === NotifyTypes.SUCCESS
    //           ? "#52c41a"
    //           : type === NotifyTypes.FAILURE
    //           ? "#ff4d4f"
    //           : "#faad14",
    //     }}
    //   />
    //   <div style={{ display: "flex", flexDirection: "row" }}>
    //     <button
    //       className="message-notifyMessage-closeIcon"
    //       onClick={(e) => {
    //         e.stopPropagation();
    //         onClose();
    //       }}
    //     >
    //       <i className="bi bi-x-circle"></i>
    //     </button>
    //     <div className="message-notifyMessage-content">
    //       <div>
    //         {content && (
    //           <span
    //             style={{
    //               color: "#545454",
    //               fontSize: 13,
    //               display: "inline-block",
    //               width: "100%",
    //               whiteSpace: "nowrap",
    //               overflow: "hidden",
    //               textOverflow: "ellipsis",
    //             }}
    //           >
    //             {content}
    //           </span>
    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </div>
    <div
      role="presentation"
      className="message-notifyMessage-item"
      onClick={onClickNotify}
    >
      <Alert variant={type} onClose={() => onClickNotify()} dismissible>
        {content}
      </Alert>
    </div>
  );
}

function NotifyMessage(props) {
  const { listNotifyMessage, onCloseItem } = props;

  return (
    <div className="message-notifyMessage">
      {listNotifyMessage
        .slice(Math.max(listNotifyMessage.length - MAX_NOTIFY_DISPLAY, 0))
        .map((item) => {
          const { id, type, values, displayTime } = item;
          const { content } = values;
          return (
            <NotifyMessageItem
              key={id}
              type={type}
              content={content}
              displayTime={displayTime}
              onClose={() => {
                onCloseItem(id);
              }}
            />
          );
        })}
    </div>
  );
}

export default NotifyMessage;
