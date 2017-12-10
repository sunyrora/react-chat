
import firebase from 'firebase';
import FireApp from './FireApp';

const firebaseApp = FireApp.getApp();

const CHAT_MESSAGES = 'chat-messages';

class DBManager {
  constructor() {
    this.isInit = false;

    this.database = firebaseApp.database();
    this.rootRef = null;
    this.chatMessagesRef = null;

    this.init();
  }

  init() {
    if(this.isInit) return;

    this.rootRef = this.database.ref();
    this.chatMessagesRef = this.database.ref(CHAT_MESSAGES);
    this.isInit = true;
  }

  setChatMessagesHandler(handler) {
    if(!handler) return Promise.reject(new Error("Invalid handler"));
    if(!this.chatMessagesRef) return Promise.reject(new Error("no chatMessagesRef"));

    this.chatMessagesRef.on('child_added', handler);

    return Promise.resolve(true);
  }

  removeChatMessageHandler() {
    if(!this.chatMessagesRef) return Promise.reject(new Error("no chatMessagesRef"));
    this.chatMessagesRef.off();
    return Promise.resolve(true);

  }

  sendMessage(message) {
    if(!this.chatMessagesRef) return Promise.reject(new Error("no chatMessagesRef"));
    
    const newChatRef = this.chatMessagesRef.push();
    const msgId = newChatRef.key;
    const currentUser = firebase.auth().currentUser;
    if(!currentUser) return Promise.reject(new Error("no user!"));

    const msgObj = {
      id: msgId,
      message: {
        createdAt: Date.now(),
        text: message,
        userId: currentUser.uid,
        userName: currentUser.displayName,
      },
    };

    // console.log("DBManager:: build message: ", msgObj);
    let update = {};
    update[[CHAT_MESSAGES, msgId].join('/')] = msgObj;
    return this.rootRef.update(update);
  }

  closeDB() {
    // console.log("DbManager::closeDB=================");
    if(this.chatMessagesRef) this.chatMessagesRef.off();
    this.isInit = false;
  }
}


export default new DBManager();