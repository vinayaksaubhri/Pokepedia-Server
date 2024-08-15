import { customAlphabet } from "nanoid";
const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const generateRoomId = customAlphabet(alphabet, 6);
export default generateRoomId;
