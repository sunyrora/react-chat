
import firebase from 'firebase';
import FireApp from './FireApp';

const firebaseApp = FireApp.getApp();

const CHAT_MESSAGES = 'chat-messages';
const MESSAGE = 'message';
const CREATED_AT = 'createdAt';
const LOAD_COUNT = 10;

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

  setChatMessagesHandler(handler, count=LOAD_COUNT) {
    if(!handler) return Promise.reject(new Error("Invalid handler"));
    if(!this.chatMessagesRef) return Promise.reject(new Error("no chatMessagesRef"));

    this.chatMessagesRef.limitToLast(count).on('child_added', handler);

    return Promise.resolve(true);
  }

  removeChatMessageHandler() {
    if(!this.chatMessagesRef) return Promise.reject(new Error("no chatMessagesRef"));
    this.chatMessagesRef.off();
    return Promise.resolve(true);

  }

  /**
   * 
   * @param {*} from 
   * @param {*} count 
   */
  loadOldMessages(from, count=LOAD_COUNT) {
    if(!this.chatMessagesRef) return Promise.reject(new Error("no chatMessagesRef"));

    const newMessagesPromise = this.chatMessagesRef.orderByChild([MESSAGE, CREATED_AT].join('/')).endAt(from-1).limitToLast(count).once('value'); // load messages where 'createdAT' is less than 'form'

    return newMessagesPromise.then(snap=>{
      return snap.val();
    });    
      
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