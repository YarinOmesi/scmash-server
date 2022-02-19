import {Reaction} from "./Reaction";

export type FeedbackModel= {
    id: (string|undefined);
    content: string;
    writerNickname: string;
    subject: string;
    reaction: Reaction;

}