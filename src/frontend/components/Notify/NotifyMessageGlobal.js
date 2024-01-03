import React, { useCallback, useEffect, useState } from "react";
import { BehaviorSubject } from "rxjs";
import NotifyMessage from "./NotifyMessage";

const notifyMessageSubject = new BehaviorSubject(null);

export const showNotifyMessage = (notifyMessageObject) => {
  notifyMessageSubject.next(notifyMessageObject);
};

export const createNotifyMessage = (type, content, displayTime = 6000) => ({
  id: Math.floor(Math.random(0, 1) * Math.pow(10, 10)).toString(),
  type,
  values: {
    content,
  },
  displayTime,
});

export const NotifyTypes = {
  SUCCESS: "success",
  FAILURE: "danger",
  WARNING: "warning",
};

function NotifyMessageGlobal(props) {
  //   const {  } = props;

  const [listNotifyMessage, setListNotifyMessage] = useState([]);

  const onCloseItem = useCallback((id) => {
    setListNotifyMessage((curState) =>
      curState.filter((item) => item.id !== id)
    );
  }, []);

  const onCloseAllItem = useCallback(() => setListNotifyMessage([]), []);

  const onRenderNotifyMessage = useCallback((NotifyData) => {
    if (NotifyData)
      setListNotifyMessage((curState) => [...curState, NotifyData]);
  }, []);

  useEffect(() => {
    notifyMessageSubject.subscribe((NotifyData) =>
      onRenderNotifyMessage(NotifyData)
    );
  }, [onRenderNotifyMessage]);

  return (
    listNotifyMessage.length > 0 && (
      <NotifyMessage
        listNotifyMessage={listNotifyMessage}
        onClose={onCloseAllItem}
        onCloseItem={onCloseItem}
      />
    )
  );
}

export default NotifyMessageGlobal;
