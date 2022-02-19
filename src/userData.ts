import {Reaction} from "./Reaction";
import {FeedbackModel} from "./FeedbackModel";

export class UserData {
    private feedbacksReactions: Map<string, Reaction>

    constructor(feedbacksReactions: Map<string, Reaction> = new Map<string, Reaction>()) {
        this.feedbacksReactions = feedbacksReactions;
    }

    getFeedbackReaction(feedbackId: string): Reaction {
        const reaction:(Reaction | undefined) =  this.feedbacksReactions.get(feedbackId)

        return reaction === undefined? Reaction.NoReaction : reaction
    }
    setFeedbackReaction(feedback:FeedbackModel){
        this.feedbacksReactions.set(feedback.id!!,feedback.reaction)
    }
}