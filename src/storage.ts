import {UserData} from "./userData";
import {Subject} from "./sockets";
import {FeedbackModel} from "./FeedbackModel";

export class Storage {
    private readonly usersData: Map<string, UserData>
    private readonly subjects: Map<string, Subject>

    constructor(usersData: Map<string, UserData> = new Map<string, UserData>(), subjects: Map<string, Subject> = new Map<string, Subject>()) {
        this.usersData = usersData;
        this.subjects = subjects;
    }

    addSubject(name: string) {
        this.subjects.set(name, {name: name, feedbacks: (new Map<string, FeedbackModel>())})
    }

    getUserData(userId: string): UserData {
        if (!this.usersData.has(userId)) {
            this.usersData.set(userId, new UserData())
        }
        return this.usersData.get(userId)!!
    }

    isFeedbackExists(feedback: FeedbackModel): boolean {
        const subject = this.subjects.get(feedback.subject)
        return subject !== undefined && subject.feedbacks.has(feedback.id!!)
    }

    insertFeedback(feedback: FeedbackModel, userId: string) {
        const subject: (Subject | undefined) = this.getSubject(feedback.subject)
        if (subject !== undefined) {
            subject.feedbacks.set(feedback.id!!, feedback)
            this.getUserData(userId).setFeedbackReaction(feedback)
        }
    }

    upsetFeedback(feedback: FeedbackModel, userId: string): boolean {
        const subject: (Subject | undefined) = this.getSubject(feedback.subject)
        if (subject !== undefined) {
            subject.feedbacks.set(feedback.id!!, feedback)
            this.getUserData(userId).setFeedbackReaction(feedback)
            return true;
        }
        return false
    }

    getSubject(subject: string): (Subject | undefined) {
        return this.subjects.get(subject);
    }

    getAllSubjects(): Array<Subject> {
        return Array.from(this.subjects.values())
    }
}